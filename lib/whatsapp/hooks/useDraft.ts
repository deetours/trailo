import { useState, useEffect } from "react";

export function useDraft(conversationId: string) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!conversationId) return;
    const saved = localStorage.getItem(`wa_draft_${conversationId}`);
    const timeout = setTimeout(() => setDraft(saved ?? ""), 0);
    return () => clearTimeout(timeout);
  }, [conversationId]);

  const updateDraft = (val: string) => {
    setDraft(val);
    if (val) {
      localStorage.setItem(`wa_draft_${conversationId}`, val);
    } else {
      localStorage.removeItem(`wa_draft_${conversationId}`);
    }
  };

  const clearDraft = () => {
    setDraft("");
    localStorage.removeItem(`wa_draft_${conversationId}`);
  };

  return { draft, updateDraft, clearDraft };
}