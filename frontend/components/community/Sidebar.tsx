"use client";
import React, { useState, ReactNode } from "react";
import { Sidebar as SidebarPrimitive, SidebarBody } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type LinkType = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

const SidebarLink = ({
  link,
  isActive,
  isSidebarOpen,
}: {
  link: LinkType;
  isActive: boolean;
  isSidebarOpen: boolean;
}) => (
  <a
    href={link.href}
    className={cn(
      "group relative flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
      isActive
        ? "bg-black/5 text-neutral-700 dark:bg-white/10 dark:text-neutral-50"
        : "text-neutral-500 hover:bg-black/5 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-50"
    )}
  >
    {link.icon}
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="whitespace-pre"
        >
          {link.label}
        </motion.span>
      )}
    </AnimatePresence>
  </a>
);

export function CommunitySidebar() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5" />,
      active: true,
    },
    { label: "Profile", href: "#", icon: <IconUserBolt className="h-5 w-5" /> },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5" />,
    },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isSidebarOpen = isPinned || isHovered;

  return (
    <SidebarPrimitive
      open={isSidebarOpen}
      setOpen={() => {}}
      className="rounded-2xl border border-black/10 bg-white/30 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-black/20"
    >
      <SidebarBody
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="justify-between"
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-2 pl-3 pr-2 pt-1">
            <AnimatePresence>{isSidebarOpen && <Logo />}</AnimatePresence>
            <motion.button
              onClick={() => setIsPinned((p) => !p)}
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-black/10 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {isPinned ? (
                <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
              ) : (
                <IconLayoutSidebarLeftExpand className="h-5 w-5" />
              )}
            </motion.button>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            {links.map((link) => (
              <SidebarLink
                key={link.label}
                link={link}
                isActive={!!link.active}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <SidebarLink
            link={{
              label: "Logout",
              href: "#",
              icon: <IconArrowLeft className="h-5 w-5" />,
            }}
            isActive={false}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-6 w-6 rounded-full"
                  alt="Avatar"
                />
              ),
            }}
            isActive={false}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </SidebarBody>
    </SidebarPrimitive>
  );
}

const Logo = () => (
  <a href="#" className="flex items-center gap-2">
    <motion.div
      initial={{ rotate: -90, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "backInOut" }}
      className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"
    />
    <motion.span
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="whitespace-pre text-lg font-bold text-neutral-800 dark:text-white"
    >
      TheSocial
    </motion.span>
  </a>
);
