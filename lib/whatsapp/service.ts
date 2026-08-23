import type { Conversation, Message, MessageAttachment } from "./types";

export interface WhatsAppService {
  listConversations(filters?: { status?: string; unread?: boolean; assignedTo?: string }): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  listMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, draft: { text: string; attachment?: MessageAttachment }): Promise<Message>;
  retryMessage(messageId: string): Promise<Message>;
  subscribeToInbox(cb: (conversations: Conversation[]) => void): () => void;
  subscribeToConversation(id: string, cb: (messages: Message[], conversation: Conversation) => void): () => void;
}