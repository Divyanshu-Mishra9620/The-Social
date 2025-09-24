"use client";

import { useState } from "react";
import { CommunitySidebar } from "./Sidebar";
import SearchedCommunityList from "./SearchedCommunityList";
import PillNav from "./subComponents/PillNav";
import { FloatingDock } from "@/components/ui/floating-dock";
import Orb from "./subComponents/Orb";
import CreateServerModel from "./subComponents/CreateServerModel";
import { useServerSearch } from "@/hooks/useServerSearch";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

export default function ChatHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelOpen, setModelOpen] = useState(false);

  const { communities, isLoading, error } = useServerSearch(searchTerm);

  const handleSearch = (searchInput: string) => {
    setSearchTerm(searchInput);
  };

  const handleModelOpen = () => {
    setModelOpen(!modelOpen);
  };

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 z-[-2]">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <div className="absolute inset-0 z-[-1]">
        <div className="h-screen backdrop-blur-2xl" />
      </div>

      <header className="flex w-full items-center justify-center border-b border-b-neutral-200/50 bg-white/30 shadow-md backdrop-blur-sm dark:border-b-neutral-800/50 dark:bg-black/30">
        <PillNav
          logo="./globe.svg"
          logoAlt="Company Logo"
          handleCommunities={handleSearch}
          handleModelOpen={handleModelOpen}
        />
      </header>

      <div className="flex flex-1 flex-row overflow-hidden">
        <div className="relative hidden w-16 flex-shrink-0 md:block">
          <div className="absolute z-10">
            <CommunitySidebar />
          </div>
        </div>

        <main className="relative flex-1">
          {isLoading && <p>Loading communities...</p>}
          {error && <p>Failed to load communities.</p>}
          {!isLoading && !error && (
            <SearchedCommunityList communities={communities} />
          )}
        </main>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 md:hidden">
          <FloatingDock items={links} />
        </div>
      </div>

      <CreateServerModel isOpen={modelOpen} onClose={handleModelOpen} />
    </div>
  );
}
