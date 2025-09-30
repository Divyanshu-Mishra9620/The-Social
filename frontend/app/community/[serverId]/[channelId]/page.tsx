"use client";

import { CommunityView } from "@/components/community/subComponents/communityDetail/CommunityView";
import { useCommunity } from "@/context/CommunityContext";
import React from "react";
import { CommunityViewSkeleton } from "@/components/Loaders";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>;
}) {
  const { channelId } = React.use(params);
  const { server, isLoading } = useCommunity();
  console.log("server", server, "isLoading", isLoading);

  if (isLoading) {
    return <CommunityViewSkeleton />;
  }

  if (!server) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">Could not load server details.</p>
      </div>
    );
  }

  return <CommunityView community={server} initialChannelId={channelId} />;
}
