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