import { signOut } from "next-auth/react";

export const apiClient = async (
  url: string,
  token: string,
  options: RequestInit = {}
) => {
  const defaultOptions: RequestInit = {
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, defaultOptions);

  if (res.status === 401) {
    await signOut({ callbackUrl: "/auth/signin" });
    throw new Error("Session expired. Signing out.");
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "An API error occurred.");
  }

  return res.json();
};
