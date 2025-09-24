import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Server } from "@/types/server";
import { apiClient } from "@/lib/apiClient";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const useServerDetails = (serverId: string | null | undefined) => {
  const [server, setServer] = useState<Server | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (!serverId || !session?.appJwt) {
        setServer(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await apiClient(
          `${BACKEND_URI}/api/v1/server/get-server/${serverId}`,
          session.appJwt,
          { signal: abortController.signal }
        );

        setServer(data.server);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [serverId, session?.appJwt]);

  return {
    server,
    isLoading,
    error,
  };
};
