export type MessageDirection = "inbound" | "outbound";
export type MessageType = "text" | "image" | "document" | "video" | "audio" | "location" | "system";
export type MessageStatus = "pending" | "sent" | "delivered" | "read" | "failed";
export type ConversationStatus = "open" | "waiting" | "resolved" | "archived";

export interface WhatsAppAccount { id: string; businessId: string; phoneNumberId: string; displayName: string; }

export interface Contact { id: string; name: string; phoneE164: string; avatarUrl?: string; }

export interface RelatedContext {
  type: string;
  id: string;
  label: string;
  href: string;
  meta?: Record<string, string>;
}

export interface MessageAttachment { id: string; kind: "image"|"document"|"video"|"audio"; url: string; name?: string; mimeType?: string; sizeBytes?: number; }

export interface Message {
  id: string; conversationId: string; direction: MessageDirection; type: MessageType;
  text?: string; attachment?: MessageAttachment; status: MessageStatus;
  timestamp: string; replyTo?: string;
}

export interface Conversation {
  id: string; accountId: string; contact: Contact; lastMessage?: Message; unreadCount: number;
  status: ConversationStatus; assignedTo?: string; labels: string[];
  relatedContext?: RelatedContext[]; createdAt: string; updatedAt: string;
}