"use client";
import { useState } from "react";
import { CommunitySidebar } from "./Sidebar";
import { SearchedCommunityList } from "./SearchedCommunityList";
import PillNav from "./subComponents/PillNav";
import CreateServerModel from "./subComponents/CreateServerModel";
import { useServerSearch } from "@/hooks/useServerSearch";
import { useUserServers } from "@/hooks/useUserServers";
import Orb from "./subComponents/Orb";
import { IconLoader2 } from "@tabler/icons-react";
import { ThemeProvider } from "./ThemeProvider";

export default function ChatHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);

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
  const handleModelToggle = () => setIsModelOpen(!isModelOpen);

  const onServerCreated = () => {
    setIsModelOpen(false);
    mutateUserServers();
  };

  return (
    <ThemeProvider>
      <div className="relative h-[100dvh] w-screen overflow-hidden bg-white font-sans dark:bg-neutral-950">
        <div className="absolute inset-0 z-0">
          <Orb hue={280} />
        </div>
        <div className="absolute inset-0 z-[1] bg-white/30 backdrop-blur-2xl dark:bg-black/30" />

        <div className="relative z-10 flex h-full w-full flex-col">
          <header className="shrink-0 p-2 md:p-4">
            <PillNav
              logo="/globe.svg"
              logoAlt="TheSocial"
              handleCommunities={handleSearch}
              handleModelOpen={handleModelToggle}
            />
          </header>

          <div className="flex flex-1 gap-4 px-2 pb-2 md:px-4 md:pb-4 min-h-0">
            <div className="hidden md:block">
              <CommunitySidebar />
            </div>
            <main className="flex-1 rounded-2xl min-h-0">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/10 dark:bg-black/20">
                  <IconLoader2
                    size={40}
                    className="animate-spin text-neutral-500 dark:text-neutral-400"
                  />
                </div>
              ) : (
                <SearchedCommunityList communities={communitiesToDisplay} />
              )}
            </main>
          </div>
        </div>

        <CreateServerModel isOpen={isModelOpen} onClose={handleModelToggle} />
      </div>
    </ThemeProvider>
  );
}
