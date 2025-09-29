"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { CommunitySidebar } from "@/components/community/Sidebar";
import PillNav from "@/components/community/subComponents/PillNav";
import CreateServerModel from "@/components/community/subComponents/CreateServerModel";
import { useServerSearch } from "@/hooks/useServerSearch";
import { useUserServers } from "@/hooks/useUserServers";
import { IconLoader2 } from "@tabler/icons-react";
import { ThemeProvider } from "@/components/community/ThemeProvider";
import EnhancedOrb from "@/components/community/subComponents/Orb";
import { UserCommunityList } from "@/components/community/UserCommunityList";
import { CommunityProvider } from "@/context/CommunityContext";
import { useServerDetails } from "@/hooks/useServerDetails";

const useResizable = (initialWidth: number) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      setWidth((prevWidth) => {
        const newWidth = prevWidth + e.movementX;
        if (newWidth > 200 && newWidth < 500) {
          return newWidth;
        }
        return prevWidth;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return { width, handleMouseDown };
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const { width, handleMouseDown } = useResizable(256);
  const params = useParams();
  const serverId = params.serverId as string | undefined;

  const { server, isLoading: isServerLoading } = useServerDetails(serverId);

  const { communities: searchedCommunities, isLoading: isSearchLoading } =
    useServerSearch(searchTerm);
  const { userServers, isLoading: isUserServersLoading } = useUserServers();

  const communitiesToDisplay = searchTerm ? searchedCommunities : userServers;
  const isLoadingLists = searchTerm ? isSearchLoading : isUserServersLoading;

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      server,
      isLoading: isServerLoading,
    }),
    [server, isServerLoading]
  );

  const handleSearch = useCallback((searchInput: string) => {
    setSearchTerm(searchInput);
  }, []);

  const handleModelToggle = useCallback(() => {
    setIsModelOpen((prev) => !prev);
  }, []);

  return (
    <ThemeProvider>
      <div className="relative h-[100dvh] w-screen overflow-hidden bg-white font-sans dark:bg-neutral-950">
        <div className="absolute inset-0 z-0">
          <EnhancedOrb />
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
            <div
              className="flex flex-col rounded-2xl bg-black/10 dark:bg-black/20"
              style={{ width: `${width}px` }}
            >
              {isLoadingLists ? (
                <div className="flex h-full w-full items-center justify-center">
                  <IconLoader2
                    size={40}
                    className="animate-spin text-neutral-500 dark:text-neutral-400"
                  />
                </div>
              ) : (
                <UserCommunityList communities={communitiesToDisplay} />
              )}
            </div>
            <div className="resize-handle" onMouseDown={handleMouseDown} />
            <main className="flex-1 rounded-2xl min-h-0 bg-black/10 dark:bg-black/20">
              <CommunityProvider value={contextValue}>
                {children}
              </CommunityProvider>
            </main>
          </div>
        </div>

        <CreateServerModel isOpen={isModelOpen} onClose={handleModelToggle} />
      </div>
    </ThemeProvider>
  );
}
