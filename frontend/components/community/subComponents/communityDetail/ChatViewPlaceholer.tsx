"use client";
import React from "react";
import { IconHash } from "@tabler/icons-react";
export const ChatViewPlaceholder = ({
  channelName,
}: {
  channelName: string;
}) => (
  <div className="flex h-full flex-col p-6">
    <div className="flex-1 flex items-start justify-center text-center">
      <div>
        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
          <IconHash size={40} className="text-neutral-500" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Welcome to #{channelName}!
        </h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          This is the beginning of this channel.
        </p>
      </div>
    </div>
  </div>
);
