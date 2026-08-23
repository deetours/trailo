/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const root = "e:\\Sunny React Projects\\girivah\\trailo";

const files = {
  "components/whatsapp/EmptyStates.tsx": `
import React from "react";
import { MessageSquare, Search, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyInbox() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#888] space-y-4">
      <MessageSquare size={48} className="opacity-20" />
      <p className="text-sm">No conversations selected</p>
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-[#888] space-y-4">
      <Search size={32} className="opacity-20" />
      <p className="text-sm">No conversations found</p>
    </div>
  );
}

export function FailedMessageState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center gap-2 text-xs text-red-500 mt-1">
      <AlertCircle size={12} />
      <span>Failed to send</span>
      <button onClick={onRetry} className="underline hover:text-red-400">Retry</button>
    </div>
  );
}

export function NoLinkedTrip() {
  return (
    <div className="text-sm text-[#888] p-4 border border-[#222] rounded-lg bg-[#0A0A0A]">
      No trip linked to this conversation.
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
          <div className="h-10 w-48 bg-[#222] rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}
`,

  "components/whatsapp/CustomerContextPanel.tsx": `
import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { RelatedContext } from "@/lib/whatsapp/types";
import { NoLinkedTrip } from "./EmptyStates";

export function CustomerContextPanel({ context }: { context?: RelatedContext[] }) {
  if (!context || context.length === 0) {
    return (
      <div className="w-80 border-l border-[#222] bg-[#0A0A0A] p-6 hidden lg:block">
        <h3 className="font-display text-lg mb-4">Context</h3>
        <NoLinkedTrip />
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-[#222] bg-[#0A0A0A] p-6 hidden lg:block">
      <h3 className="font-display text-lg mb-4">Context</h3>
      <div className="space-y-4">
        {context.map((ctx) => (
          <div key={ctx.id} className="border border-[#222] bg-[#111] rounded-lg p-4">
            <div className="text-xs text-[#888] uppercase tracking-wider mb-1">{ctx.type}</div>
            <div className="font-medium text-sm mb-3">{ctx.label}</div>
            {ctx.meta && (
              <div className="space-y-1 mb-3 text-xs text-[#ccc]">
                {Object.entries(ctx.meta).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[#888] capitalize">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <Link href={ctx.href} className="text-[#2A8AF6] text-xs flex items-center gap-1 hover:underline">
              View details <ExternalLink size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
`,

  "components/whatsapp/MessageComposer.tsx": `
import React, { useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { useDraft } from "@/lib/whatsapp/hooks/useDraft";

export function MessageComposer({ conversationId, onSend }: { conversationId: string, onSend: (text: string) => void }) {
  const { draft, updateDraft, clearDraft } = useDraft(conversationId);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = \`\${Math.min(inputRef.current.scrollHeight, 120)}px\`;
    }
  }, [draft]);

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    clearDraft();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-[#222] bg-[#0A0A0A]">
      <div className="flex items-end gap-2 bg-[#111] border border-[#222] rounded-xl p-2 focus-within:border-[#444] transition-colors">
        <button className="p-2 text-[#888] hover:text-white transition-colors rounded-lg">
          <Paperclip size={20} />
        </button>
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => updateDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none outline-none resize-none py-2 text-sm max-h-[120px]"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim()}
          className="p-2 bg-[#2A8AF6] text-white rounded-lg disabled:opacity-50 disabled:bg-[#222] transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
`,

  "components/whatsapp/DateSeparator.tsx": `
import React from "react";
import { formatDateSeparator } from "@/lib/whatsapp/format";

export function DateSeparator({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex justify-center my-6">
      <div className="bg-[#111] border border-[#222] px-3 py-1 rounded-full text-xs text-[#888]">
        {formatDateSeparator(timestamp)}
      </div>
    </div>
  );
}
`,

  "components/whatsapp/MessageBubble.tsx": `
import React from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Message } from "@/lib/whatsapp/types";
import { formatTime } from "@/lib/whatsapp/format";
import { FailedMessageState } from "./EmptyStates";

export function MessageBubble({ message, onRetry }: { message: Message, onRetry: () => void }) {
  const isInbound = message.direction === "inbound";

  return (
    <div className={cn("flex w-full mb-4", isInbound ? "justify-start" : "justify-end")}>
      <div className={cn("max-w-[80%] md:max-w-[70%] flex flex-col", isInbound ? "items-start" : "items-end")}>
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words",
            isInbound ? "bg-[#111] border border-[#222] rounded-tl-sm text-[#EDEDED]" : "bg-[#2A8AF6] rounded-tr-sm text-white"
          )}
        >
          {message.text}
        </div>
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-[10px] text-[#666]">{formatTime(message.timestamp)}</span>
          {!isInbound && (
            <span className="text-[#666]">
              {message.status === "pending" && <Clock size={10} />}
              {message.status === "sent" && <Check size={12} />}
              {(message.status === "delivered" || message.status === "read") && (
                <CheckCheck size={12} className={cn(message.status === "read" && "text-[#2A8AF6]")} />
              )}
            </span>
          )}
        </div>
        {!isInbound && message.status === "failed" && <FailedMessageState onRetry={onRetry} />}
      </div>
    </div>
  );
}
`,

  "components/whatsapp/MessageTimeline.tsx": `
import React, { useEffect, useRef } from "react";
import type { Message } from "@/lib/whatsapp/types";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";

export function MessageTimeline({ messages, onRetry }: { messages: Message[], onRetry: (id: string) => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#050505]">
      {messages.map((msg, i) => {
        const prevMsg = messages[i - 1];
        const showDate = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
        
        return (
          <React.Fragment key={msg.id}>
            {showDate && <DateSeparator timestamp={msg.timestamp} />}
            <MessageBubble message={msg} onRetry={() => onRetry(msg.id)} />
          </React.Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
`,

  "components/whatsapp/ConversationHeader.tsx": `
import React from "react";
import { ArrowLeft, MoreVertical, Phone } from "lucide-react";
import Link from "next/link";
import type { Conversation } from "@/lib/whatsapp/types";

export function ConversationHeader({ conversation }: { conversation: Conversation }) {
  return (
    <div className="h-16 border-b border-[#222] bg-[#0A0A0A] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Link href="/admin/whatsapp" className="md:hidden p-2 -ml-2 text-[#888] hover:text-white">
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
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, relPath), content.trim());
}
console.log("Components Part 1 generated successfully.");
