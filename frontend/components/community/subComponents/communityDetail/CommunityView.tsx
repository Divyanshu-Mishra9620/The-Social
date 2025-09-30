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
  IconUserPlus,
  IconBell,
  IconShield,
  IconLogout,
  IconX,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Channel, Category, ChannelType, Server } from "@/types/server";
import { ChatView } from "./ChatView";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

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
  onSettingsClick,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
  onSettingsClick: () => void;
}) => {
  const icons: Record<ChannelType, React.ReactNode> = {
    Text: (
      <IconHash size={16} className="text-neutral-500 group-hover:text-white" />
    ),
    Voice: (
      <IconVolume
        size={16}
        className="text-neutral-500 group-hover:text-white"
      />
    ),
    Video: (
      <IconHash size={16} className="text-neutral-500 group-hover:text-white" />
    ),
  };

  return (
    <div className="group flex items-center gap-2 pr-2 rounded-md hover:bg-white/5">
      <button
        onClick={onClick}
        className={cn(
          "flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
          isActive
            ? "bg-white/10 text-white"
            : "text-neutral-400 group-hover:text-white"
        )}
      >
        {icons[channel.type]}
        <span className="text-sm font-medium">{channel.name}</span>
      </button>
      <button
        onClick={onSettingsClick}
        className="text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
      >
        <IconSettings size={16} />
      </button>
    </div>
  );
};

const CategorySection = ({
  category,
  onChannelSelect,
  activeChannelId,
  onSettingsSelect,
}: {
  category: Category;
  onChannelSelect: (channel: Channel) => void;
  activeChannelId: string | null;
  onSettingsSelect: (channel: Channel) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-1.5 px-1 py-1 text-xs font-bold uppercase text-neutral-400 hover:text-white"
      >
        <motion.div animate={{ rotate: isExpanded ? 0 : -90 }}>
          <IconChevronDown size={14} />
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
                onSettingsClick={() => onSettingsSelect(channel)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommunityDropdown = ({
  community,
  isOpen,
  onClose,
  onOptionSelect,
  isOwner,
}: {
  community: Server;
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
  isOwner: boolean;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { id: "invite", label: "Invite People", icon: IconUserPlus, danger: false },
    {
      id: "settings",
      label: "Community Settings",
      icon: IconSettings,
      danger: false,
      ownerOnly: true,
    },
    {
      id: "notifications",
      label: "Notification Settings",
      icon: IconBell,
      danger: false,
    },
    {
      id: "privacy",
      label: "Privacy Settings",
      icon: IconShield,
      danger: false,
    },
    {
      id: "leave",
      label: "Leave Server",
      icon: IconLogout,
      danger: true,
      ownerOnly: false,
    },
  ];

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-14 left-4 w-56 bg-neutral-900 rounded-lg shadow-2xl border border-white/10 overflow-hidden z-50"
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isDisabled = item.ownerOnly && !isOwner && item.id === "settings";

        if (item.ownerOnly && !isOwner && item.id === "leave") {
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onOptionSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                item.danger
                  ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  : isDisabled
                  ? "text-neutral-600 cursor-not-allowed"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              )}
              disabled={isDisabled}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        }

        if (item.id === "leave" && isOwner) {
          return null; // Don't show leave option for owner
        }

        return (
          <button
            key={item.id}
            onClick={() => !isDisabled && onOptionSelect(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
              item.danger
                ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                : isDisabled
                ? "text-neutral-600 cursor-not-allowed"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            )}
            disabled={isDisabled}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {isDisabled && (
              <span className="ml-auto text-xs">(Owner Only)</span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
};

const SettingsModal = ({
  isOpen,
  onClose,
  type,
  community,
  isOwner,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  community: Server;
  isOwner: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/invite/${community._id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveServer = async () => {
    if (!session?.appJwt) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/profile/leave-server/${community._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.appJwt}`,
          },
        }
      );

      if (response.ok) {
        window.location.href = "/community";
      }
    } catch (error) {
      console.error("Failed to leave server:", error);
    }
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case "invite":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Invite People</h2>
            <p className="text-neutral-400">
              Share this link with others to grant access to {community.name}
            </p>
            <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-3">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/invite/${community._id}`}
                className="flex-1 bg-transparent text-neutral-300 text-sm outline-none"
              />
              <button
                onClick={handleCopyInvite}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Community Settings
            </h2>
            {!isOwner ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">
                  Only the server owner can access these settings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Server Name
                  </label>
                  <input
                    type="text"
                    defaultValue={community.name}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue={community.description}
                    rows={4}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Notification Settings
            </h2>
            <div className="space-y-4">
              {["All Messages", "Only Mentions", "Nothing"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="notifications"
                    className="w-4 h-4 text-blue-600"
                    defaultChecked={option === "All Messages"}
                  />
                  <span className="text-neutral-300">{option}</span>
                </label>
              ))}
              <div className="pt-4 border-t border-neutral-700">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-neutral-300">Mute Server</span>
                  <input type="checkbox" className="w-4 h-4 text-blue-600" />
                </label>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-neutral-300">Direct Messages</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-neutral-300">Allow Friend Requests</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-neutral-300">Show Activity</span>
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
              </label>
            </div>
          </div>
        );

      case "leave":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-400">Leave Server</h2>
            <p className="text-neutral-400">
              Are you sure you want to leave{" "}
              <strong className="text-white">{community.name}</strong>? You
              won't be able to rejoin this server unless you are re-invited.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveServer}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Leave Server
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        >
          <div className="sticky top-0 bg-neutral-900 border-b border-white/10 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={community.imageUrl || "/default-avatar.png"}
                alt={community.name}
                className="h-10 w-10 rounded-lg"
              />
              <span className="font-semibold text-white">{community.name}</span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <IconX size={24} />
            </button>
          </div>
          <div className="p-6">{renderContent()}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
  const { openChannelSettings } = useSettingsModal();
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [settingsModal, setSettingsModal] = useState<{
    isOpen: boolean;
    type: string;
  }>({
    isOpen: false,
    type: "",
  });

  const isOwner = community?.owner?._id === user?.id;

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
  const { width, handleMouseDown } = useResizable(200);

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

  const handleSettingsSelect = useCallback(
    (channel: Channel) => {
      openChannelSettings(channel);
    },
    [openChannelSettings]
  );

  const handleDropdownOptionSelect = useCallback((option: string) => {
    setIsDropdownOpen(false);
    setSettingsModal({ isOpen: true, type: option });
  }, []);

  return (
    <div className="flex h-full w-full">
      <div
        className="flex flex-col border-r border-white/10 z-20"
        style={{ width: `${width}px` }}
      >
        <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-white/10 p-4">
          <h1 className="truncate font-bold text-white">{community.name}</h1>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <IconChevronDown size={20} />
          </button>
          <CommunityDropdown
            community={community}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onOptionSelect={handleDropdownOptionSelect}
            isOwner={isOwner}
          />
        </header>
        <nav className="flex-1 space-y-2 overflow-y-auto p-2 no-scrollbar">
          {community?.categories?.map((category) => (
            <CategorySection
              key={category._id}
              category={category}
              activeChannelId={activeChannel?._id || null}
              onChannelSelect={handleChannelSelect}
              onSettingsSelect={handleSettingsSelect}
            />
          ))}
        </nav>
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
      <SettingsModal
        isOpen={settingsModal.isOpen}
        onClose={() => setSettingsModal({ isOpen: false, type: "" })}
        type={settingsModal.type}
        community={community}
        isOwner={isOwner}
      />
    </div>
  );
};
