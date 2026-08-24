import React from "react";
import { ArrowLeft, MoreVertical, Phone } from "lucide-react";
import Link from "next/link";
import type { Conversation } from "@/lib/whatsapp/types";

export function ConversationHeader({ conversation }: { conversation: Conversation }) {
  return (
    <div className="h-16 border-b border-[#222] bg-[#0A0A0A] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/whatsapp" className="md:hidden p-2 -ml-2 text-[#888] hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-sm font-medium">
          {conversation.contact.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-medium text-sm">{conversation.contact.name}</h2>
          <p className="text-xs text-[#888]">{conversation.contact.phoneE164}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#888]">
        <button className="p-2 hover:text-white transition-colors"><Phone size={18} /></button>
        <button className="p-2 hover:text-white transition-colors"><MoreVertical size={18} /></button>
      </div>
    </div>
  );
}