"use client";

import { CommunityView } from "@/components/community/subComponents/communityDetail/CommunityView";
import { useCommunity } from "@/context/CommunityContext";
import { IconLoader2 } from "@tabler/icons-react";
import React from "react";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>;
}) {
  const { serverId, channelId } = React.use(params);

  const { server, isLoading } = useCommunity();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconLoader2 className="animate-spin" size={40} />
      </div>
    );
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
