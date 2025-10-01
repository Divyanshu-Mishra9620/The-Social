import { useMemo } from "react";
import { useOptimizedFetch } from "./useOptimizedFetch";
import { Server } from "@/types/server";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export function useOptimizedServerDetails(serverId: string | null | undefined) {
  const key = serverId
    ? `${BACKEND_URI}/api/v1/server/get-server/${serverId}`
    : null;

  const { data, error, isLoading, mutate } = useOptimizedFetch<{
    server: Server;
  }>(key, {
    revalidateOnMount: true,
    dedupingInterval: 10000,
  });

  const server = useMemo(() => data?.server || null, [data?.server]);

  return {
    server,
    isLoading,
    error,
    mutate,
  };
}
