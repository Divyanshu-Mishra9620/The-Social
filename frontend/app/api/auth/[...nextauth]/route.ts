import NextAuth, { NextAuthOptions } from "next-auth";
import { encode, JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import { User } from "next-auth";

import { z } from "zod";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_BACKEND_URI: z.string().url().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

const backendApiService = {
  async authenticateWithCredentials(credentials: Record<string, string>) {
    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URI}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Authentication failed");
    }
    return data.user;
  },
  async findOrCreateUserByProvider(
    profile: any,
    provider: string,
    existingUserId?: string
  ) {
    const endpoint = existingUserId
      ? "/api/v1/auth/link-provider"
      : "/api/v1/auth/provider-login";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          profilePic: profile.picture,
          provider,
          providerAccountId: profile.sub,
          userId: existingUserId,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 409 && data.code === "ACCOUNT_EXISTS_WITH_PASSWORD") {
        throw new Error("ACCOUNT_EXISTS_WITH_PASSWORD");
      }
      throw new Error(data.message || "Provider sign-in failed");
    }
    return data.user;
  },
};

const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const TIME_WINDOW_MS = 15 * 60 * 1000;

const isRateLimited = (email: string): boolean => {
  const record = loginAttempts.get(email);
  const now = Date.now();
  if (!record || now - record.timestamp > TIME_WINDOW_MS) {
    loginAttempts.set(email, { count: 1, timestamp: now });
    return false;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return true;
  }
  record.count++;
  loginAttempts.set(email, record);
  return false;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: any
      ): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await backendApiService.authenticateWithCredentials(
            credentials
          );

          if (!user?._id) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.profilePic,
            role: user.role,
            emailVerified: user.emailVerified,
          };
        } catch (error: any) {
          console.error("Authorization Error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const backendUser =
            await backendApiService.findOrCreateUserByProvider(
              profile,
              "google"
            );
          user.id = backendUser._id;
          user.role = backendUser.role;
        } catch (error: any) {
          if (error.message === "ACCOUNT_EXISTS_WITH_PASSWORD") {
            throw new Error(
              `To connect your Google account, please sign in with your password first.&error_code=${error.message}`
            );
          }
          console.error("Google signIn callback error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user && user.id && user.email) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        const payload = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
        session.appJwt = jwt.sign(payload, env.NEXTAUTH_SECRET, {
          expiresIn: "30d",
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
