"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  IconHash,
  IconPaperclip,
  IconSend,
  IconLoader2,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Channel, Server, Message } from "@/types/server";
import { useSession } from "next-auth/react";
import { useChannelMessages } from "@/hooks/useChannelMessages";
import { useSocket } from "@/hooks/useSocket";
import { apiClient } from "@/lib/apiClient";
import { formatDate } from "@/lib/utils";

const SkeletonMessage = () => (
  <div className="flex animate-pulse items-start gap-3">
    <div className="h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/4 rounded bg-gray-300 dark:bg-gray-700" />
      <div className="h-8 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
    </div>
  </div>
);

const MessageBubble = ({
  message,
  isOwnMessage,
}: {
  message: Message;
  isOwnMessage: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    layout
    className={`flex items-start gap-3 ${
      isOwnMessage ? "flex-row-reverse" : ""
    }`}
  >
    <img
      src={message.sender.profilePic || "/default-avatar.png"}
      alt={message.sender.name}
      className="h-9 w-9 rounded-full object-cover"
    />
    <div
      className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <div className="flex items-center gap-2">
        {!isOwnMessage && (
          <span className="text-sm font-semibold text-[color:var(--color-chat-view-foreground)]">
            {message.sender.name}
          </span>
        )}
        <span className="text-xs text-neutral-500">
          {formatDate(message.createdAt)}
        </span>
      </div>
      <div
        className={`mt-1 max-w-lg break-words rounded-xl px-4 py-2.5 text-sm ${
          isOwnMessage
            ? "rounded-br-none bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            : "rounded-bl-none bg-neutral-800 text-neutral-200"
        }`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  </motion.div>
);

export const ChatView = ({
  channel,
  server,
}: {
  channel: Channel;
  server: Server;
}) => {
  const { data: session } = useSession();
  const { messages: initialMessages, isLoading } = useChannelMessages(
    channel._id
  );
  const socket = useSocket(channel._id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) {
      const sortedMessages = [...initialMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sortedMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === newMessage._id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.appJwt) return;

    const contentToSend = newMessage;
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
      setNewMessage(contentToSend);
    }
  };

  return (
    <div className="relative flex h-full flex-col bg-[color:var(--color-chat-view-background)] text-[color:var(--color-chat-view-foreground)]">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="space-y-6">
            <SkeletonMessage />
            <SkeletonMessage />
            <SkeletonMessage />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/20">
                <IconHash size={32} className="text-neutral-400" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">
                Welcome to #{channel.name}!
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
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
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-2 shadow-lg backdrop-blur-xl focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50"
        >
          <button
            type="button"
            className="p-2 text-neutral-400 hover:text-white"
          >
            <IconPaperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 bg-transparent text-sm placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 hover:scale-105"
          >
            <IconSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
