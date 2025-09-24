"use client";
import React, { useState } from "react";
import {
  IconHash,
  IconVolume,
  IconPlus,
  IconUsers,
  IconSettings,
  IconChevronDown,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Channel, Category, ChannelType, Server } from "@/types/server";
import { ChatViewPlaceholder } from "./ChatViewPlaceholer";

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

const CategorySection = ({
  category,
  activeChannelId,
  onChannelSelect,
}: {
  category: Category;
  activeChannelId: string;
  onChannelSelect: (channel: Channel) => void;
}) => (
  <div>
    <div className="mb-1 flex items-center justify-between px-2">
      <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
        {category.name}
      </h3>
      <button className="text-neutral-400 hover:text-neutral-100">
        <IconPlus size={16} />
      </button>
    </div>
    <div className="flex flex-col gap-0.5">
      {category?.channels?.map((channel) => (
        <ChannelLink
          key={channel._id}
          channel={channel}
          active={channel._id === activeChannelId}
          onClick={() => onChannelSelect(channel)}
        />
      ))}
    </div>
  </div>
);

export const CommunityView = ({ community }: { community: Server }) => {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  return (
    <div className="flex h-full w-full">
      <div className="flex w-60 flex-col border-r border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/80">
        <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-neutral-200 p-4 shadow-sm dark:border-neutral-800">
          <h1 className="truncate text-lg font-bold text-neutral-800 dark:text-neutral-50">
            {community.name}
          </h1>
          <button className="text-neutral-500 hover:text-neutral-100">
            <IconChevronDown size={20} />
          </button>
        </header>
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {community?.categories?.map((category) => (
            <CategorySection
              key={category._id}
              category={category}
              activeChannelId={activeChannel?._id || ""}
              onChannelSelect={setActiveChannel}
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
            <IconHash size={24} className="text-neutral-500" />
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-50">
              {activeChannel?.name || "Select a channel"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <IconUsers size={20} />
            <span>{community.members.length} Members</span>
          </div>
        </header>
        <main className="flex-1">
          {activeChannel ? (
            <ChatViewPlaceholder channelName={activeChannel.name} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-neutral-500">No text channels available.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
