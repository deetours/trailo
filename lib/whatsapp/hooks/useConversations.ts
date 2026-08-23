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