"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "../ui/sidebar";
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
const SidebarLink = ({
  link,
  isActive,
  isSidebarOpen,
}: {
  link: LinkType;
  isActive: boolean;
  isSidebarOpen: boolean;
}) => {
  return (
    <a
      href={link.href}
      className={cn(
        "group relative flex items-center justify-start gap-2 rounded-lg py-2 px-3 transition-colors duration-200",
        isActive
          ? "bg-neutral-200/80 text-neutral-800 dark:bg-neutral-700/50 dark:text-neutral-50"
          : "text-neutral-600 hover:bg-neutral-200/80 dark:text-neutral-400 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-50"
      )}
    >
      {link.icon}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="whitespace-pre text-sm"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>

      {!isSidebarOpen && (
        <div className="absolute left-full ml-4 hidden scale-0 rounded-md bg-neutral-800 px-2 py-1 text-xs text-white transition-transform duration-150 ease-in-out group-hover:scale-100 dark:bg-neutral-700 md:block">
          {link.label}
        </div>
      )}
    </a>
  );
};

export function CommunitySidebar() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0" />,
      active: true,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0" />,
      active: false,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0" />,
      active: false,
    },
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isSidebarOpen = isPinned || isHovered;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const togglePin = () => setIsPinned((prev) => !prev);

  return (
    <Sidebar open={isSidebarOpen} setOpen={() => {}}>
      <SidebarBody
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group/sidebar relative justify-between gap-10 border-none"
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between pr-3 pt-1">
            <div className="mt-2">
              {isSidebarOpen ? <Logo /> : <LogoIcon />}
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                  onClick={togglePin}
                  className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/50"
                >
                  {isPinned ? (
                    <IconLayoutSidebarLeftCollapse className="h-5 w-5" />
                  ) : (
                    <IconLayoutSidebarLeftExpand className="h-5 w-5" />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <SidebarLink
                key={link.label}
                link={link}
                isActive={link.active}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <hr className="my-4 border-t border-neutral-200 dark:border-neutral-700" />
          <SidebarLink
            link={{
              label: "Logout",
              href: "#",
              icon: <IconArrowLeft className="h-5 w-5 shrink-0" />,
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
                  className="h-7 w-7 shrink-0 rounded-full"
                  alt="Avatar"
                />
              ),
            }}
            isActive={false}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

type LinkType = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative flex items-center space-x-2 py-1 pl-3 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 pl-3 text-sm font-normal text-black dark:text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
