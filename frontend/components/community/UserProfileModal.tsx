import React, { useState, useCallback } from "react";
import {
  IconX,
  IconUser,
  IconMicrophone,
  IconMicrophoneOff,
  IconVolume,
  IconVolumeOff,
  IconPhoneOff,
  IconSettings,
  IconCircleFilled,
  IconEdit,
  IconCamera,
  IconShield,
  IconCrown,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic?: string;
  banner?: string;
  bio?: string;
  status: "online" | "idle" | "dnd" | "offline";
  customStatus?: string;
  joinedAt: string;
  roles?: string[];
  badges?: string[];
}

interface VoiceParticipant {
  _id: string;
  name: string;
  profilePic?: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
}

const StatusBadge = ({ status }: { status: UserProfile["status"] }) => {
  const { colors } = useTheme();

  const statusConfig = {
    online: { color: colors.statusOnline, label: "Online" },
    idle: { color: colors.statusIdle, label: "Idle" },
    dnd: { color: colors.statusDnd, label: "Do Not Disturb" },
    offline: { color: colors.statusOffline, label: "Offline" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <IconCircleFilled size={12} style={{ color: config.color }} />
      <span className="text-sm" style={{ color: colors.textSecondary }}>
        {config.label}
      </span>
    </div>
  );
};

export const UserProfileModal = ({
  user,
  isOpen,
  onClose,
  isOwnProfile = false,
}: {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  isOwnProfile?: boolean;
}) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio || "");

  if (!isOpen) return null;

  const handleSaveBio = () => {
    console.log("Saving bio:", editedBio);
    setIsEditing(false);
  };

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
          className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: colors.modalBackground,
            border: `1px solid ${colors.modalBorder}`,
          }}
        >
          <div
            className="relative h-32"
            style={{ backgroundColor: colors.primary }}
          >
            {user.banner && (
              <img
                src={user.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            {isOwnProfile && (
              <button
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ backgroundColor: colors.overlay }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <IconCamera size={20} style={{ color: "#ffffff" }} />
              </button>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-full transition-colors"
              style={{ backgroundColor: colors.overlay }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <IconX size={20} style={{ color: "#ffffff" }} />
            </button>
          </div>

          <div className="p-6 pt-16">
            <div className="flex items-start gap-4 -mt-20 mb-6">
              <div className="relative">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover ring-4"
                  style={{ borderColor: colors.modalBackground }}
                />
                {isOwnProfile && (
                  <button
                    className="absolute bottom-0 right-0 p-2 rounded-full transition-colors"
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.primaryHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.primary)
                    }
                  >
                    <IconEdit size={16} style={{ color: "#ffffff" }} />
                  </button>
                )}
                <div className="absolute -bottom-1 -right-1">
                  <IconCircleFilled
                    size={20}
                    style={{
                      color:
                        user.status === "online"
                          ? colors.statusOnline
                          : colors.statusOffline,
                      filter: "drop-shadow(0 0 4px currentColor)",
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 pt-14">
                <div className="flex items-center gap-2 mb-1">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {user.name}
                  </h2>
                  {user.roles?.includes("owner") && (
                    <IconCrown size={20} style={{ color: "#FFD700" }} />
                  )}
                  {user.roles?.includes("admin") && (
                    <IconShield size={20} style={{ color: colors.error }} />
                  )}
                </div>
                <p
                  className="text-sm mb-2"
                  style={{ color: colors.textTertiary }}
                >
                  @{user.username}
                </p>
                <StatusBadge status={user.status} />
                {user.customStatus && (
                  <p
                    className="mt-2 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {user.customStatus}
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                height: "1px",
                backgroundColor: colors.divider,
                margin: "16px 0",
              }}
            />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="text-sm font-bold uppercase"
                  style={{ color: colors.textTertiary }}
                >
                  About Me
                </h3>
                {isOwnProfile && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs transition-colors"
                    style={{ color: colors.textLink }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <div>
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      color: colors.textPrimary,
                    }}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveBio}
                      className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: colors.success,
                        color: "#ffffff",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedBio(user.bio || "");
                      }}
                      className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
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
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {user.bio || "No bio yet."}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3
                className="text-sm font-bold uppercase mb-2"
                style={{ color: colors.textTertiary }}
              >
                Member Since
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {new Date(user.joinedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {user.roles && user.roles.length > 0 && (
              <div className="mb-6">
                <h3
                  className="text-sm font-bold uppercase mb-2"
                  style={{ color: colors.textTertiary }}
                >
                  Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: colors.primaryLight,
                        color: colors.primary,
                      }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isOwnProfile && (
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: colors.primary, color: "#ffffff" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      colors.primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.primary)
                  }
                >
                  Send Message
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
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
                  <IconUser size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const VoiceChannel = ({
  channelName,
  participants,
  onLeave,
}: {
  channelName: string;
  participants: VoiceParticipant[];
  onLeave: () => void;
}) => {
  const { colors } = useTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 shadow-2xl"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <IconVolume size={20} style={{ color: colors.success }} />
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: colors.textPrimary }}
              >
                Voice / {channelName}
              </p>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                {participants.length}{" "}
                {participants.length === 1 ? "participant" : "participants"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1">
            {participants.slice(0, 5).map((participant) => (
              <div key={participant._id} className="relative">
                <img
                  src={participant.profilePic || "/default-avatar.png"}
                  alt={participant.name}
                  className="h-8 w-8 rounded-full object-cover ring-2"
                  style={{
                    borderColor: participant.isSpeaking
                      ? colors.success
                      : colors.border,
                    opacity: participant.isMuted ? 0.5 : 1,
                  }}
                  title={participant.name}
                />
                {participant.isMuted && (
                  <div
                    className="absolute -bottom-1 -right-1 p-0.5 rounded-full"
                    style={{ backgroundColor: colors.error }}
                  >
                    <IconMicrophoneOff size={10} style={{ color: "#ffffff" }} />
                  </div>
                )}
              </div>
            ))}
            {participants.length > 5 && (
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.textSecondary,
                }}
              >
                +{participants.length - 5}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: isMuted ? colors.error : colors.surface,
                color: isMuted ? "#ffffff" : colors.textPrimary,
              }}
              onMouseEnter={(e) => {
                if (!isMuted) {
                  e.currentTarget.style.backgroundColor = colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isMuted) {
                  e.currentTarget.style.backgroundColor = colors.surface;
                }
              }}
            >
              {isMuted ? (
                <IconMicrophoneOff size={20} />
              ) : (
                <IconMicrophone size={20} />
              )}
            </button>

            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: isDeafened ? colors.error : colors.surface,
                color: isDeafened ? "#ffffff" : colors.textPrimary,
              }}
              onMouseEnter={(e) => {
                if (!isDeafened) {
                  e.currentTarget.style.backgroundColor = colors.surfaceHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeafened) {
                  e.currentTarget.style.backgroundColor = colors.surface;
                }
              }}
            >
              {isDeafened ? (
                <IconVolumeOff size={20} />
              ) : (
                <IconVolume size={20} />
              )}
            </button>

            <button
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: colors.surface,
                color: colors.textPrimary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.surfaceHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = colors.surface)
              }
            >
              <IconSettings size={20} />
            </button>

            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: colors.divider,
              }}
            />

            <button
              onClick={onLeave}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: colors.error, color: "#ffffff" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <IconPhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VoiceParticipantsPanel = ({
  participants,
}: {
  participants: VoiceParticipant[];
}) => {
  const { colors } = useTheme();

  return (
    <div
      className="w-60 h-full overflow-y-auto"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderLeft: `1px solid ${colors.border}`,
      }}
    >
      <div className="p-4">
        <h3
          className="text-sm font-bold uppercase mb-3"
          style={{ color: colors.textTertiary }}
        >
          In Voice — {participants.length}
        </h3>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center gap-3 p-2 rounded-lg transition-colors"
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
                  src={participant.profilePic || "/default-avatar.png"}
                  alt={participant.name}
                  className="h-8 w-8 rounded-full object-cover"
                  style={{
                    opacity:
                      participant.isMuted || participant.isDeafened ? 0.5 : 1,
                  }}
                />
                {participant.isSpeaking && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{ border: `2px solid ${colors.success}` }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: colors.textPrimary }}
                >
                  {participant.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {participant.isMuted && (
                  <IconMicrophoneOff
                    size={14}
                    style={{ color: colors.error }}
                  />
                )}
                {participant.isDeafened && (
                  <IconVolumeOff size={14} style={{ color: colors.error }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
