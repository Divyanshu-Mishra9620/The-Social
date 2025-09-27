"use client";
import { useState, useEffect } from "react";
import CommunityList from "./subComponents/CommunityList";
import CommunityDetail from "./subComponents/communityDetail/CommunityDetail";
import { Server } from "@/types/server";
import { BorderBeam } from "../ui/border-beam";

interface SearchedCommunityListProps {
  communities: Server[];
}

export const SearchedCommunityList = ({
  communities,
}: SearchedCommunityListProps) => {
  const [selectedCommunity, setSelectedCommunity] = useState<Server | null>(
    null
  );

  useEffect(() => {
    setSelectedCommunity(null);
  }, [communities]);

  const handleSelectCommunity = (server: Server) => {
    setSelectedCommunity((prev) => (prev?._id === server._id ? null : server));
  };

  return (
    <div className="h-full w-full relative z-10 overflow-hidden">
      <div className="relative flex h-full w-full overflow-hidden rounded-2xl border border-black/[0.1] dark:border-white/[0.1]">
        <div className="relative flex w-1/3 flex-col border-r border-neutral-200 p-6 dark:border-neutral-800 dark:bg-neutral-900/60 z-10 overflow-hidden">
          <h1 className="shrink-0 text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            Communities
          </h1>
          <div className="flex-1 min-h-0 overflow-hidden">
            <CommunityList
              communities={communities}
              onSelectCommunity={handleSelectCommunity}
              selectedCommunityId={selectedCommunity?._id}
            />
          </div>
        </div>

        <div className="relative h-full w-px bg-gradient-to-b from-transparent via-neutral-400 to-transparent dark:via-neutral-700 z-10">
          <BorderBeam size={150} duration={10} delay={0} />
        </div>

        <div className="relative flex flex-col w-2/3 backdrop-blur-md dark:bg-neutral-900/60 z-10 overflow-hidden">
          <CommunityDetail
            selectedCommunityId={selectedCommunity?._id || null}
          />
        </div>
      </div>
    </div>
  );
};
