"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  memo,
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
import { Channel, Category, ChannelType, Server } from "@/types/server";
import { ChatView } from "./ChatView";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/community/ThemeProvider";
import { CommunityViewSkeleton } from "@/components/Loaders";
import { useCommunity } from "@/context/CommunityContext";

const ChannelLink = React.memo(
  ({
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
    const { colors } = useTheme();

    const icons: Record<ChannelType, React.ReactNode> = useMemo(
      () => ({
        Text: <IconHash size={18} />,
        Voice: <IconVolume size={18} />,
        Video: <IconVolume size={18} />,
      }),
      []
    );

    return (
      <div
        className="group flex items-center gap-2 pr-2 rounded-md transition-colors"
        style={{
          backgroundColor: isActive ? colors.sidebarActive : "transparent",
        }}
        onMouseEnter={(e) =>
          !isActive &&
          (e.currentTarget.style.backgroundColor = colors.sidebarHover)
        }
        onMouseLeave={(e) =>
          !isActive && (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <button
          onClick={onClick}
          className="flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
          style={{
            color: isActive ? colors.textPrimary : colors.textSecondary,
          }}
        >
          {icons[channel.type]}
          <span className="text-sm font-medium truncate">{channel.name}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSettingsClick();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
          style={{ color: colors.textTertiary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.textPrimary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.textTertiary)
          }
        >
          <IconSettings size={16} />
        </button>
      </div>
    );
  }
);

ChannelLink.displayName = "ChannelLink";

const CategorySection = React.memo(
  ({
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
    const { colors } = useTheme();

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase transition-colors rounded"
          style={{ color: colors.textTertiary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.textPrimary;
            e.currentTarget.style.backgroundColor = colors.sidebarHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textTertiary;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <IconChevronDown size={14} />
          </motion.div>
          {category.name}
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
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
  }
);

CategorySection.displayName = "CategorySection";

const CommunityHeader = memo(
  ({
    community,
    isDropdownOpen,
    onToggleDropdown,
    memberCount,
  }: {
    community: Server;
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
    memberCount: number;
  }) => {
    const { colors } = useTheme();

    return (
      <header
        className="relative flex h-14 shrink-0 items-center justify-between px-4 shadow-sm"
        style={{
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.sidebarBackground,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={community.imageUrl || "/default-avatar.png"}
            alt={community.name}
            className="h-8 w-8 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h1
              className="truncate font-bold text-sm"
              style={{ color: colors.textPrimary }}
            >
              {community.name}
            </h1>
            <p
              className="text-xs truncate"
              style={{ color: colors.textTertiary }}
            >
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md transition-colors"
            style={{ color: colors.textTertiary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.sidebarHover;
              e.currentTarget.style.color = colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.textTertiary;
            }}
          >
            <IconBell size={18} />
          </button>
          <button
            onClick={onToggleDropdown}
            className="p-2 rounded-md transition-colors"
            style={{ color: colors.textTertiary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.sidebarHover;
              e.currentTarget.style.color = colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.textTertiary;
            }}
          >
            <IconChevronDown
              size={18}
              style={{
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
      </header>
    );
  }
);

CommunityHeader.displayName = "CommunityHeader";

const CommunityDropdown = memo(
  ({
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
    const { colors } = useTheme();

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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const menuItems = [
      {
        id: "invite",
        label: "Invite People",
        icon: IconUserPlus,
        danger: false,
      },
      {
        id: "settings",
        label: "Server Settings",
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
    ];

    const leaveItem = {
      id: "leave",
      label: "Leave Server",
      icon: IconLogout,
      danger: true,
    };

    return (
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute top-16 left-4 right-4 rounded-lg shadow-2xl overflow-hidden z-50"
        style={{
          backgroundColor: colors.modalBackground,
          border: `1px solid ${colors.modalBorder}`,
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.ownerOnly && !isOwner;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onOptionSelect(item.id)}
              disabled={isDisabled}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors disabled:cursor-not-allowed"
              style={{
                color: isDisabled ? colors.textMuted : colors.textPrimary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.backgroundColor = colors.hover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isDisabled && (
                <span
                  className="ml-auto text-xs"
                  style={{ color: colors.textMuted }}
                >
                  Owner Only
                </span>
              )}
            </button>
          );
        })}

        {!isOwner && (
          <>
            <div
              style={{
                height: "1px",
                backgroundColor: colors.divider,
                margin: "4px 8px",
              }}
            />
            <button
              onClick={() => onOptionSelect(leaveItem.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
              style={{ color: colors.error, backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.errorLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <leaveItem.icon size={18} />
              <span>{leaveItem.label}</span>
            </button>
          </>
        )}
      </motion.div>
    );
  }
);

CommunityDropdown.displayName = "CommunityDropdown";

const SettingsModal = memo(
  ({
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
    const { colors } = useTheme();

    const handleCopyInvite = useCallback(() => {
      const inviteLink = `${window.location.origin}/invite/${community._id}`;
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, [community._id]);

    const handleLeaveServer = useCallback(async () => {
      if (!session?.appJwt) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/profile/leave-server/${community._id}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${session.appJwt}` },
          }
        );

        if (response.ok) {
          window.location.href = "/community";
        }
      } catch (error) {
        console.error("Failed to leave server:", error);
      }
    }, [session?.appJwt, community._id]);

    if (!isOpen) return null;

    const renderContent = () => {
      switch (type) {
        case "invite":
          return (
            <div className="space-y-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                Invite People
              </h2>
              <p style={{ color: colors.textSecondary }}>
                Share this link with others to grant access to {community.name}
              </p>
              <div
                className="flex items-center gap-2 rounded-lg p-3"
                style={{ backgroundColor: colors.surface }}
              >
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/invite/${community._id}`}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: colors.textPrimary }}
                />
                <button
                  onClick={handleCopyInvite}
                  className="px-3 py-2 rounded-md transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      colors.primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
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
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                Server Settings
              </h2>
              {!isOwner ? (
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: colors.errorLight,
                    border: `1px solid ${colors.error}`,
                  }}
                >
                  <p style={{ color: colors.error }}>
                    Only the server owner can access these settings.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.textSecondary }}
                    >
                      Server Name
                    </label>
                    <input
                      type="text"
                      defaultValue={community.name}
                      className="w-full rounded-lg px-4 py-2 transition-colors"
                      style={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.textSecondary }}
                    >
                      Description
                    </label>
                    <textarea
                      defaultValue={community.description}
                      rows={4}
                      className="w-full rounded-lg px-4 py-2 transition-colors"
                      style={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <button
                    className="w-full py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.primaryHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.primary)
                    }
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          );

        case "notifications":
          return (
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                Notification Settings
              </h2>
              <div className="space-y-4">
                {["All Messages", "Only Mentions", "Nothing"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <input
                      type="radio"
                      name="notifications"
                      defaultChecked={option === "All Messages"}
                      style={{ accentColor: colors.primary }}
                    />
                    <span style={{ color: colors.textPrimary }}>{option}</span>
                  </label>
                ))}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: colors.divider,
                    margin: "12px 0",
                  }}
                />
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors">
                  <span style={{ color: colors.textPrimary }}>Mute Server</span>
                  <input
                    type="checkbox"
                    style={{ accentColor: colors.primary }}
                  />
                </label>
              </div>
            </div>
          );

        case "privacy":
          return (
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                Privacy Settings
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Direct Messages", defaultChecked: true },
                  { label: "Allow Friend Requests", defaultChecked: true },
                  { label: "Show Activity", defaultChecked: false },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <span style={{ color: colors.textPrimary }}>
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked={item.defaultChecked}
                      style={{ accentColor: colors.primary }}
                    />
                  </label>
                ))}
              </div>
            </div>
          );

        case "leave":
          return (
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.error }}
              >
                Leave Server
              </h2>
              <p style={{ color: colors.textSecondary }}>
                Are you sure you want to leave{" "}
                <strong style={{ color: colors.textPrimary }}>
                  {community.name}
                </strong>
                ? You won't be able to rejoin this server unless you are
                re-invited.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      colors.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.surface)
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveServer}
                  className="flex-1 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.error, color: "#ffffff" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: colors.overlay }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.modalBackground,
              border: `1px solid ${colors.modalBorder}`,
            }}
          >
            <div
              className="sticky top-0 p-6 flex items-center justify-between"
              style={{
                backgroundColor: colors.modalBackground,
                borderBottom: `1px solid ${colors.divider}`,
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={community.imageUrl || "/default-avatar.png"}
                  alt={community.name}
                  className="h-10 w-10 rounded-lg"
                />
                <span
                  className="font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {community.name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md transition-colors"
                style={{ color: colors.textTertiary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hover;
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.textTertiary;
                }}
              >
                <IconX size={24} />
              </button>
            </div>
            <div className="p-6">{renderContent()}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

SettingsModal.displayName = "SettingsModal";

export const CommunityView = ({
  initialChannelId,
}: {
  initialChannelId: string;
}) => {
  const router = useRouter();
  const { openChannelSettings } = useSettingsModal();
  const { user } = useAuth();
  const { colors } = useTheme();

  const { server: community, isLoading } = useCommunity();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [settingsModal, setSettingsModal] = useState<{
    isOpen: boolean;
    type: string;
  }>({
    isOpen: false,
    type: "",
  });

  const activeChannelRef = useRef<Channel | null>(null);

  const findChannelById = useCallback(
    (id: string) => {
      if (!community) return null;
      for (const category of community.categories) {
        const foundChannel = category.channels.find((c) => c._id === id);
        if (foundChannel) return foundChannel;
      }
      return community.categories[0]?.channels[0] || null;
    },
    [community]
  );

  const activeChannel = useMemo(() => {
    if (!community) return null;

    for (const category of community.categories) {
      const foundChannel = category.channels.find(
        (c) => c._id === initialChannelId
      );
      if (foundChannel) return foundChannel;
    }
    return community.categories[0]?.channels[0] || null;
  }, [community, initialChannelId]);

  const isOwner = useMemo(
    () => community?.owner?._id === user?.id,
    [community?.owner?._id, user?.id]
  );

  const memberCount = useMemo(
    () => community?.members?.length || 0,
    [community?.members?.length]
  );

  const handleChannelSelect = useCallback(
    (channel: Channel) => {
      if (channel._id === activeChannel?._id) return;
      router.push(`/community/${community!._id}/${channel._id}`);
    },
    [community, activeChannel, router]
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

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  if (isLoading) {
    return <CommunityViewSkeleton />;
  }

  if (!community) {
    return <div>Community not found.</div>;
  }

  return (
    <div className="flex h-full w-full">
      <div
        className="flex flex-col w-60 shrink-0"
        style={{
          borderRight: `1px solid ${colors.border}`,
          backgroundColor: colors.sidebarBackground,
        }}
      >
        <CommunityHeader
          community={community}
          isDropdownOpen={isDropdownOpen}
          onToggleDropdown={toggleDropdown}
          memberCount={memberCount}
        />

        <nav className="flex-1 space-y-2 overflow-y-auto p-2 no-scrollbar">
          {community?.categories?.map((category: any) => (
            <CategorySection
              key={category._id}
              category={category}
              activeChannelId={activeChannel?._id || null}
              onChannelSelect={handleChannelSelect}
              onSettingsSelect={handleSettingsSelect}
            />
          ))}
        </nav>

        <CommunityDropdown
          community={community}
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
          onOptionSelect={handleDropdownOptionSelect}
          isOwner={isOwner}
        />
      </div>

      <div className="flex flex-1 flex-col min-h-0">
        <main className="flex-1 min-h-0">
          {activeChannel ? (
            <ChatView
              key={activeChannel._id}
              channel={activeChannel}
              server={community}
            />
          ) : (
            <div
              className="flex h-full flex-col items-center justify-center text-center p-8"
              style={{ backgroundColor: colors.background }}
            >
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full mb-4"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <IconHash size={48} style={{ color: colors.textTertiary }} />
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                Welcome to {community.name}
              </h2>
              <p className="max-w-md" style={{ color: colors.textSecondary }}>
                Select a channel to start chatting, or maybe this server has no
                channels yet.
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
