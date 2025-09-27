"use client";
import { useState } from "react";
import { CommunitySidebar } from "./Sidebar";
import { SearchedCommunityList } from "./SearchedCommunityList";
import PillNav from "./subComponents/PillNav";
import CreateServerModel from "./subComponents/CreateServerModel";
import { useServerSearch } from "@/hooks/useServerSearch"; // Assuming you have this
import { useUserServers } from "@/hooks/useUserServers"; // Assuming you have this

export default function ChatHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelOpen, setModelOpen] = useState(false);

  const { communities: searchedCommunities, isLoading: isSearchLoading } =
    useServerSearch(searchTerm);
  const {
    userServers,
    isLoading: isUserServersLoading,
    mutateUserServers,
  } = useUserServers();

  const communitiesToDisplay = searchTerm ? searchedCommunities : userServers;
  const isLoading = searchTerm ? isSearchLoading : isUserServersLoading;

  const handleSearch = (searchInput: string) => setSearchTerm(searchInput);
  const handleModelOpen = () => setModelOpen(!modelOpen);

  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-neutral-900 relative">
      <header className="fixed top-0 left-0 right-0 p-4 z-[100] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <PillNav
          logo="./globe.svg"
          logoAlt="TheSocial"
          handleCommunities={handleSearch}
          handleModelOpen={handleModelOpen}
        />
      </header>

      <div className="absolute top-20 left-0 right-0 bottom-0 flex">
        <div className="relative z-20 h-full">
          <CommunitySidebar />
        </div>
        <main className="relative flex-1 z-10 h-full">
          {isLoading ? (
            <p className="p-4 text-center text-neutral-500">Loading...</p>
          ) : (
            <SearchedCommunityList communities={communitiesToDisplay} />
          )}
        </main>
      </div>

      <CreateServerModel isOpen={modelOpen} onClose={handleModelOpen} />
    </div>
  );
}
