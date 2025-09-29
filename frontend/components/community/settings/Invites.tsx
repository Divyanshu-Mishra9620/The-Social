"use client";
import React from "react";
import { IconLink } from "@tabler/icons-react";

export default function Invites({ channelId }: { channelId: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invites</h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Active Invites</h2>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors">
            <IconLink size={18} />
            Create Invite
          </button>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-4">
          <p>Active invites will be listed here.</p>
        </div>
      </div>
    </div>
  );
}
