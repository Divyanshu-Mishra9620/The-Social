"use client";

import { useState } from "react";
import CommunityList from "./subComponents/CommunityList";
import CommunityDetail from "./subComponents/communityDetail/CommunityDetail";
import { Server } from "@/types/server";
import { BorderBeam } from "../ui/border-beam";

interface SearchedCommunityListProps {
  communities: Server[];
}

export default function SearchedCommunityList({
  communities,
}: SearchedCommunityListProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<Server | null>(
    null
  );

  const handleSelectedCommunity = (server: Server) => {
    if (selectedCommunity?._id === server._id) setSelectedCommunity(null);
    else setSelectedCommunity(server);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center min-h-0">
      {" "}
      <div className="relative flex h-[95%] w-[95%] overflow-hidden rounded-2xl border border-black/[0.1] dark:border-white/[0.1] min-h-0">
        <div className="relative w-1/3 p-6 backdrop-blur-md dark:bg-neutral-900/60">
          <h1 className="mb-4 text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            Communities
          </h1>
          <CommunityList
            communities={communities}
            onSelectCommunity={handleSelectedCommunity}
            selectedCommunityId={selectedCommunity?._id}
          />
        </div>

        <div className="relative h-full w-px bg-gradient-to-b from-transparent via-neutral-400 to-transparent dark:via-neutral-700">
          <BorderBeam size={150} duration={10} delay={0} />
        </div>

        <div className="relative w-2/3 backdrop-blur-md dark:bg-neutral-900/60 ">
          <CommunityDetail
            selectedCommunityId={selectedCommunity?._id || null}
          />
        </div>
      </div>
    </div>
  );
}
