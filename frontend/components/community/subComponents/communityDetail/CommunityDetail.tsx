"use client";
import React from "react";
import { IconUsers, IconLoader2 } from "@tabler/icons-react";
import { useServerDetails } from "@/hooks/useServerDetails";
import { CommunityView } from "./CommunityView";

const LoadingState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4">
    <IconLoader2 size={48} className="animate-spin text-neutral-500" />
    <p className="text-neutral-500">Loading Community...</p>
  </div>
);
const EmptyState = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
        <IconUsers size={40} className="text-neutral-500" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
        Welcome!
      </h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Select a community from the list to see its details.
      </p>
    </div>
  </div>
);

export default function CommunityDetail({
  selectedCommunityId,
}: {
  selectedCommunityId: string | null;
}) {
  const { server, isLoading, error } = useServerDetails(selectedCommunityId);

  const renderContent = () => {
    if (!selectedCommunityId) return <EmptyState />;
    if (isLoading) return <LoadingState />;
    if (error || !server)
      return (
        <p className="p-4 text-center text-red-500">
          Failed to load community details.
        </p>
      );
    return <CommunityView community={server} />;
  };

  return <div className="h-full w-full">{renderContent()}</div>;
}
