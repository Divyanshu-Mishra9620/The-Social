"use client";

import { cn } from "@/lib/utils";
import { Server } from "@/types/server";

type CommunityListProps = {
  communities: Server[];
  onSelectCommunity: (community: Server) => void;
  selectedCommunityId?: string | null;
};

export default function CommunityList({
  communities,
  onSelectCommunity,
  selectedCommunityId,
}: CommunityListProps) {
  return (
    <div className="h-full overflow-y-auto">
      <ul className="mt-4 space-y-2 pr-2">
        {communities?.map((community) => (
          <li key={community._id}>
            <button
              onClick={() => onSelectCommunity(community)}
              className={cn(
                "w-full rounded-md p-3 text-left transition-colors duration-150",
                "flex flex-col items-start",
                selectedCommunityId === community._id
                  ? "bg-neutral-200/80 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                  : "text-neutral-700 hover:bg-neutral-200/50 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
              )}
            >
              <p className="font-semibold">{community.name}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 truncate">
                {`Members: ${community.members.length}`}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
