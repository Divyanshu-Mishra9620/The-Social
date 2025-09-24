"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">Welcome to the Platform</h1>
        <p className="mt-4 text-lg text-neutral-400">
          Connect, chat, and build communities.
        </p>
        <div className="mt-8 space-x-4">
          {session ? (
            <>
              <button
                onClick={() => router.push("/community")}
                className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Community Hub
              </button>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-neutral-700 px-6 py-3 font-semibold text-white transition hover:bg-neutral-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Login or Sign Up
            </button>
          )}
        </div>
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
