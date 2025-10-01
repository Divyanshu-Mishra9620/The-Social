"use client";

import { useCommunity } from "@/context/CommunityContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandedLoader, EmptyState } from "@/components/Loaders";
import { IconMessageOff } from "@tabler/icons-react";

export default function ServerPage({
  params,
}: {
  params: { serverId: string };
}) {
  const { serverId } = params;
  const { server, isLoading } = useCommunity();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && server) {
      const firstChannel = server.categories[0]?.channels[0];
      if (firstChannel) {
        router.replace(`/community/${serverId}/${firstChannel._id}`);
      }
    }
  }, [isLoading, server, serverId, router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <BrandedLoader size={64} />
      </div>
    );
  }

  return (
    <EmptyState
      icon={<IconMessageOff size={48} className="text-gray-400" />}
      title="No Channels Here"
      description="This community doesn't have any channels yet. Check back later!"
    />
  );
}
