"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconSearch,
  IconHelpCircle,
  IconPlus,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useTheme } from "../ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-white/10 dark:bg-black/20 dark:text-neutral-400 dark:hover:bg-black/30 dark:hover:text-white"
    >
      {theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
    </button>
  );
};

const CreateCommunityButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-800 px-3 md:px-5 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 focus:outline-none dark:bg-slate-900/80"
  >
    <IconPlus size={16} />
    <span className="hidden md:inline">Create Community</span>
  </button>
);

const SearchComponent = ({
  handleCommunities,
}: {
  handleCommunities?: (searchInput: string) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommunities?.(searchInput);
  };
  return (
    <form onSubmit={handleSearch} className="group relative hidden md:block">
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search communities..."
        className="h-10 w-48 rounded-full border border-neutral-200 bg-white pl-9 pr-4 text-sm text-neutral-800 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-400 focus:w-60 focus:border-blue-500/50 focus:bg-white/80 focus:outline-none focus:ring-1 focus:ring-blue-500/50 dark:border-white/10 dark:bg-black/20 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:bg-black/30"
      />
    </form>
  );
};

const PillNav: React.FC<any> = ({
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
      className="relative z-50 flex w-full items-center justify-between rounded-full border border-black/10 bg-white/30 p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20"
    >
      <Link href="/" className="ml-2 flex-shrink-0">
        <motion.img
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          src={logo}
          alt={logoAlt}
          className="h-8 w-8"
        />
      </Link>
      <div className="flex items-center gap-2">
        <SearchComponent handleCommunities={handleCommunities} />
        <CreateCommunityButton onClick={handleModelOpen} />
        <ThemeToggle />
      </div>
    </motion.nav>
  );
};

export default PillNav;
