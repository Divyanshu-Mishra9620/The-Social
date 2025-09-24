"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export const useAuth = (required = false) => {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (required && !isLoading && !isAuthenticated) {
      signIn(undefined, { callbackUrl: window.location.pathname });
    }
  }, [required, isLoading, isAuthenticated, router]);

  const refreshSession = async () => {
    await updateSession();
  };

  const user = useMemo(() => session?.user ?? null, [session]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    refreshSession,
  };
};
