"use client";

import { CommunityView } from "@/components/community/subComponents/communityDetail/CommunityView";
import { useCommunity } from "@/context/CommunityContext";
import React from "react";
import { CommunityViewSkeleton, EmptyState } from "@/components/Loaders";
import { IconAlertTriangle } from "@tabler/icons-react";

export default function ChannelPage({
  params,
}: {
  params: { serverId: string; channelId: string };
}) {
  const { channelId } = params;
  const { server, isLoading } = useCommunity();

  if (isLoading) {
    return <CommunityViewSkeleton />;
  }

  if (!server) {
    return (
      <EmptyState
        icon={<IconAlertTriangle size={48} className="text-red-500" />}
        title="Error"
        description="Could not load server details. It might not exist or you don't have permission to view it."
      />
    );
  }

  return <CommunityView initialChannelId={channelId} />;
}
