import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const BACKEND_URI: string = process.env.NEXT_PUBLIC_BACKEND_URI || "";

interface BackendUser {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  profilePic?: string;
  emailVerified?: boolean;
}

const loginAttempts = new Map<string, { count: number; timestamp: number }>();

const isRateLimited = (email: string): boolean => {
  const attempts = loginAttempts.get(email) || {
    count: 0,
    timestamp: Date.now(),
  };
  const timeWindow = 15 * 60 * 1000;
  if (Date.now() - attempts.timestamp > timeWindow) {
    loginAttempts.set(email, { count: 1, timestamp: Date.now() });
    return false;
  }

  if (attempts.count >= 5) return true;

  attempts.count++;
  loginAttempts.set(email, attempts);
  return false;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        if (isRateLimited(credentials.email)) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          const res = await fetch(`${BACKEND_URI}/api/auth/check-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          const user: BackendUser = data.user;
          if (!user?._id) {
            throw new Error("Invalid user data received");
          }

          loginAttempts.delete(credentials.email);

          return {
            id: user._id,
            name: user.name || "User",
            email: user.email,
            image: user.profilePic,
            role: user.role || "user",
            emailVerified: user.emailVerified || false,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email_verified?: boolean };
        return googleProfile.email_verified || false;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
