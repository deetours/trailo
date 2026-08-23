import React, { useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { useDraft } from "@/lib/whatsapp/hooks/useDraft";

export function MessageComposer({ conversationId, onSend }: { conversationId: string, onSend: (text: string) => void }) {
  const { draft, updateDraft, clearDraft } = useDraft(conversationId);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
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