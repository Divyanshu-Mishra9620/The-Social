import { Server } from "@/types/server";
import useSWR from "swr";

const fetcher = async (url: string): Promise<Server[]> => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  const data = await res.json();
  return data.servers;
};

export const useServerSearch = (searchTerm: string) => {
  const apiKey = searchTerm
    ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/server/search-servers?q=${searchTerm}`
    : null;

  const { data, error, isLoading } = useSWR<Server[]>(apiKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    communities: data ?? [],
    isLoading,
    error,
  };
};
