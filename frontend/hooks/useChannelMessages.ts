"use client";
import { useState, useEffect, useRef } from "react";
import { Message } from "@/types/server";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";

const messageCache = new Map<
  string,
  { messages: Message[]; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000;

export const useChannelMessages = (channelId: string | undefined) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentChannelIdRef = useRef<string | undefined>(channelId);

  useEffect(() => {
    currentChannelIdRef.current = channelId;

    setMessages([]);
    setIsLoading(true);
    setError(null);
  }, [channelId]);

  useEffect(() => {
    let isCancelled = false;

    const loadMessages = async () => {
      if (!channelId || !session?.appJwt) {
        if (!isCancelled) {
          setMessages([]);
          setIsLoading(false);
        }
        return;
      }

      if (currentChannelIdRef.current !== channelId) {
        return;
      }

      try {
        const cached = messageCache.get(channelId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (!isCancelled && currentChannelIdRef.current === channelId) {
            setMessages(cached.messages);
            setIsLoading(false);
          }
          return;
        }

        console.log("🔍 Fetching messages for channel:", channelId);
        const data = await apiClient(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/message/get-messages/${channelId}`,
          session.appJwt
        );

        if (!isCancelled && currentChannelIdRef.current === channelId) {
          const fetchedMessages =
            data.messages || (Array.isArray(data) ? data : []);

          const sortedMessages = fetchedMessages.sort(
            (a: Message, b: Message) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          messageCache.set(channelId, {
            messages: sortedMessages,
            timestamp: Date.now(),
          });
          setMessages(sortedMessages);
          console.log(
            "✅ Messages loaded successfully:",
            sortedMessages.length
          );
        }
      } catch (err) {
        if (!isCancelled && currentChannelIdRef.current === channelId) {
          console.error("❌ Error fetching messages:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load messages"
          );
        }
      } finally {
        if (!isCancelled && currentChannelIdRef.current === channelId) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(loadMessages, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [channelId, session?.appJwt]);

  return { messages, isLoading, error };
};
