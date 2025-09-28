"use client";
import React from "react";
import { IconUsers, IconLoader2 } from "@tabler/icons-react";
import { useServerDetails } from "@/hooks/useServerDetails";
import { CommunityView } from "../communityDetail/CommunityView";

const ThemedState = ({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/20 border border-white/10">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-bold text-neutral-100">{title}</h2>
      <p className="mt-2 text-sm text-neutral-400">{message}</p>
    </div>
  </div>
);

export default function CommunityDetail({
  selectedCommunityId,
}: {
  selectedCommunityId: string | null;
}) {
  const { server, isLoading, error } = useServerDetails(selectedCommunityId);

  if (!selectedCommunityId) {
    return (
      <ThemedState
        icon={<IconUsers size={40} className="text-neutral-400" />}
        title="Welcome!"
        message="Select a community from the list to see its details."
      />
    );
  }

  if (isLoading) {
    return (
      <ThemedState
        icon={
          <IconLoader2 size={40} className="animate-spin text-neutral-400" />
        }
        title="Loading Community"
        message="Fetching details from the network..."
      />
    );
  }

  if (error || !server) {
    return (
      <p className="p-4 text-center text-red-400">
        Failed to load community details. Please try again.
      </p>
    );
  }

  return <CommunityView community={server} />;
}
