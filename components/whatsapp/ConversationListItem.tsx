import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Conversation } from "@/lib/whatsapp/types";
import { formatTime } from "@/lib/whatsapp/format";

export function ConversationListItem({ conversation, isActive }: { conversation: Conversation; isActive: boolean }) {
  return (
    <Link 
      href={`/dashboard/whatsapp/${conversation.id}`}
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