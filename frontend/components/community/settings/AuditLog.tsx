"use client";
import React from "react";

export default function AuditLog({ channelId }: { channelId: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
      <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-4">
        <p>A log of all changes made to the channel will be displayed here.</p>
      </div>
    </div>
  );
}
