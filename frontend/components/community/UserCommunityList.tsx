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
  const { theme } = useTheme();
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
      <h2 className="mb-4 text-lg font-semibold">Your Communities</h2>
      <ul className="space-y-2 no-scrollbar flex-1 overflow-y-auto">
        {communities?.map((community) => {
          const isMember = getMembershipStatus(community);
          const isOwner = community.owner._id === user?.id;

          if (community.visibility === "private" && !isMember && !isOwner)
            return null;

          return (
            <li
              key={community._id}
              className="flex items-center justify-between gap-3"
            >
              <motion.button
                onClick={() => router.push(`/community/${community._id}`)}
                className={`relative flex flex-1 items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 overflow-hidden ${
                  selectedCommunityId === community._id
                    ? theme === "light"
                      ? "bg-black/10"
                      : "bg-white/10"
                    : theme === "light"
                    ? "hover:bg-black/5"
                    : "hover:bg-white/5"
                }`}
              >
                <img
                  src={community.imageUrl || "/default-avatar.png"}
                  alt={community.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <p
                    className={`font-semibold ${
                      theme === "light"
                        ? "text-neutral-800"
                        : "text-neutral-100"
                    }`}
                  >
                    {community.name}
                  </p>
                  <p
                    className={`mt-1 truncate text-sm ${
                      theme === "light"
                        ? "text-neutral-600"
                        : "text-neutral-400"
                    }`}
                  >
                    Members: {community.members.length}
                  </p>
                </div>
              </motion.button>

              {!isOwner &&
                !isMember &&
                community.visibility !== "invite-only" && (
                  <button
                    onClick={() => handleCommunityAction(community, "join")}
                    disabled={isMutating}
                    className="rounded-lg px-3 py-1 text-sm font-semibold transition disabled:opacity-50 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
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
