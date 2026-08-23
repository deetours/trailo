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