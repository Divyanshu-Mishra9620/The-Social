"use client";
import React, { useState } from "react";
import {
  IconHash,
  IconVolume,
  IconSettings,
  IconChevronDown,
  IconX,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Channel, Category, ChannelType, Server } from "@/types/server";
import { ChatView } from "./ChatView";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  channel: Channel;
}

const ChannelLink = ({
  channel,
  isActive,
  onClick,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}) => {
  const icons: Record<ChannelType, React.ReactNode> = {
    Text: <IconHash size={16} className="text-neutral-500" />,
    Voice: <IconVolume size={16} className="text-neutral-500" />,
    Video: <IconHash size={16} className="text-neutral-500" />,
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-neutral-400 hover:bg-white/5 hover:text-white"
      )}
    >
      {icons[channel.type]}
      <span className="text-sm font-medium">{channel.name}</span>
    </button>
  );
};

const CategorySection = ({
  category,
  onChannelSelect,
  activeChannelId,
}: {
  category: Category;
  onChannelSelect: (channel: Channel) => void;
  activeChannelId: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-1.5 px-1 py-1 text-xs font-bold uppercase text-neutral-400 hover:text-white"
      >
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
          <IconChevronRight size={14} />
        </motion.div>
        {category.name}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-1 flex flex-col gap-0.5 overflow-hidden pl-2"
          >
            {category.channels?.map((channel) => (
              <ChannelLink
                key={channel._id}
                channel={channel}
                isActive={channel._id === activeChannelId}
                onClick={() => onChannelSelect(channel)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabComponent = ({
  tab,
  isActive,
  onClick,
  onClose,
}: {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
}) => (
  <motion.div
    layoutId={`tab-${tab.id}`}
    onClick={onClick}
    className={cn(
      "group relative flex h-full cursor-pointer items-center gap-2 border-b-2 px-4 pt-2 text-sm", // Adjusted padding for alignment
      isActive
        ? "border-blue-500 text-white"
        : "border-transparent text-neutral-400 hover:text-white"
    )}
  >
    <IconHash size={14} />
    <span className="truncate">{tab.channel.name}</span>
    <button
      onClick={onClose}
      className="ml-2 rounded-full p-0.5 text-neutral-500 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
    >
      <IconX size={14} />
    </button>
  </motion.div>
);

export const CommunityView = ({ community }: { community: Server }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const openChannelInTab = (channel: Channel) => {
    const existingTab = tabs.find((t) => t.channel._id === channel._id);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }
    const newTab = { id: channel._id, channel };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, tabIndex - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else {
        setActiveTabId(null);
      }
    }
  };

  const activeChannel =
    tabs.find((tab) => tab.id === activeTabId)?.channel || null;

  return (
    <div className="flex h-full w-full">
      <div className="flex w-60 flex-col border-r border-white/10">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 p-4">
          <h1 className="truncate font-bold text-white">{community.name}</h1>
          <IconChevronDown size={20} className="text-neutral-400" />
        </header>
        <nav className="flex-1 space-y-2 overflow-y-auto p-2">
          {community?.categories?.map((category) => (
            <CategorySection
              key={category._id}
              category={category}
              activeChannelId={activeChannel?._id || null}
              onChannelSelect={openChannelInTab}
            />
          ))}
        </nav>
        <footer className="flex shrink-0 items-center gap-3 border-t border-white/10 p-3">
          <img
            src={community.owner.profilePic || "/default-avatar.png"}
            alt={community.owner.name}
            className="h-8 w-8 rounded-full"
          />
          <div className="flex-1 truncate">
            <p className="text-sm font-semibold text-white">
              {community.owner.name}
            </p>
          </div>
          <IconSettings
            size={20}
            className="text-neutral-400 hover:text-white"
          />
        </footer>
      </div>

      <div className="flex flex-1 flex-col min-h-0">
        <header className="flex h-14 shrink-0 items-end border-b border-white/10">
          <div className="flex h-full items-center">
            {tabs.map((tab) => (
              <TabComponent
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onClick={() => setActiveTabId(tab.id)}
                onClose={(e) => closeTab(tab.id, e)}
              />
            ))}
          </div>
        </header>

        <main className="flex-1 min-h-0">
          {activeChannel ? (
            <ChatView channel={activeChannel} server={community} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-black/20 border border-white/10 mb-4">
                <IconHash size={48} className="text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to {community.name}
              </h2>
              <p className="max-w-md text-neutral-400">
                Select a channel to start chatting. Open channels will appear as
                tabs for easy navigation.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
