import React, { useState, useCallback, useMemo } from "react";
import {
  IconSearch,
  IconX,
  IconUser,
  IconCircleFilled,
  IconPlus,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface User {
  _id: string;
  name: string;
  profilePic?: string;
  status: "online" | "idle" | "dnd" | "offline";
  lastSeen?: string;
}

interface DirectMessage {
  _id: string;
  participants: User[];
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  unreadCount: number;
}

const StatusIndicator = ({ status }: { status: User["status"] }) => {
  const { colors } = useTheme();

  const statusColors = {
    online: colors.statusOnline,
    idle: colors.statusIdle,
    dnd: colors.statusDnd,
    offline: colors.statusOffline,
  };

  return (
    <div className="relative">
      <IconCircleFilled
        size={12}
        style={{
          color: statusColors[status],
          filter: "drop-shadow(0 0 2px currentColor)",
        }}
      />
    </div>
  );
};

const DMListItem = ({
  dm,
  currentUserId,
  isActive,
  onClick,
}: {
  dm: DirectMessage;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const { colors } = useTheme();
  const otherUser = dm.participants.find((p) => p._id !== currentUserId);

  if (!otherUser) return null;

  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all"
      style={{
        backgroundColor: isActive ? colors.sidebarActive : "transparent",
        color: colors.textPrimary,
      }}
      whileHover={{ backgroundColor: colors.sidebarHover }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        <img
          src={otherUser.profilePic || "/default-avatar.png"}
          alt={otherUser.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusIndicator status={otherUser.status} />
        </div>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <p
            className="font-medium text-sm truncate"
            style={{ color: colors.textPrimary }}
          >
            {otherUser.name}
          </p>
          {dm.unreadCount > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: colors.error,
                color: "#ffffff",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {dm.unreadCount}
            </span>
          )}
        </div>
        {dm.lastMessage && (
          <p
            className="text-xs truncate"
            style={{ color: colors.textTertiary }}
          >
            {dm.lastMessage.content}
          </p>
        )}
      </div>
    </motion.button>
  );
};

const NewDMModal = ({
  isOpen,
  onClose,
  onSelectUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const allUsers: User[] = [
    {
      _id: "1",
      name: "Alice Johnson",
      status: "online",
      profilePic: "/avatars/alice.jpg",
    },
    {
      _id: "2",
      name: "Bob Smith",
      status: "idle",
      profilePic: "/avatars/bob.jpg",
    },
    {
      _id: "3",
      name: "Carol Williams",
      status: "dnd",
      profilePic: "/avatars/carol.jpg",
    },
  ];

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: colors.overlay }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-xl shadow-2xl"
          style={{
            backgroundColor: colors.modalBackground,
            border: `1px solid ${colors.modalBorder}`,
          }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${colors.divider}` }}
          >
            <h2
              className="text-lg font-bold"
              style={{ color: colors.textPrimary }}
            >
              Start a Conversation
            </h2>
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
              <IconX size={20} />
            </button>
          </div>

          <div className="p-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <IconSearch size={18} style={{ color: colors.textTertiary }} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: colors.textPrimary }}
                autoFocus
              />
            </div>

            <div className="mt-4 space-y-1 max-h-80 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.hover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/default-avatar.png"}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <StatusIndicator status={user.status} />
                    </div>
                  </div>
                  <div className="text-left">
                    <p
                      className="font-medium text-sm"
                      style={{ color: colors.textPrimary }}
                    >
                      {user.name}
                    </p>
                    <p
                      className="text-xs capitalize"
                      style={{ color: colors.textTertiary }}
                    >
                      {user.status}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const DirectMessagesSidebar = ({
  currentUserId,
}: {
  currentUserId: string;
}) => {
  const { colors } = useTheme();
  const [activeDM, setActiveDM] = useState<string | null>(null);
  const [isNewDMOpen, setIsNewDMOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const directMessages: DirectMessage[] = [
    {
      _id: "dm1",
      participants: [
        { _id: currentUserId, name: "You", status: "online" },
        {
          _id: "u1",
          name: "Alice Johnson",
          profilePic: "/avatars/alice.jpg",
          status: "online",
        },
      ],
      lastMessage: {
        content: "Hey, how are you?",
        timestamp: new Date().toISOString(),
        sender: "u1",
      },
      unreadCount: 2,
    },
    {
      _id: "dm2",
      participants: [
        { _id: currentUserId, name: "You", status: "online" },
        {
          _id: "u2",
          name: "Bob Smith",
          profilePic: "/avatars/bob.jpg",
          status: "idle",
        },
      ],
      lastMessage: {
        content: "Thanks for the help!",
        timestamp: new Date().toISOString(),
        sender: currentUserId,
      },
      unreadCount: 0,
    },
  ];

  const filteredDMs = useMemo(() => {
    if (!searchQuery) return directMessages;
    return directMessages.filter((dm) => {
      const otherUser = dm.participants.find((p) => p._id !== currentUserId);
      return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, directMessages, currentUserId]);

  const handleNewDM = useCallback((user: User) => {
    console.log("Starting DM with:", user);
  }, []);

  return (
    <div
      className="flex flex-col h-full w-60"
      style={{
        backgroundColor: colors.sidebarBackground,
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      <div
        className="p-4"
        style={{ borderBottom: `1px solid ${colors.divider}` }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ color: colors.textPrimary }}>
            Direct Messages
          </h2>
          <button
            onClick={() => setIsNewDMOpen(true)}
            className="p-1.5 rounded-md transition-colors"
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
            <IconPlus size={18} />
          </button>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <IconSearch size={16} style={{ color: colors.textTertiary }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: colors.textPrimary }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDMs.length > 0 ? (
          filteredDMs.map((dm) => (
            <DMListItem
              key={dm._id}
              dm={dm}
              currentUserId={currentUserId}
              isActive={activeDM === dm._id}
              onClick={() => setActiveDM(dm._id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <IconUser
              size={48}
              style={{ color: colors.textMuted, opacity: 0.5 }}
            />
            <p className="mt-2 text-sm" style={{ color: colors.textTertiary }}>
              No conversations yet
            </p>
            <button
              onClick={() => setIsNewDMOpen(true)}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: colors.primary, color: "#ffffff" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = colors.primary)
              }
            >
              Start a conversation
            </button>
          </div>
        )}
      </div>

      <NewDMModal
        isOpen={isNewDMOpen}
        onClose={() => setIsNewDMOpen(false)}
        onSelectUser={handleNewDM}
      />
    </div>
  );
};
