import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "@/types/server";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";
import { log } from "console";

const CACHE_DURATION = 5 * 60 * 1000;
const messageCache = new Map<
  string,
  { messages: Message[]; timestamp: number }
>();

export function useChannelMessages(channelId: string | undefined) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentChannelRef = useRef<string | undefined>(channelId);
  const abortControllerRef = useRef<AbortController>(null);

  useEffect(() => {
    if (currentChannelRef.current !== channelId) {
      currentChannelRef.current = channelId;
      setMessages([]);
      setIsLoading(true);
      setError(null);
    }
  }, [channelId]);

  const loadMessages = useCallback(async () => {
    if (!channelId || !session?.appJwt) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const cached = messageCache.get(channelId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setMessages(cached.messages);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiClient(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/message/get-messages/${channelId}`,
        session.appJwt,
        { signal: abortControllerRef.current.signal }
      );
      console.log("API Response:", data);

      const fetchedMessages = data || [];
      console.log("Fetched messages:", fetchedMessages);

      const sortedMessages = fetchedMessages.sort(
        (a: Message, b: Message) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      console.log("Sorted messages:", sortedMessages);

      messageCache.set(channelId, {
        messages: sortedMessages,
        timestamp: Date.now(),
      });

      setMessages(sortedMessages);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load messages");
      }
    } finally {
      setIsLoading(false);
    }
  }, [channelId, session?.appJwt]);

  useEffect(() => {
    loadMessages();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadMessages]);

  const addMessage = useCallback(
    (newMessage: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        const updated = [...prev, newMessage];

        if (channelId) {
          messageCache.set(channelId, {
            messages: updated,
            timestamp: Date.now(),
          });
        }

        return updated;
      });
    },
    [channelId]
  );

  return { messages, isLoading, error, addMessage, refetch: loadMessages };
}
