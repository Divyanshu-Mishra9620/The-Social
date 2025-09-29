import { useState, useEffect, useRef } from "react";
import { Message } from "@/types/server";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";

export const useChannelMessages = (channelId: string | undefined) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track the last fetched channel to prevent duplicate fetches
  const lastFetchedChannelRef = useRef<string | undefined>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId || !session?.appJwt) {
        setIsLoading(false);
        return;
      }

      // Prevent duplicate fetches for the same channel
      if (
        lastFetchedChannelRef.current === channelId ||
        isFetchingRef.current
      ) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        isFetchingRef.current = true;

        console.log("🔍 Fetching messages for channel:", channelId);

        const data = await apiClient(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/message/get-messages/${channelId}`,
          session.appJwt,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Messages API response data:", data);

        if (data.messages) {
          setMessages(data.messages);
        } else if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.warn("⚠️ Unexpected response format:", data);
          setMessages([]);
        }

        lastFetchedChannelRef.current = channelId;
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
        setMessages([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    // Reset when channel changes
    if (lastFetchedChannelRef.current !== channelId) {
      setMessages([]);
      lastFetchedChannelRef.current = undefined;
    }

    fetchMessages();
  }, [channelId, session?.appJwt]);

  return { messages, isLoading, error };
};
