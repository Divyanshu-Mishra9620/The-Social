"use client";
import React, { useState } from "react";
import {
  IconX,
  IconEye,
  IconLock,
  IconLink,
  IconWebhook,
  IconArchive,
  IconTrash,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Channel } from "@/types/server";

import ChannelOverview from "../../settings/ChannelOverview";
import Permissions from "../../settings/Permissions";
import Invites from "../../settings/Invites";
import Integrations from "../../settings/Integrations";
import AuditLog from "../../settings/AuditLog";
import DeleteChannel from "../../settings/DeleteChannel";

interface ChannelSettingsModalProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab =
  | "Overview"
  | "Permissions"
  | "Invites"
  | "Integrations"
  | "Audit Log"
  | "Delete Channel";

export const ChannelSettingsModal = ({
  channel,
  isOpen,
  onClose,
}: ChannelSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Overview");

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("Overview");
    }
  }, [isOpen, channel]);

  const tabs: { name: SettingsTab; icon: React.ReactNode }[] = [
    { name: "Overview", icon: <IconEye size={18} /> },
    { name: "Permissions", icon: <IconLock size={18} /> },
    { name: "Invites", icon: <IconLink size={18} /> },
    { name: "Integrations", icon: <IconWebhook size={18} /> },
    { name: "Audit Log", icon: <IconArchive size={18} /> },
  ];

  const deleteTab = {
    name: "Delete Channel" as SettingsTab,
    icon: <IconTrash size={18} />,
  };

  const renderContent = () => {
    if (!channel) return null;

    switch (activeTab) {
      case "Overview":
        return <ChannelOverview channelId={channel._id} />;
      case "Permissions":
        return <Permissions channelId={channel._id} />;
      case "Invites":
        return <Invites channelId={channel._id} />;
      case "Integrations":
        return <Integrations channelId={channel._id} />;
      case "Audit Log":
        return <AuditLog channelId={channel._id} />;
      case "Delete Channel":
        return <DeleteChannel channelId={channel._id} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && channel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="relative bg-[#2f3136] w-full max-w-4xl h-[clamp(480px,80vh,600px)] rounded-lg shadow-xl flex overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-60 bg-[#292b2f] p-4 flex flex-col">
              <div className="mb-6 px-2">
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                  {channel.type} Channel
                </p>
                <h2 className="text-white font-semibold truncate">
                  # {channel.name}
                </h2>
              </div>
              <nav className="flex-1 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.name
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
                <div className="border-t border-white/10 my-2"></div>
                <button
                  key={deleteTab.name}
                  onClick={() => setActiveTab(deleteTab.name)}
                  className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === deleteTab.name
                      ? "bg-red-600/50 text-red-400"
                      : "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  }`}
                >
                  {deleteTab.icon}
                  <span>{deleteTab.name}</span>
                </button>
              </nav>
            </div>

            <div className="flex-1 bg-[#36393f] text-gray-200">
              <div className="p-8 h-full overflow-y-auto">
                {renderContent()}
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <IconX size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
