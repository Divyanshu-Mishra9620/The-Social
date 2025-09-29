"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconSearch, IconPlus, IconPalette } from "@tabler/icons-react";
import { useTheme } from "../ThemeProvider";

const ThemeToggle = () => {
  const { toggleTheme, colors } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        color: colors.textSecondary,
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:text-white"
    >
      <IconPalette size={20} />
    </button>
  );
};

const CreateCommunityButton = ({ onClick }: { onClick?: () => void }) => {
  const { colors } = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        color: colors.textSecondary,
      }}
      className="relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full px-3 md:px-5 font-medium shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none"
    >
      <IconPlus size={16} />
      <span className="hidden md:inline">Create Community</span>
    </button>
  );
};

const SearchComponent = ({
  handleCommunities,
}: {
  handleCommunities?: (searchInput: string) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const { colors } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommunities?.(searchInput);
  };
  return (
    <form onSubmit={handleSearch} className="group relative hidden md:block">
      <IconSearch
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: colors.textSecondary }}
      />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search communities..."
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.textSecondary,
        }}
        className="h-10 w-48 rounded-full border bg-transparent pl-9 pr-4 text-sm backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-500 focus:w-60 focus:outline-none focus:ring-2"
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
  const { colors } = useTheme();
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surfaceHover} 100%)`,
        borderColor: colors.border,
        boxShadow: `0 8px 24px ${colors.background}aa`,
      }}
      className="relative z-50 flex w-full items-center justify-between rounded-2xl border px-4 py-2 shadow-lg backdrop-blur-2xl"
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
