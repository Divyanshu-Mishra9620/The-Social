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
import { ChatView } from "./ChatViewPlaceholer";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  channel: Channel;
  categoryName: string;
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
        "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-neutral-500 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-100",
        isActive &&
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      )}
    >
      {icons[channel.type]}
      <span className="font-medium text-sm">{channel.name}</span>
    </button>
  );
};

const CategorySection = ({
  category,
  isExpanded,
  onToggle,
  activeChannelId,
  onChannelSelect,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  activeChannelId: string;
  onChannelSelect: (channel: Channel) => void;
}) => (
  <div className="mb-2">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-neutral-700 transition-colors hover:bg-neutral-200/50 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconChevronRight size={16} />
        </motion.div>
        <h3 className="text-sm font-semibold uppercase">{category.name}</h3>
      </div>
      <span className="text-xs text-neutral-500">
        {category.channels?.length || 0}
      </span>
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 mt-1 overflow-hidden"
        >
          <div className="flex flex-col gap-1 border-l-2 border-neutral-200 pl-2 dark:border-neutral-700">
            {category?.channels?.map((channel) => (
              <ChannelLink
                key={channel._id}
                channel={channel}
                isActive={channel._id === activeChannelId}
                onClick={() => onChannelSelect(channel)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const TabComponent = ({
  tab,
  isActive,
  onClose,
  onClick,
}: {
  tab: Tab;
  isActive: boolean;
  onClose: (e: React.MouseEvent) => void;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative flex min-w-[160px] max-w-[240px] items-center gap-2 rounded-t-lg border border-b-0 px-3 py-2 transition-all duration-200 cursor-pointer",
      isActive
        ? "bg-white border-neutral-300 dark:bg-neutral-800 dark:border-neutral-600"
        : "bg-neutral-100 border-transparent hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    )}
  >
    <IconHash
      size={14}
      className={cn(
        isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-500"
      )}
    />

    <span
      className={cn(
        "flex-1 truncate text-sm",
        isActive
          ? "text-neutral-900 dark:text-neutral-100"
          : "text-neutral-600 dark:text-neutral-400"
      )}
    >
      {tab.channel.name}
    </span>

    <button
      onClick={onClose}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full p-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-700"
    >
      <IconX size={14} />
    </button>

    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
    )}
  </div>
);

const TabBar = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
}: {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string, e: React.MouseEvent) => void;
}) => (
  <div className="flex items-end h-12 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 relative z-20">
    <div className="flex items-end overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <TabComponent
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onClose={(e) => onTabClose(tab.id, e)}
          onClick={() => onTabClick(tab.id)}
        />
      ))}
    </div>
  </div>
);

export const CommunityView = ({ community }: { community: Server }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const openChannelInTab = (channel: Channel, categoryName: string) => {
    const tabId = `${channel._id}-${Date.now()}`;
    const newTab: Tab = {
      id: tabId,
      channel,
      categoryName,
    };

    setTabs((prev) => {
      const existingTab = prev.find((tab) => tab.channel._id === channel._id);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return prev;
      }
      return [...prev, newTab];
    });
    setActiveTabId(tabId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== tabId);

      if (activeTabId === tabId) {
        setActiveTabId(
          newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null
        );
      }

      return newTabs;
    });
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const activeChannel =
    tabs.find((tab) => tab.id === activeTabId)?.channel || null;

  return (
    <div className="flex h-full w-full min-h-0 bg-white dark:bg-neutral-900 relative z-10">
      <div className="flex w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 min-h-0 relative z-10">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
          <h1 className="truncate text-lg font-bold text-neutral-800 dark:text-neutral-50">
            {community.name}
          </h1>
          <button className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100">
            <IconChevronDown size={20} />
          </button>
        </header>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4 min-h-0">
          {community?.categories?.map((category) => (
            <CategorySection
              key={category._id}
              category={category}
              isExpanded={expandedCategories.has(category._id)}
              onToggle={() => toggleCategory(category._id)}
              activeChannelId={activeChannel?._id || ""}
              onChannelSelect={(channel) =>
                openChannelInTab(channel, category.name)
              }
            />
          ))}
        </nav>

        <footer className="flex shrink-0 items-center gap-3 border-t border-neutral-200 p-3 dark:border-neutral-800">
          {community.owner.profilePic && (
            <img
              src={community.owner.profilePic}
              alt={community.owner.name}
              className="h-8 w-8 rounded-full"
            />
          )}
          <div className="flex-1 truncate">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              {community.owner.name}
            </p>
          </div>
          <button className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100">
            <IconSettings size={20} />
          </button>
        </footer>
      </div>

      <div className="flex flex-1 flex-col min-h-0 relative z-10">
        <div className="shrink-0 h-12 relative z-20">
          {tabs.length > 0 && (
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onTabClick={switchTab}
              onTabClose={closeTab}
            />
          )}
        </div>

        <main className="flex-1 min-h-0 bg-white dark:bg-neutral-900 relative z-10">
          {activeChannel ? (
            <ChatView channel={activeChannel} server={community} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                <IconHash size={48} className="text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                Welcome to {community.name}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                Select a channel from the sidebar to start chatting. Channels
                will open in tabs for easy navigation.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
