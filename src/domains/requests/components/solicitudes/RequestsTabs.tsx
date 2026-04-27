import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export type TabKey = "enviadas" | "recibidas";

interface Props {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  availableTabs: TabKey[];
  sentCount: number;
  receivedCount: number;
}

export function RequestsTabs({
  activeTab,
  setActiveTab,
  availableTabs,
  sentCount,
  receivedCount,
}: Props) {
  if (availableTabs.length <= 1) return null;

  return (
    <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl w-fit border border-border">
      {availableTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
            activeTab === tab
              ? "bg-background shadow-md text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab === "enviadas" ? (
            <ArrowUpRight size={15} />
          ) : (
            <ArrowDownLeft size={15} />
          )}
          {tab === "enviadas" ? "Enviadas" : "Recibidas"}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
            activeTab === tab ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}>
            {tab === "enviadas" ? sentCount : receivedCount}
          </span>
        </button>
      ))}
    </div>
  );
}
