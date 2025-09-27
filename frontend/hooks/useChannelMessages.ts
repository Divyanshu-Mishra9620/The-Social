import { useState, useEffect } from "react";
import { Message } from "@/types/server";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";

export const useChannelMessages = (channelId: string | undefined) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId || !session?.appJwt) {
        console.log("Missing channelId or JWT:", {
          channelId,
          hasJwt: !!session?.appJwt,
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("🔍 Fetching messages for channel:", channelId);
        console.log(
          "📡 API URL:",
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/message/get-messages/${channelId}`
        );

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
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [channelId, session?.appJwt]);

  return { messages, isLoading, error };
};
