"use client";
import { useServerSearch } from "@/hooks/useServerSearch";
import { useUserServers } from "@/hooks/useUserServers";
import { UserCommunityList } from "@/components/community/UserCommunityList";
import { ServerListSkeleton } from "@/components/Loaders";

export function UserServerList({ searchTerm }: { searchTerm: string }) {
  const { communities: searchedCommunities, isLoading: isSearchLoading } =
    useServerSearch(searchTerm);

  const { userServers, isLoading: isUserServersLoading } = useUserServers();

  const communitiesToDisplay = searchTerm ? searchedCommunities : userServers;
  const isLoadingLists = searchTerm ? isSearchLoading : isUserServersLoading;

  return (
    <>
      {isLoadingLists ? (
        <ServerListSkeleton />
      ) : (
        <UserCommunityList communities={communitiesToDisplay} />
      )}
    </>
  );
}
