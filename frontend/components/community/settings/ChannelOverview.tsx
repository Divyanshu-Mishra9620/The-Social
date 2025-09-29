"use client";
import React, { useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";

export default function ChannelOverview({ channelId }: { channelId: string }) {
  const [channelName, setChannelName] = useState("general");
  const [channelTopic, setChannelTopic] = useState(
    "A place for general discussion."
  );

  const handleSaveChanges = () => {
    console.log("Saving changes:", { channelName, channelTopic });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Channel Overview</h1>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="channelName"
            className="block text-sm font-medium mb-2"
          >
            Channel Name
          </label>
          <input
            id="channelName"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="channelTopic"
            className="block text-sm font-medium mb-2"
          >
            Channel Topic
          </label>
          <textarea
            id="channelTopic"
            value={channelTopic}
            onChange={(e) => setChannelTopic(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-colors"
          >
            <IconDeviceFloppy size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
