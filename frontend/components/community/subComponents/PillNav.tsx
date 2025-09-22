"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconSearch, IconHelpCircle, IconPlus } from "@tabler/icons-react";

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  handleCommunities?: (communities: any[]) => void;
  handleModelOpen?: () => void;
}

type CreateCommunityButtonProps = {
  onClick?: () => void;
};

const CreateCommunityButton: React.FC<CreateCommunityButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1.5px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      onClick={onClick}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-6 font-medium text-white backdrop-blur-3xl">
        <IconPlus size={18} />
        Create Community
      </span>
    </button>
  );
};

const SearchComponent = ({
  handleCommunities,
}: {
  handleCommunities?: (communities: any[]) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchInput);
    handleCommunities?.([]);
  };

  return (
    <form onSubmit={handleSearch} className="group relative">
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search..."
        className="h-10 w-40 rounded-full border-none bg-neutral-100/80 pl-10 pr-4 text-sm text-neutral-800 backdrop-blur-sm transition-all duration-300 focus:w-48 focus:bg-white focus:shadow-md focus:outline-none dark:bg-neutral-800/80 dark:text-neutral-200 dark:focus:bg-neutral-900"
      />
    </form>
  );
};

const HelpComponent = () => {
  return (
    <div className="group relative">
      <button className="flex items-center justify-center rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-200/50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200">
        <IconHelpCircle size={22} />
      </button>
      <div className="absolute top-full right-0 mt-2 scale-0 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-xs text-white transition-transform duration-150 ease-in-out group-hover:scale-100 dark:bg-neutral-700">
        Help
      </div>
    </div>
  );
};

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = "Logo",
  handleCommunities,
  handleModelOpen,
}) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative z-50 flex w-full items-center justify-between rounded-full border border-black/[0.05]  backdrop-blur-2xl p-2 shadow-md  dark:border-white/[0.05] dark:bg-neutral-900/60"
    >
      <Link href="/" className="ml-2 flex-shrink-0">
        <motion.img
          whileHover={{ rotate: 360 }}
          src={logo}
          alt={logoAlt}
          className="h-8 w-8"
        />
      </Link>

      <div className="flex items-center gap-2">
        <CreateCommunityButton onClick={handleModelOpen} />
        <SearchComponent handleCommunities={handleCommunities} />
        <HelpComponent />
      </div>
    </motion.nav>
  );
};

export default PillNav;
