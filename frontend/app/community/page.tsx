"use client";

import { useUserServers } from "@/hooks/useUserServers";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconMessage } from "@tabler/icons-react";
import { BrandedLoader, EmptyState } from "@/components/Loaders";

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
        <BrandedLoader size={64} />
      </div>
    );
  }

  if (userServers.length === 0) {
    return (
      <EmptyState
        icon={<IconMessage size={48} className="text-gray-400" />}
        title="Welcome!"
        description="You haven't joined any communities yet. Find one to join or create your own to get started."
      />
    );
  }

  return null;
}
