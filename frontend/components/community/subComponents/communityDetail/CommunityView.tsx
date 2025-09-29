"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  IconHash,
  IconVolume,
  IconSettings,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Channel, Category, ChannelType, Server } from "@/types/server";
import { ChatView } from "./ChatView";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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
      setWidth((prevWidth) => {
        const newWidth = prevWidth + e.movementX;
        if (newWidth > 180 && newWidth < 400) {
          return newWidth;
        }
        return prevWidth;
      });
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
    <div className="flex items-center gap-2">
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
    </div>
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

export const CommunityView = ({
  community,
  initialChannelId,
}: {
  community: Server;
  initialChannelId?: string;
}) => {
  const router = useRouter();

  // Memoize the initial channel to prevent recalculation
  const initialChannel = useMemo(() => {
    if (initialChannelId) {
      for (const category of community.categories) {
        const foundChannel = category.channels.find(
          (c) => c._id === initialChannelId
        );
        if (foundChannel) return foundChannel;
      }
    }
    return community.categories[0]?.channels[0] || null;
  }, [initialChannelId, community.categories]);

  const [activeChannel, setActiveChannel] = useState<Channel | null>(
    initialChannel
  );

  const { width, handleMouseDown } = useResizable(240);

  // Update active channel when initialChannelId changes
  useEffect(() => {
    if (initialChannelId && activeChannel?._id !== initialChannelId) {
      const newChannel = initialChannel;
      if (newChannel) {
        setActiveChannel(newChannel);
      }
    }
  }, [initialChannelId, initialChannel, activeChannel]);

  const handleChannelSelect = useCallback(
    (channel: Channel) => {
      setActiveChannel(channel);
      router.push(`/community/${community._id}/${channel._id}`);
    },
    [community._id, router]
  );

  return (
    <div className="flex h-full w-full">
      <div
        className="flex flex-col border-r border-white/10 z-20"
        style={{ width: `${width}px` }}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 p-4">
          <h1 className="truncate font-bold text-white">{community.name}</h1>
          <IconChevronDown size={20} className="text-neutral-400" />
        </header>
        <nav className="flex-1 space-y-2 overflow-y-auto p-2 no-scrollbar">
          {community?.categories?.map((category) => (
            <CategorySection
              key={category._id}
              category={category}
              activeChannelId={activeChannel?._id || null}
              onChannelSelect={handleChannelSelect}
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
            className="text-neutral-400 hover:text-white cursor-pointer"
          />
        </footer>
      </div>
      <div
        className="cursor-col-resize w-2 bg-transparent hover:bg-white/10 transition-colors"
        onMouseDown={handleMouseDown}
      />

      <div className="flex flex-1 flex-col min-h-0">
        <main className="flex-1 min-h-0">
          {activeChannel ? (
            <ChatView
              key={activeChannel._id}
              channel={activeChannel}
              server={community}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-black/20 border border-white/10 mb-4">
                <IconHash size={48} className="text-neutral-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to {community.name}
              </h2>
              <p className="max-w-md text-neutral-400">
                Select a channel to start chatting.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
