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
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={`flex items-start gap-3 ${
      isOwnMessage ? "flex-row-reverse" : ""
    }`}
  >
    <img
      src={message.sender.profilePic || "/default-avatar.png"}
      alt={message.sender.name}
      className="h-10 w-10 rounded-full object-cover"
    />
    <div
      className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <div className="flex items-center gap-2">
        {!isOwnMessage && (
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            {message.sender.name}
          </span>
        )}
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {formatDate(message.createdAt)}
        </span>
      </div>
      <div
        className={`mt-1 max-w-lg rounded-xl px-4 py-2 break-words ${
          isOwnMessage
            ? "rounded-br-none bg-blue-600 text-white"
            : "rounded-bl-none bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
        }`}
      >
        <p className="text-sm">{message.content}</p>
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useSocket(channel._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const sorted = [...initialMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sorted);
    }
  }, [initialMessages]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) =>
        prev.some((msg) => msg._id === newMessage._id)
          ? prev
          : [...prev, newMessage]
      );
    };
    socket.on("message", handleNewMessage);
    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket]);

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
    <div className="flex h-full flex-col bg-white dark:bg-neutral-900">
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <IconLoader2 size={32} className="animate-spin text-neutral-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <IconHash size={40} className="text-neutral-500" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-neutral-800 dark:text-neutral-100">
                  Welcome to #{channel.name}!
                </h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Be the first to say something.
                </p>
              </div>
            )}
            <AnimatePresence>
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
      <div className="shrink-0 border-t border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 rounded-xl bg-neutral-100 px-3 py-2 dark:bg-neutral-800"
        >
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <IconPaperclip size={22} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-md bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <IconSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
