"use client";

import { useCommunity } from "@/context/CommunityContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandedLoader } from "@/components/Loaders";

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

  return (
    <div className="flex h-full w-full items-center justify-center">
      <BrandedLoader size={64} />
    </div>
  );
}
