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