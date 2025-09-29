"use client";

import { useUserServers } from "@/hooks/useUserServers";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconLoader2, IconMessage } from "@tabler/icons-react";

export default function CommunityRedirectPage() {
  const { userServers, isLoading } = useUserServers();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userServers.length > 0) {
      router.replace(`/community/${userServers[0]._id}`);
    }
  }, [isLoading, userServers, router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconLoader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IconMessage size={48} className="mx-auto text-gray-500" />
        <h2 className="mt-4 text-2xl font-bold">Welcome to your @me page</h2>
        <p className="mt-2 text-gray-500">Select a server to start chatting.</p>
      </div>
    </div>
  );
}
