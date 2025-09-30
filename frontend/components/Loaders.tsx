"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconLoader2, IconHash } from "@tabler/icons-react";
import { useTheme } from "@/components/community/ThemeProvider";

const shimmer = {
  initial: { x: "-100%" },
  animate: { x: "200%" },
  transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
};

export const BrandedLoader = ({ size = 48 }: { size?: number }) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${colors.primary})`,
          }}
        />
        <div
          className="absolute inset-1 rounded-full"
          style={{
            backgroundColor: colors.background,
            width: size - 8,
            height: size - 8,
            top: 4,
            left: 4,
          }}
        />
        <IconLoader2
          size={size * 0.5}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: colors.primary }}
        />
      </div>
    </motion.div>
  );
};

export const MessageSkeleton = () => {
  const { colors } = useTheme();

  return (
    <div className="flex items-start gap-3 p-4">
      <div
        className="h-10 w-10 rounded-full overflow-hidden relative"
        style={{ backgroundColor: colors.skeletonBase }}
      >
        <motion.div
          {...(shimmer as any)}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.skeletonHighlight}, transparent)`,
          }}
        />
      </div>
      <div className="flex-1 space-y-2">
        <div
          className="h-4 w-24 rounded overflow-hidden relative"
          style={{ backgroundColor: colors.skeletonBase }}
        >
          <motion.div
            {...(shimmer as any)}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.skeletonHighlight}, transparent)`,
            }}
          />
        </div>
        <div
          className="h-16 w-3/4 rounded-xl overflow-hidden relative"
          style={{ backgroundColor: colors.skeletonBase }}
        >
          <motion.div
            {...(shimmer as any)}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.skeletonHighlight}, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const ChannelListSkeleton = () => {
  const { colors } = useTheme();
  return (
    <div className="space-y-4 p-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div
            className="h-4 w-20 rounded"
            style={{ backgroundColor: colors.skeletonBase }}
          />
          <div className="pl-2 space-y-1.5">
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-5 w-3/4 rounded"
                style={{ backgroundColor: colors.skeletonBase }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ServerListSkeleton = () => {
  const { colors } = useTheme();

  return (
    <div className="p-4 space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <div
            className="h-10 w-10 rounded-lg overflow-hidden relative"
            style={{ backgroundColor: colors.skeletonBase }}
          >
            <motion.div
              {...(shimmer as any)}
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.skeletonHighlight}, transparent)`,
              }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div
              className="h-4 w-2/3 rounded overflow-hidden relative"
              style={{ backgroundColor: colors.skeletonBase }}
            >
              <motion.div
                {...(shimmer as any)}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.skeletonHighlight}, transparent)`,
                }}
              />
            </div>
            <div
              className="h-3 w-1/3 rounded overflow-hidden relative"
              style={{ backgroundColor: colors.skeletonBase }}
            >
              <motion.div
                {...(shimmer as any)}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.skeletonHighlight}, transparent)`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CommunityViewSkeleton = () => {
  const { colors } = useTheme();
  const sidebarWidth = 240;

  return (
    <div className="flex h-full w-full">
      <div
        className="flex flex-col border-r border-white/10 z-20"
        style={{ width: `${sidebarWidth}px` }}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 p-4">
          <div
            className="h-6 w-3/4 rounded"
            style={{ backgroundColor: colors.skeletonBase }}
          />
        </header>
        <nav className="flex-1 overflow-y-auto p-2">
          <ChannelListSkeleton />
        </nav>
        <footer className="flex shrink-0 items-center gap-3 border-t border-white/10 p-3">
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: colors.skeletonBase }}
          />
          <div className="flex-1">
            <div
              className="h-4 w-1/2 rounded"
              style={{ backgroundColor: colors.skeletonBase }}
            />
          </div>
        </footer>
      </div>
      <div className="w-2 bg-transparent" />
      <div className="flex flex-1 flex-col min-h-0">
        <header className="flex h-14 shrink-0 items-center border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <IconHash size={20} className="text-neutral-600" />
            <div
              className="h-6 w-40 rounded"
              style={{ backgroundColor: colors.skeletonBase }}
            />
          </div>
        </header>
        <main className="flex-1 p-4 space-y-4 overflow-hidden">
          <MessageSkeleton />
          <MessageSkeleton />
          <MessageSkeleton />
        </main>
        <footer className="shrink-0 p-4">
          <div
            className="h-10 w-full rounded-lg"
            style={{ backgroundColor: colors.skeletonBase }}
          />
        </footer>
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  const { colors } = useTheme();
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: colors.background + "ee",
            backdropFilter: "blur(4px)",
          }}
        >
          <BrandedLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => {
  const { colors } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full mb-4"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        {icon}
      </div>
      <h3
        className="text-xl font-semibold mb-2"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h3>
      <p
        className="text-sm max-w-sm mb-6"
        style={{ color: colors.textTertiary }}
      >
        {description}
      </p>
      {action}
    </motion.div>
  );
};
