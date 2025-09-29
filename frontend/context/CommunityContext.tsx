"use client";

import { Server } from "@/types/server";
import { createContext, useContext, ReactNode } from "react";

interface CommunityContextType {
  server: Server | null;
  isLoading: boolean;
}

const CommunityContext = createContext<CommunityContextType | undefined>(
  undefined
);

export const CommunityProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: CommunityContextType;
}) => {
  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
