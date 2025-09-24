"use client";

import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { IconX, IconCamera, IconBrandGoogle } from "@tabler/icons-react";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormInput = ({ id, label, type, value, onChange, placeholder }: any) => (
  <div>
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-medium uppercase text-neutral-600 dark:text-neutral-400"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full rounded-md border border-neutral-300 bg-transparent px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:text-neutral-200 dark:focus:ring-blue-600"
    />
  </div>
);

const SocialButton = ({
  provider,
  children,
}: {
  provider: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={() => signIn(provider)}
    className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 py-2.5 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
  >
    {children}
  </button>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/auth/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await handleLogin(e);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-neutral-900"
          >
            <div className="relative text-center">
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                {view === "login" ? "Welcome Back!" : "Create an Account"}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {view === "login"
                  ? "Sign in to continue to your communities."
                  : "Join us and start connecting."}
              </p>
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="my-6">
              <SocialButton provider="google">
                <IconBrandGoogle size={20} />
                <span className="text-sm font-medium">
                  Continue with Google
                </span>
              </SocialButton>
            </div>
            <div className="my-6 flex items-center gap-4">
              <hr className="w-full border-t border-neutral-300 dark:border-neutral-700" />
              <span className="text-xs text-neutral-500">OR</span>
              <hr className="w-full border-t border-neutral-300 dark:border-neutral-700" />
            </div>

            {view === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <FormInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <FormInput
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative h-20 w-20 rounded-full border-2 border-dashed border-neutral-300 transition-colors hover:border-blue-500"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <IconCamera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-hover:text-blue-500" />
                    )}
                  </button>
                </div>
                <FormInput
                  id="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  placeholder="Your Name"
                />
                <FormInput
                  id="email-reg"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <FormInput
                  id="password-reg"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="Must be at least 6 characters"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              </form>
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-red-500">{error}</p>
            )}

            <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
              {view === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() => {
                  setView(view === "login" ? "register" : "login");
                  setError(null);
                }}
                className="ml-2 font-semibold text-blue-600 hover:underline"
              >
                {view === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
