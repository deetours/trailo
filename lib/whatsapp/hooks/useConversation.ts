import { useState, useEffect } from "react";
import type { Conversation, Message } from "../types";
import { whatsappService } from "../mock/mock-adapter";

export function useConversation(id: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
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