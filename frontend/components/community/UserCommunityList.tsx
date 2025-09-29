"use client";
import { Server } from "@/types/server";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

interface ServerActionArgs {
  serverId: string;
  action: "join" | "leave";
  accessToken: string;
}

async function serverActionRequest(
  key: string,
  { arg }: { arg: ServerActionArgs }
) {
  const url = `${BACKEND_URI}/api/v1/profile/${arg.action}-server/${arg.serverId}`;
  return apiClient(url, arg.accessToken, { method: "POST" });
}

export function UserCommunityList({ communities }: { communities: Server[] }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const selectedCommunityId = params.serverId as string;

  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Record<string, "join" | "leave" | null>
  >({});

  const { trigger: performAction, isMutating } = useSWRMutation(
    "server-action",
    serverActionRequest
  );

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
    return community.members.some((member: any) => member.user === user?.id);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2
        className="mb-4 text-sm font-semibold uppercase tracking-wider px-2"
        style={{ color: colors.textTertiary }}
      >
        Your Communities
      </h2>
      <ul className="space-y-1 no-scrollbar flex-1 overflow-y-auto">
        {communities?.map((community) => {
          const isMember = getMembershipStatus(community);
          const isOwner = community.owner._id === user?.id;

          if (community.visibility === "private" && !isMember && !isOwner)
            return null;

          return (
            <li
              key={community._id}
              className="flex items-center justify-between gap-2"
            >
              <motion.button
                onClick={() => router.push(`/community/${community._id}`)}
                style={{
                  backgroundColor:
                    selectedCommunityId === community._id
                      ? colors.surfaceActive
                      : "transparent",
                  borderColor:
                    selectedCommunityId === community._id
                      ? colors.border
                      : "transparent",
                }}
                className={`relative flex flex-1 items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 overflow-hidden ${
                  selectedCommunityId === community._id
                    ? "border"
                    : "hover:bg-opacity-50"
                }`}
                whileHover={{ backgroundColor: colors.hover }}
              >
                <img
                  src={community.imageUrl || "/default-avatar.png"}
                  alt={community.name}
                  className="h-10 w-10 rounded-lg object-cover ring-1 ring-black/5" // ringColor is not a valid style property
                />

                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: colors.textPrimary }}
                  >
                    {community.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: colors.textTertiary }}
                  >
                    {community.members.length}{" "}
                    {community.members.length === 1 ? "member" : "members"}
                  </p>
                </div>
              </motion.button>

              {!isOwner &&
                !isMember &&
                community.visibility !== "invite-only" && (
                  <button
                    onClick={() => handleCommunityAction(community, "join")}
                    disabled={isMutating}
                    style={{
                      backgroundColor: colors.primary,
                      color: "#ffffff",
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 disabled:opacity-50 hover:scale-105"
                  >
                    Join
                  </button>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
