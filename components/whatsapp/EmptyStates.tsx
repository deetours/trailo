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