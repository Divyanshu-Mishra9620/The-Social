import useSWR from "swr";
import { useSession } from "next-auth/react";
import { Message } from "@/types/server";
import { apiClient } from "@/lib/apiClient";
import { useMemo } from "react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = ([url, token]: [string, string]): Promise<Message[]> =>
  apiClient(url, token).then((data) => data || []);

export const useChannelMessages = (channelId: string | null) => {
  const { data: session } = useSession();

  const key =
    channelId && session?.appJwt
      ? [
          `${BACKEND_URI}/api/v1/message/get-messages/${channelId}`,
          session.appJwt,
        ]
      : null;

  const { data, error, isLoading, mutate } = useSWR<Message[]>(key, fetcher);

  const messages = useMemo(() => {
    return data?.slice().reverse() || [];
  }, [data]);

  return {
    messages,
    isLoading,
    error,
    mutateMessages: mutate,
  };
};
