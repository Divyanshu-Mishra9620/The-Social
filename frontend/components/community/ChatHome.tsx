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
import { ThemeProvider, useTheme } from "./ThemeProvider";

// A new inner component to access the theme context
const ThemedChatHome = () => {
  const { colors } = useTheme(); // Access the current theme's colors
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
    <div
      className="relative h-[100dvh] w-screen overflow-hidden font-sans transition-colors duration-500"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Background Orb and Blur Effect */}
      <div className="absolute inset-0 z-0">
        <Orb />
      </div>
      <div
        className="absolute inset-0 z-[1] backdrop-blur-2xl"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }} // Consistent blur overlay
      />

      {/* Main Layout */}
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
              <div
                className="flex h-full w-full items-center justify-center rounded-2xl"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <IconLoader2
                  size={40}
                  className="animate-spin"
                  style={{ color: colors.textSecondary }}
                />
              </div>
            ) : (
              <SearchedCommunityList communities={communitiesToDisplay} />
            )}
          </main>
        </div>
      </div>

      <CreateServerModel
        isOpen={isModelOpen}
        onClose={handleModelToggle}
        // onSuccess={onServerCreated}
      />
    </div>
  );
};

// The main export wraps the app in the provider
export default function ChatHome() {
  return (
    <ThemeProvider>
      <ThemedChatHome />
    </ThemeProvider>
  );
}
