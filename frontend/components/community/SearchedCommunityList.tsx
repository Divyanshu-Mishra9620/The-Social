"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import CommunityList from "../community/subComponents/CommunityList";
import CommunityDetail from "./subComponents/communityDetail/CommunityDetail";
import { Server } from "@/types/server";
import { IconArrowLeft, IconMenu2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const useResizable = (initialWidth: number) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      setWidth((prevWidth) => prevWidth + e.movementX);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return { width, handleMouseDown };
};

export const SearchedCommunityList = ({
  communities,
}: {
  communities: Server[];
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<Server | null>(
    null
  );
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const { width, handleMouseDown } = useResizable(320);

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
        <div
          className="flex flex-col border-r border-black/10 p-4 dark:border-white/10"
          style={{ width: `${width}px` }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 no-scrollbar">
            <CommunityList
              communities={communities}
              onSelectCommunity={setSelectedCommunity}
              selectedCommunityId={selectedCommunity?._id || null}
            />
          </div>
        </div>
        <div
          className="cursor-col-resize w-2 bg-gray-400 hover:bg-gray-500"
          onMouseDown={handleMouseDown}
        />
        <div className="hidden flex-1 md:block">
          <CommunityDetail
            selectedCommunityId={selectedCommunity?._id || null}
          />
        </div>
      </div>
    </div>
  );
};
