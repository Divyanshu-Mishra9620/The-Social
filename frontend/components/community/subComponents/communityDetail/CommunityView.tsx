"use client";
import React, { useState } from "react";
import {
  IconUsers,
  IconHash,
  IconVolume,
  IconSettings,
  IconChevronDown,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Channel, Category, ChannelType, Server } from "@/types/server";
import { cn } from "@/lib/utils";
import { ChatView } from "./ChatViewPlaceholer";

const ChannelLink = ({
  channel,
  active,
  onClick,
}: {
  channel: Channel;
  active: boolean;
  onClick: () => void;
}) => {
  const icons: Record<ChannelType, React.ReactNode> = {
    Text: <IconHash size={20} className="text-neutral-500" />,
    Voice: <IconVolume size={20} className="text-neutral-500" />,
    Video: <IconHash size={20} className="text-neutral-500" />,
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-100",
        active &&
          "bg-neutral-200/80 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50"
      )}
    >
      {icons[channel.type]}
      <span className="font-medium">{channel.name}</span>
    </button>
  );
};

const CategoryAccordion = ({
  category,
  onChannelSelect,
  activeChannelId,
  isOpen,
  onToggle,
}: {
  category: Category;
  onChannelSelect: (channel: Channel) => void;
  activeChannelId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div>
    <button
      onClick={onToggle}
      className="mb-1 flex w-full items-center justify-between px-2"
    >
      <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
        {category.name}
      </h3>
      <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
        <IconChevronDown size={16} className="text-neutral-400" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-0.5 pt-1">
            {category.channels.map((channel) => (
              <ChannelLink
                key={channel._id}
                channel={channel}
                active={channel._id === activeChannelId}
                onClick={() => onChannelSelect(channel)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ChannelTabs = ({
  openChannels,
  activeChannelId,
  onSelect,
  onClose,
}: {
  openChannels: Channel[];
  activeChannelId: string | null;
  onSelect: (channel: Channel) => void;
  onClose: (channelId: string) => void;
}) => (
  <div className="flex shrink-0 items-end border-b border-neutral-200 dark:border-neutral-800">
    <AnimatePresence initial={false}>
      {openChannels.map((channel, index) => (
        <motion.div
          key={channel._id}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
          className={cn(
            "relative flex items-center gap-2 border-r border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500 dark:border-neutral-800",
            activeChannelId === channel._id
              ? "bg-white dark:bg-neutral-900"
              : "bg-neutral-100 dark:bg-neutral-800/50"
          )}
        >
          <button
            onClick={() => onSelect(channel)}
            className="flex items-center gap-2"
          >
            <IconHash size={16} />
            <span>{channel.name}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(channel._id);
            }}
            className="ml-2 rounded-full p-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          >
            <IconX size={14} />
          </button>
          {activeChannelId === channel._id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600"
            />
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export const CommunityView = ({ community }: { community: Server }) => {
  const [openChannels, setOpenChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const activeChannel =
    openChannels.find((c) => c._id === activeChannelId) || null;

  const handleChannelOpen = (channel: Channel) => {
    if (!openChannels.some((c) => c._id === channel._id)) {
      setOpenChannels((prev) => [...prev, channel]);
    }
    setActiveChannelId(channel._id);
  };

  const handleTabClose = (channelId: string) => {
    const updatedOpenChannels = openChannels.filter((c) => c._id !== channelId);
    setOpenChannels(updatedOpenChannels);
    if (activeChannelId === channelId) {
      setActiveChannelId(
        updatedOpenChannels[updatedOpenChannels.length - 1]?._id || null
      );
    }
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex w-60 flex-col border-r border-neutral-200 bg-neutral-100/80 dark:border-neutral-800 dark:bg-neutral-900/80">
        <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-neutral-200 p-4 shadow-sm dark:border-neutral-800">
          <h1 className="truncate text-lg font-bold text-neutral-800 dark:text-neutral-50">
            {community.name}
          </h1>
          <button className="text-neutral-500 hover:text-neutral-100">
            <IconChevronDown size={20} />
          </button>
        </header>
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {community.categories.map((category) => (
            <CategoryAccordion
              key={category._id}
              category={category}
              onChannelSelect={handleChannelOpen}
              activeChannelId={activeChannelId}
              isOpen={openCategories.has(category._id)}
              onToggle={() => toggleCategory(category._id)}
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

      <div className="flex flex-1 flex-col">
        <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-neutral-200 p-4 shadow-sm dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {activeChannel && (
              <IconHash size={24} className="text-neutral-500" />
            )}
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50">
              {activeChannel?.name || "Select a channel"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <IconUsers size={20} />
            <span>{community.members.length} Members</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col min-h-0">
          <ChannelTabs
            openChannels={openChannels}
            activeChannelId={activeChannelId}
            onSelect={(ch) => setActiveChannelId(ch._id)}
            onClose={handleTabClose}
          />
          <div className="flex-1 relative">
            {activeChannel ? (
              <ChatView channel={activeChannel} server={community} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-neutral-500">
                  Select a channel to start chatting.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
