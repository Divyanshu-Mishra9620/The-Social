"use client";
import React from "react";
import { IconTrash } from "@tabler/icons-react";

export default function DeleteChannel({ channelId }: { channelId: string }) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this channel?")) {
      console.log("Deleting channel:", channelId);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500 mb-6">Delete Channel</h1>
      <p className="mb-4">
        Once you delete a channel, there is no going back. Please be certain.
      </p>
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition-colors"
      >
        <IconTrash size={18} />
        Delete Channel
      </button>
    </div>
  );
}
