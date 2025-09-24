"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  if (errorCode === "ACCOUNT_EXISTS_WITH_PASSWORD") {
    return (
      <div>
        <h1>Link Your Account</h1>
        <p>An account with this email already exists.</p>
        <p>{error}</p>
        <Link href="/auth/signin">
          <button>Sign in with Password</button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{error || "An unexpected error occurred."}</p>
      <Link href="/">
        <button>Back to Sign In</button>
      </Link>
    </div>
  );
}
