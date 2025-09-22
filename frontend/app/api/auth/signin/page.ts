"use client";

import { useState, useEffect } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { motion } from "framer-motion";

import Link from "next/link";
import "@/app/_styles/global.css";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google Sign-In error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const saveUserToDatabase = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        const { name, email, image: profilePic } = session.user;

        const response = await fetch(`${BACKEND_URI}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, profilePic }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        if (isSubscribed && typeof window !== "undefined") {
          try {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            router.push("/");
          } catch (storageErr) {
            console.error("Storage error:", storageErr);
            setError("Failed to save authentication data");
          }
        }
      } catch (err) {
        if (isSubscribed) {
          setError("Authentication failed. Please try again.");
          console.error("Auth error:", err);
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    if (status === "authenticated") {
      saveUserToDatabase();
    }

    return () => {
      isSubscribed = false;
    };
  }, [session, status, router]);

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const backendRes = await fetch(`${BACKEND_URI}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await backendRes.json();

      if (!backendRes.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      } else return null;

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      const session = await getSession();

      if (session?.user) {
        localStorage.setItem("user", JSON.stringify(session.user));
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-8">
          Welcome Back
        </h1>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all"
        >
          <FcGoogle className="text-xl" />
          <span>Sign in with Google</span>
        </motion.button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-700" />
          <span className="px-3 text-gray-400 text-sm">OR CONTINUE WITH</span>
          <hr className="flex-grow border-gray-700" />
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 bg-red-900/20 text-red-400 text-sm rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            <AiOutlineMail className="text-lg" />
            {loading ? "Signing in..." : "Sign in with Email"}
          </motion.button>
        </form>

        <div className="flex flex-col items-center gap-3 mt-6 text-gray-400">
          <div className="flex items-center gap-2">
            <span>Don't have an account?</span>
            <Link
              href="/api/auth/register"
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
