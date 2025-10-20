"use client";

import { createContext, useContext } from "react";
type DashboardContextValue = {
  team: { id: string; name: string; slug: string; crestUrl: string | null };
  membership: { id: string; role: string; teamId: string; userId: string };
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  team,
  membership,
  children
}: {
  team: DashboardContextValue["team"];
  membership: DashboardContextValue["membership"];
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ team, membership }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard debe usarse dentro de DashboardProvider");
  }
  return ctx;
}