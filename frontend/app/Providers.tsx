"use client";

import AuthProvider from "@/components/AuthProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
