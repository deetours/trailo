"use client";

import React, { use } from "react";
import { WhatsAppWorkspace } from "@/components/whatsapp/WhatsAppWorkspace";
import { useConversation } from "@/lib/whatsapp/hooks/useConversation";
import { ConversationHeader } from "@/components/whatsapp/ConversationHeader";
import { MessageTimeline } from "@/components/whatsapp/MessageTimeline";
import { MessageComposer } from "@/components/whatsapp/MessageComposer";
import { CustomerContextPanel } from "@/components/whatsapp/CustomerContextPanel";

function ActiveConversationView({ id }: { id: string }) {
  const { conversation, messages, loading, sendMessage, retryMessage } = useConversation(id);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#888]">
        Loading...
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#888]">
        Conversation not found
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <ConversationHeader conversation={conversation} />
        <MessageTimeline messages={messages} onRetry={retryMessage} />
        <MessageComposer conversationId={id} onSend={sendMessage} />
      </div>
      <CustomerContextPanel context={conversation.relatedContext} />
    </div>
  );
}

export default function WhatsAppConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  // Using React.use to unwrap params correctly for Next.js 15+
  const resolvedParams = use(params);

  return (
    <WhatsAppWorkspace activeId={resolvedParams.conversationId}>
      <ActiveConversationView id={resolvedParams.conversationId} />
    </WhatsAppWorkspace>
  );
}
