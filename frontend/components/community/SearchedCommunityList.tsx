"use client";
import { useState, useEffect } from "react";
import CommunityList from "../community/subComponents/CommunityList";
import CommunityDetail from "./subComponents/communityDetail/CommunityDetail";
import { Server } from "@/types/server";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";

export const SearchedCommunityList = ({
  communities,
}: {
  communities: Server[];
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<Server | null>(
    null
  );
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  useEffect(() => {
    setSelectedCommunity(null);
    setIsMobileListVisible(true);
  }, [communities]);

  const handleSelectCommunity = (server: Server) => {
    setSelectedCommunity(server);
    setIsMobileListVisible(false); // Hide list on mobile after selection
  };

  const showList = () => {
    setSelectedCommunity(null);
    setIsMobileListVisible(true);
  };

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white/30 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
        {isMobileListVisible ? (
          <div className="flex h-full flex-col p-4">
            <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-white">
              Communities
            </h2>
            <CommunityList
              communities={communities}
              onSelectCommunity={handleSelectCommunity}
              selectedCommunityId={null}
            />
          </div>
        ) : (
          <div className="h-full">
            <button
              onClick={showList}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/10 p-2 text-xs dark:bg-white/10"
            >
              <IconArrowLeft size={16} /> Back
            </button>
            <CommunityDetail
              selectedCommunityId={selectedCommunity?._id || null}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white/30 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
      <div className="flex h-full w-full">
        <div className="flex w-full flex-col border-r border-black/10 p-4 md:w-1/3 dark:border-white/10">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-white">
            Communities
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <CommunityList
              communities={communities}
              onSelectCommunity={setSelectedCommunity}
              selectedCommunityId={selectedCommunity?._id || null}
            />
          </div>
        </div>
        <div className="hidden w-2/3 flex-1 md:block">
          <CommunityDetail
            selectedCommunityId={selectedCommunity?._id || null}
          />
        </div>
      </div>
    </div>
  );
};
