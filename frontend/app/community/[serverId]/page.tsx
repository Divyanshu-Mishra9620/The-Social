"use client";

import { CommunityView } from "@/components/community/subComponents/communityDetail/CommunityView";
import { useCommunity } from "@/context/CommunityContext";
import { IconLoader2 } from "@tabler/icons-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServerPage({
  params,
}: {
  params: { serverId: string };
}) {
  const { serverId } = params;
  const { server, isLoading } = useCommunity();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && server && server.categories[0]?.channels[0]) {
      router.replace(
        `/community/${serverId}/${server.categories[0].channels[0]._id}`
      );
    }
  }, [isLoading, server, serverId, router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconLoader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <p>Loading server...</p>
    </div>
  );
}
