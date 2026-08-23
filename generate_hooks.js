/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const root = "e:\\Sunny React Projects\\girivah\\trailo";

const files = {
  // === useConversations ===
  "lib/whatsapp/hooks/useConversations.ts": `
import { useState, useEffect } from "react";
import type { Conversation } from "../types";
import { whatsappService } from "../mock/mock-adapter";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = whatsappService.subscribeToInbox((data) => {
      setConversations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { conversations, loading };
}
`,

  // === useConversation ===
  "lib/whatsapp/hooks/useConversation.ts": `
import { useState, useEffect } from "react";
import type { Conversation, Message } from "../types";
import { whatsappService } from "../mock/mock-adapter";

export function useConversation(id: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsubscribe = whatsappService.subscribeToConversation(id, (msgs, conv) => {
      setMessages(msgs);
      setConversation(conv);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const sendMessage = async (text: string) => {
    await whatsappService.sendMessage(id, { text });
  };

  const retryMessage = async (messageId: string) => {
    await whatsappService.retryMessage(messageId);
  };

  return { conversation, messages, loading, sendMessage, retryMessage };
}
`,

  // === useDraft ===
  "lib/whatsapp/hooks/useDraft.ts": `
import { useState, useEffect } from "react";

export function useDraft(conversationId: string) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!conversationId) return;
    const saved = localStorage.getItem(\`wa_draft_\${conversationId}\`);
    if (saved) setDraft(saved);
    else setDraft("");
  }, [conversationId]);

  const updateDraft = (val: string) => {
    setDraft(val);
    if (val) {
      localStorage.setItem(\`wa_draft_\${conversationId}\`, val);
    } else {
      localStorage.removeItem(\`wa_draft_\${conversationId}\`);
    }
  };

  const clearDraft = () => {
    setDraft("");
    localStorage.removeItem(\`wa_draft_\${conversationId}\`);
  };

  return { draft, updateDraft, clearDraft };
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, relPath), content.trim());
}
console.log("Hooks generated successfully.");
