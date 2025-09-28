"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";
import CommunityList from "./subComponents/CommunityList";
import { Server } from "@/types/server";

interface ResizableSidebarProps {
  communities: Server[];
  onSelectCommunity: (community: Server) => void;
  selectedCommunityId: string | null;
}

export const ResizableSidebar = ({
  communities,
  onSelectCommunity,
  selectedCommunityId,
}: ResizableSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <motion.div
      animate={{ width: isCollapsed ? "80px" : "320px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative flex h-full flex-col rounded-2xl p-4 shadow-lg backdrop-blur-xl ${
        theme === "light"
          ? "border border-black/10 bg-white/30"
          : "border border-white/10 bg-black/20"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-lg font-semibold ${
                theme === "light" ? "text-neutral-800" : "text-white"
              }`}
            >
              Communities
            </motion.h2>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-full transition-colors ${
            theme === "light" ? "hover:bg-black/10" : "hover:bg-white/10"
          }`}
        >
          {isCollapsed ? (
            <IconLayoutSidebarLeftExpand size={20} />
          ) : (
            <IconLayoutSidebarLeftCollapse size={20} />
          )}
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <CommunityList
          communities={communities}
          onSelectCommunity={onSelectCommunity}
          selectedCommunityId={selectedCommunityId}
          //   isCollapsed={isCollapsed}
        />
      </div>
    </motion.div>
  );
};
