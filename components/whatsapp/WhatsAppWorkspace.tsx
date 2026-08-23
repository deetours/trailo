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