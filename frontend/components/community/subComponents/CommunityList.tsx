"use client";
import { cn } from "@/lib/utils";
import { Server } from "@/types/server";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import useSWRMutation from "swr/mutation";
import { apiClient } from "@/lib/apiClient";
import { useState, useEffect } from "react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

type ServerActionArg = {
  serverId: string;
  action: "join" | "leave";
  accessToken: string;
};

async function serverActionRequest(key: string, { arg }: any) {
  const url = `${BACKEND_URI}/api/v1/profile/${arg.action}-server/${arg.serverId}`;
  return apiClient(url, arg.accessToken, { method: "POST" });
}

export default function CommunityList({
  communities,
  onSelectCommunity,
  selectedCommunityId,
}: any) {
  const { user } = useAuth();
  const { data: session } = useSession();
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, "join" | "leave" | null>
  >({});
  const { trigger: performAction, isMutating } = useSWRMutation<
    any,
    any,
    string,
    ServerActionArg
  >("server-action", serverActionRequest);

  const handleCommunityAction = async (
    communityToUpdate: Server,
    action: "join" | "leave"
  ) => {
    if (!session?.appJwt || !user?.id) return;
    setOptimisticUpdates((prev) => ({
      ...prev,
      [communityToUpdate._id]: action,
    }));
    try {
      await performAction({
        serverId: communityToUpdate._id,
        action,
        accessToken: session.appJwt,
      });
    } catch (error) {
      console.error(`Failed to ${action} server:`, error);
    } finally {
      setOptimisticUpdates((prev) => ({
        ...prev,
        [communityToUpdate._id]: null,
      }));
    }
  };

  const getMembershipStatus = (community: Server) => {
    const optimisticUpdate = optimisticUpdates[community._id];
    if (optimisticUpdate === "join") return true;
    if (optimisticUpdate === "leave") return false;
    return community.members.some((member) => member.user === user?.id);
  };

  return (
    <ul className="space-y-2">
      {communities?.map((community: Server) => {
        const isMember = getMembershipStatus(community);
        const isOwner = community.owner._id === user?.id;

        if (community.visibility === "private" && !isMember && !isOwner)
          return null;

        return (
          <li key={community._id} className="flex items-center gap-3">
            <button
              onClick={() => onSelectCommunity(community)}
              className={cn(
                "relative flex-1 rounded-lg p-3 text-left transition-all duration-200 flex flex-col items-start overflow-hidden",
                selectedCommunityId === community._id
                  ? "bg-black/10 dark:bg-white/10"
                  : "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
              )}
            >
              <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                {community.name}
              </p>
              <p className="mt-1 truncate text-sm text-neutral-600 dark:text-neutral-400">{`Members: ${community.members.length}`}</p>
              {selectedCommunityId === community._id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
              )}
            </button>
            {!isOwner && community.visibility !== "invite-only" && (
              <button
                onClick={() =>
                  handleCommunityAction(community, isMember ? "leave" : "join")
                }
                disabled={isMutating && !!optimisticUpdates[community._id]}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1 text-xs font-semibold transition disabled:opacity-50",
                  isMember
                    ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
                    : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
                )}
              >
                {isMember ? "Leave" : "Join"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
