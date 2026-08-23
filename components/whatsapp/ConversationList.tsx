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