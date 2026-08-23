import React from "react";
import { cn } from "@/lib/cn";

const FILTERS = ["All", "Unread", "Assigned to me"];

export function ConversationFilters({ activeFilter, onChange }: { activeFilter: string; onChange: (f: string) => void }) {
  return (
    <div className="flex items-center px-4 border-b border-[#222] overflow-x-auto no-scrollbar">
      {FILTERS.map(filter => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "px-4 py-3 text-sm whitespace-nowrap relative text-[#888] transition-colors hover:text-[#ccc]",
            activeFilter === filter && "text-white font-medium"
          )}
        >
          {filter}
          {activeFilter === filter && (
            <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2A8AF6]" />
          )}
        </button>
      ))}
    </div>
  );
}