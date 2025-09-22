"use client";
import React, { useState } from "react";
import { BorderBeam } from "../ui/border-beam";
import CommunityList from "./subComponents/CommunityList";
import CommunityDetail from "./subComponents/CommunityDetail";

type ChannelType = "text" | "voice" | "video";
type Channel = {
  name: string;
  type: ChannelType;
  active: boolean;
};
export type Community = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  channels: Channel[];
};

const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Design & Develop",
    description: "A hub for creatives to share, learn, and grow together.",
    memberCount: 138,
    channels: [
      { name: "general-chat", type: "text", active: false },
      { name: "design-critique", type: "text", active: false },
    ],
  },
  {
    id: "2",
    name: "Gaming Central",
    description: "Discuss the latest and greatest in the world of gaming.",
    memberCount: 842,
    channels: [
      { name: "news-and-updates", type: "text", active: false },
      { name: "squad-up-lobby", type: "voice", active: false },
    ],
  },
];

export default function SearchedCommunityList() {
  const [allCommunities] = useState<Community[]>(mockCommunities);

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    mockCommunities[0]
  );

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative flex h-[95%] w-[95%] overflow-hidden rounded-2xl border border-black/[0.1] dark:border-white/[0.1]">
        <div className="relative w-1/3 p-6 backdrop-blur-md dark:bg-neutral-900/60">
          <h1 className="mb-4 text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
            Communities
          </h1>
          <CommunityList
            communities={allCommunities}
            onSelectCommunity={setSelectedCommunity}
            selectedCommunityId={selectedCommunity?.id}
          />
        </div>

        <div className="relative h-full w-px bg-gradient-to-b from-transparent via-neutral-400 to-transparent dark:via-neutral-700">
          <BorderBeam size={150} duration={10} delay={0} />
        </div>

        <div className="relative w-2/3 backdrop-blur-md dark:bg-neutral-900/60 ">
          <CommunityDetail selectedCommunity={selectedCommunity} />
        </div>
      </div>
    </div>
  );
}
