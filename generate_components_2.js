/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const root = "e:\\Sunny React Projects\\girivah\\trailo";

const files = {
  "components/whatsapp/ConversationListItem.tsx": `
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Conversation } from "@/lib/whatsapp/types";
import { formatTime } from "@/lib/whatsapp/format";

export function ConversationListItem({ conversation, isActive }: { conversation: Conversation; isActive: boolean }) {
  return (
    <Link 
      href={\`/admin/whatsapp/\${conversation.id}\`}
      className={cn(
        "block p-4 border-b border-[#111] hover:bg-[#111] transition-colors relative",
        isActive && "bg-[#111]"
      )}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2A8AF6]" />}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-medium text-sm truncate pr-2">{conversation.contact.name}</h3>
        <span className="text-xs text-[#666] whitespace-nowrap">
          {formatTime(conversation.updatedAt)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#888] truncate pr-4">
          {conversation.lastMessage?.text || "No messages yet"}
        </p>
        {conversation.unreadCount > 0 && (
          <div className="bg-[#2A8AF6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
}
`,

  "components/whatsapp/ConversationList.tsx": `
import React from "react";
import type { Conversation } from "@/lib/whatsapp/types";
import { ConversationListItem } from "./ConversationListItem";
import { NoSearchResults } from "./EmptyStates";

export function ConversationList({ conversations, activeId }: { conversations: Conversation[]; activeId?: string }) {
  if (conversations.length === 0) {
    return <NoSearchResults />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conv => (
        <ConversationListItem key={conv.id} conversation={conv} isActive={conv.id === activeId} />
      ))}
    </div>
  );
}
`,

  "components/whatsapp/ConversationFilters.tsx": `
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
`,

  "components/whatsapp/ConversationSearch.tsx": `
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export function ConversationSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [val, setVal] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(val), 200);
    return () => clearTimeout(timer);
  }, [val, onSearch]);

  return (
    <div className="p-4 border-b border-[#222]">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
        <input 
          type="text" 
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="Search conversations..." 
          className="w-full bg-[#111] border border-[#222] rounded-lg pl-9 pr-9 py-2 text-sm focus:border-[#444] focus:outline-none transition-colors"
        />
        {val && (
          <button onClick={() => setVal("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#ccc]">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
`,

  "components/whatsapp/ConversationSidebar.tsx": `
import React, { useState, useMemo } from "react";
import { ConversationSearch } from "./ConversationSearch";
import { ConversationFilters } from "./ConversationFilters";
import { ConversationList } from "./ConversationList";
import { MessageListSkeleton } from "./EmptyStates";
import type { Conversation } from "@/lib/whatsapp/types";
import { cn } from "@/lib/cn";

interface SidebarProps {
  conversations: Conversation[];
  loading: boolean;
  activeId?: string;
}

export function ConversationSidebar({ conversations, loading, activeId }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return conversations.filter(c => {
      const matchesSearch = c.contact.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.contact.phoneE164.includes(search);
      const matchesFilter = filter === "All" ? true : 
                            filter === "Unread" ? c.unreadCount > 0 : 
                            filter === "Assigned to me" ? c.assignedTo === "me" : true;
      return matchesSearch && matchesFilter;
    });
  }, [conversations, search, filter]);

  return (
    <div className={cn("w-full md:w-80 flex-shrink-0 flex flex-col border-r border-[#222] bg-[#0A0A0A] h-full", activeId ? "hidden md:flex" : "flex")}>
      <div className="h-16 flex items-center px-4 border-b border-[#222] font-display text-lg font-bold">
        Inbox
      </div>
      <ConversationSearch onSearch={setSearch} />
      <ConversationFilters activeFilter={filter} onChange={setFilter} />
      {loading ? <MessageListSkeleton /> : <ConversationList conversations={filtered} activeId={activeId} />}
    </div>
  );
}
`,

  "components/whatsapp/WhatsAppWorkspace.tsx": `
import React from "react";
import { ConversationSidebar } from "./ConversationSidebar";
import { EmptyInbox } from "./EmptyStates";
import { useConversations } from "@/lib/whatsapp/hooks/useConversations";
import { cn } from "@/lib/cn";

export function WhatsAppWorkspace({ children, activeId }: { children?: React.ReactNode, activeId?: string }) {
  const { conversations, loading } = useConversations();

  return (
    <div className="flex h-full w-full bg-[#050505] overflow-hidden">
      <ConversationSidebar conversations={conversations} loading={loading} activeId={activeId} />
      <div className={cn("flex-1 flex flex-col", !activeId && "hidden md:flex")}>
        {children || <EmptyInbox />}
      </div>
    </div>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, relPath), content.trim());
}
console.log("Components Part 2 generated successfully.");
