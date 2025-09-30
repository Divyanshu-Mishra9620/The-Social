"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Channel } from "@/types/server";
import { ChannelSettingsModal } from "@/components/community/subComponents/communityDetail/ChannelSettingsModel";

interface SettingsModalContextType {
  openChannelSettings: (channel: Channel) => void;
  closeChannelSettings: () => void;
}

const SettingsModalContext = createContext<
  SettingsModalContextType | undefined
>(undefined);

export const useSettingsModal = () => {
  const context = useContext(SettingsModalContext);
  if (!context) {
    throw new Error(
      "useSettingsModal must be used within a SettingsModalProvider"
    );
  }
  return context;
};

export const SettingsModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const openChannelSettings = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsOpen(true);
  };

  const closeChannelSettings = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedChannel(null), 300);
  };

  const value = { openChannelSettings, closeChannelSettings };

  return (
    <SettingsModalContext.Provider value={value}>
      {children}
      <ChannelSettingsModal
        isOpen={isOpen}
        onClose={closeChannelSettings}
        channel={selectedChannel}
      />
    </SettingsModalContext.Provider>
  );
};
