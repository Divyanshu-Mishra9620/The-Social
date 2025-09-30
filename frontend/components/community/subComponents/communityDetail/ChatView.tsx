"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { IconHash, IconPaperclip, IconSend } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Channel, Server, Message } from "@/types/server";
import { useSession } from "next-auth/react";
import { useChannelMessages } from "@/hooks/useChannelMessages";
import { useSocket } from "@/hooks/useSocket";
import { apiClient } from "@/lib/apiClient";
import { formatDate } from "@/lib/utils";
import { useTheme } from "@/components/community/ThemeProvider";

type ClientMessage = Message & {
  tempId?: string;
  status?: "sending" | "failed";
};

const SkeletonMessage = () => {
  const { colors } = useTheme();
  return (
    <div className="flex animate-pulse items-start gap-3">
      <div
        className="h-9 w-9 rounded-full"
        style={{ backgroundColor: colors.skeletonBase }}
      />
      <div className="flex-1 space-y-2">
        <div
          className="h-4 w-24 rounded"
          style={{ backgroundColor: colors.skeletonBase }}
        />
        <div
          className="h-16 w-3/4 rounded-xl"
          style={{ backgroundColor: colors.skeletonBase }}
        />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  const { colors } = useTheme();
  return (
    <div className="space-y-6 px-6 py-4">
      <div className="text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.surface,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: colors.border,
          }}
        >
          <IconHash
            size={32}
            className="animate-pulse"
            style={{ color: colors.textTertiary }}
          />
        </div>
        <div
          className="mt-4 mx-auto h-8 w-48 rounded animate-pulse"
          style={{ backgroundColor: colors.skeletonBase }}
        />
        <div
          className="mt-2 mx-auto h-4 w-64 rounded animate-pulse"
          style={{ backgroundColor: colors.skeletonBase }}
        />
      </div>
      <SkeletonMessage />
      <SkeletonMessage />
      <SkeletonMessage />
      <SkeletonMessage />
    </div>
  );
};

const MessageBubble = ({
  message,
  isOwnMessage,
}: {
  message: ClientMessage;
  isOwnMessage: boolean;
}) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      className={`flex items-start gap-3 ${
        isOwnMessage ? "flex-row-reverse" : ""
      }`}
      style={{ opacity: message.status === "sending" ? 0.6 : 1 }}
    >
      <img
        src={message.sender.profilePic || "/default-avatar.png"}
        alt={message.sender.name}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2"
        style={{
          // @ts-ignore
          ringColor: colors.border,
          ringOffsetColor: colors.background,
        }}
      />
      <div
        className={`flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {!isOwnMessage && (
            <span
              className="text-sm font-semibold"
              style={{ color: colors.textPrimary }}
            >
              {message.sender.name}
            </span>
          )}
          <span className="text-xs" style={{ color: colors.textMuted }}>
            {message.createdAt ? formatDate(message.createdAt) : "Sending..."}
          </span>
        </div>
        <div
          className={`mt-1 max-w-lg break-words rounded-xl px-4 py-2.5 text-sm shadow-sm ${
            isOwnMessage ? "rounded-br-none text-white" : "rounded-bl-none"
          }`}
          style={
            isOwnMessage
              ? { background: colors.chatBubbleOwn }
              : {
                  backgroundColor: colors.chatBubbleOther,
                  color: colors.textPrimary,
                }
          }
        >
          <p>{message.content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const ChatView = ({
  channel,
  server,
}: {
  channel: Channel;
  server: Server;
}) => {
  const { data: session } = useSession();
  const { colors } = useTheme();
  const { messages: initialMessages, isLoading } = useChannelMessages(
    channel._id
  );
  const socket = useSocket(channel._id);

  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [channel._id]);

  useEffect(() => {
    if (initialMessages) {
      const sortedMessages = [...initialMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sortedMessages);
    }
  }, [initialMessages]);

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => {
      const optimisticIndex = prevMessages.findIndex(
        (msg) => msg.tempId && msg.content === newMessage.content
      );

      if (optimisticIndex > -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[optimisticIndex] = newMessage;
        return updatedMessages;
      }

      if (prevMessages.some((msg) => msg._id === newMessage._id)) {
        return prevMessages;
      }

      return [...prevMessages, newMessage];
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.appJwt) return;

    const tempId = Date.now().toString();
    const contentToSend = newMessage;

    const optimisticMessage: ClientMessage = {
      _id: tempId,
      channel: channel._id,
      content: contentToSend,
      sender: {
        _id: session.user.id,
        name: session.user.name || "You",
        profilePic: session.user.image || "/default-avatar.png",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tempId: tempId,
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const formData = new FormData();
      formData.append("content", contentToSend);
      formData.append("serverId", server._id);

      await apiClient(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/message/create-message/${channel._id}`,
        session.appJwt,
        { method: "POST", body: formData }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  return (
    <div
      className="relative flex h-full flex-col"
      style={{ backgroundColor: colors.chatBackground }}
    >
      <div
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isLoading && messages.length === 0 ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6 px-6 py-4">
            <div className="text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border,
                }}
              >
                <IconHash size={32} style={{ color: colors.textTertiary }} />
              </div>
              <h2
                className="mt-4 text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                Welcome to #{channel.name}!
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: colors.textTertiary }}
              >
                This is the beginning of this channel.
              </p>
            </div>

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwnMessage={message.sender._id === session?.user?.id}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 rounded-xl p-2 shadow-lg backdrop-blur-xl transition-all duration-200"
          style={{
            backgroundColor: colors.chatInputBackground,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: colors.border,
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focus}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <button
            type="button"
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textTertiary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.textTertiary;
            }}
          >
            <IconPaperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 bg-transparent text-sm focus:outline-none disabled:opacity-50"
            style={{
              color: colors.textPrimary,
              caretColor: colors.primary,
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-lg p-2 text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: colors.primary,
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <IconSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
