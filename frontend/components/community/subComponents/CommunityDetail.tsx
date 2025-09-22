"use client";
import React from "react";
import {
  IconHash,
  IconSearch,
  IconUsers,
  IconVideo,
  IconVolume,
  IconWorld,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type ChannelType = "text" | "voice" | "video";
type Channel = {
  name: string;
  type: ChannelType;
  active: boolean;
};
type Community = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  channels: Channel[];
};

const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="rounded-full bg-slate-200/70 p-6 dark:bg-slate-800/50">
        <IconWorld size={64} className="text-slate-500" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Select a Community
        </h2>
        <p className="max-w-sm text-slate-600 dark:text-slate-400">
          Choose a community from your sidebar, or search for a new one to join
          the conversation.
        </p>
      </div>
      <div className="relative mt-2 w-full max-w-xs">
        <IconSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Search for communities..."
          className="w-full rounded-full border border-slate-300 bg-white/80 py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:focus:ring-blue-600"
        />
      </div>
    </div>
  );
};

const CommunityView = ({ community }: { community: Community }) => {
  const channelIcons: Record<ChannelType, React.ReactNode> = {
    text: <IconHash size={20} className="text-slate-500" />,
    voice: <IconVolume size={20} className="text-slate-500" />,
    video: <IconVideo size={20} className="text-slate-500" />,
  };

  const textChannels = community.channels.filter((c) => c.type === "text");
  const voiceChannels = community.channels.filter((c) => c.type === "voice");
  const videoChannels = community.channels.filter((c) => c.type === "video");

  const ChannelLink = ({ channel }: { channel: Channel }) => (
    <a
      href="#"
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-slate-600 transition-colors duration-150 dark:text-slate-400",
        channel.active
          ? "bg-slate-200/80 font-semibold text-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
          : "hover:bg-slate-200/50 hover:text-slate-800 dark:hover:bg-slate-800/40 dark:hover:text-slate-200"
      )}
    >
      {channelIcons[channel.type]}
      <span className="truncate">{channel.name}</span>
    </a>
  );

  return (
    <div className="flex h-full flex-col">
      <header className="shrink-0 border-b border-slate-200/80 p-6 dark:border-slate-800/50">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {community.name}
        </h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>{community.description}</p>
          <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600"></span>
          <div className="flex items-center gap-1.5">
            <IconUsers size={16} />
            <span>{community.memberCount} Members</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          {textChannels.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="px-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
                Text Channels
              </h3>
              {textChannels.map((channel) => (
                <ChannelLink key={channel.name} channel={channel} />
              ))}
            </div>
          )}
          {voiceChannels.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="px-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
                Voice Channels
              </h3>
              {voiceChannels.map((channel) => (
                <ChannelLink key={channel.name} channel={channel} />
              ))}
            </div>
          )}
          {videoChannels.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="px-3 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
                Video Channels
              </h3>
              {videoChannels.map((channel) => (
                <ChannelLink key={channel.name} channel={channel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CommunityDetail({
  selectedCommunity,
}: {
  selectedCommunity: Community | null;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-100/50 dark:bg-slate-900/50">
      <main className="h-full w-full">
        {selectedCommunity ? (
          <CommunityView community={selectedCommunity} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
