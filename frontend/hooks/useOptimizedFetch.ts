import { useRef, useEffect, useCallback } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/apiClient";

export function useOptimizedFetch<T>(
  key: string | null,
  options?: SWRConfiguration<T>
) {
  const { data: session } = useSession();
  const abortControllerRef = useRef<AbortController>(null);

  const fetcher = useCallback(
    async (url: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      return apiClient(url, session?.appJwt || "", {
        signal: abortControllerRef.current.signal,
      });
    },
    [session?.appJwt]
  );

  const swrKey = key && session?.appJwt ? key : null;

  const result = useSWR<T>(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    ...options,
  });

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return result;
}
