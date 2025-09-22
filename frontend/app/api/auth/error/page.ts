"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <h1>Authentication Error</h1>
      <p>
        You already signed in with another provider. Please use the same method
        to sign in.
      </p>
      <Button onClick={() => router.back()}>Back</Button>
    </>
  );
}
