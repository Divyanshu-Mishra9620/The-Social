import useSWR from "swr";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";
import { useMemo } from "react";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

const fetcher = ([url, token]: [string, string]) => apiClient(url, token);

export const useUserServers = () => {
  const { data: session } = useSession();

  const key = session?.appJwt
    ? [`${BACKEND_URI}/api/v1/profile/user-servers`, session.appJwt]
    : null;

  const { data, error, isLoading, mutate } = useSWR<any>(key, fetcher);

  const userServers = useMemo(() => {
    return data?.servers || [];
  }, [data]);

  return {
    userServers,
    isLoading,
    error,
    mutateUserServers: mutate,
  };
};
