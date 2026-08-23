/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const root = "e:\\Sunny React Projects\\girivah\\trailo";

const files = {
  // === TYPES ===
  "lib/whatsapp/types.ts": `
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
`,

  // === FORMAT ===
  "lib/whatsapp/format.ts": `
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateSeparator(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
`,

  // === SERVICE ===
  "lib/whatsapp/service.ts": `
import type { Conversation, Message } from "./types";

export interface WhatsAppService {
  listConversations(filters?: { status?: string; unread?: boolean; assignedTo?: string }): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  listMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, draft: { text: string; attachment?: any }): Promise<Message>;
  retryMessage(messageId: string): Promise<Message>;
  subscribeToInbox(cb: (conversations: Conversation[]) => void): () => void;
  subscribeToConversation(id: string, cb: (messages: Message[], conversation: Conversation) => void): () => void;
}
`,

  // === MOCK DATA ===
  "lib/whatsapp/mock/mock-data.ts": `
import type { Conversation, Message } from "../types";

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    accountId: "a1",
    contact: { id: "cnt1", name: "Alex Johnson", phoneE164: "+1234567890" },
    unreadCount: 2,
    status: "open",
    labels: ["VIP"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    relatedContext: [{ type: "trip", id: "t1", label: "Spiti Valley Circuit", href: "/dashboard/trips/t1" }]
  },
  {
    id: "c2",
    accountId: "a1",
    contact: { id: "cnt2", name: "Maria Garcia", phoneE164: "+1987654321" },
    unreadCount: 0,
    status: "waiting",
    labels: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const mockMessages: Record<string, Message[]> = {
  "c1": [
    { id: "m1", conversationId: "c1", direction: "inbound", type: "text", text: "Hi, I have a question about the Spiti trip.", status: "read", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: "m2", conversationId: "c1", direction: "outbound", type: "text", text: "Hello Alex! How can we help?", status: "read", timestamp: new Date(Date.now() - 7000000).toISOString() },
    { id: "m3", conversationId: "c1", direction: "inbound", type: "text", text: "Do I need to carry extra fuel?", status: "delivered", timestamp: new Date(Date.now() - 600000).toISOString() },
    { id: "m4", conversationId: "c1", direction: "inbound", type: "text", text: "And what about permits?", status: "delivered", timestamp: new Date().toISOString() },
  ],
  "c2": [
    { id: "m5", conversationId: "c2", direction: "inbound", type: "text", text: "Can we book for 4 people?", status: "read", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: "m6", conversationId: "c2", direction: "outbound", type: "text", text: "Yes, we have availability. Let me send the link.", status: "read", timestamp: new Date(Date.now() - 86000000).toISOString() },
  ]
};

// Set last messages
mockConversations[0].lastMessage = mockMessages["c1"][mockMessages["c1"].length - 1];
mockConversations[1].lastMessage = mockMessages["c2"][mockMessages["c2"].length - 1];
`,

  // === MOCK ADAPTER ===
  "lib/whatsapp/mock/mock-adapter.ts": `
import type { WhatsAppService } from "../service";
import type { Conversation, Message } from "../types";
import { mockConversations, mockMessages } from "./mock-data";

class MockWhatsAppAdapter implements WhatsAppService {
  private conversations = [...mockConversations];
  private messages = { ...mockMessages };
  private inboxSubscribers = new Set<(c: Conversation[]) => void>();
  private convSubscribers = new Map<string, Set<(m: Message[], c: Conversation) => void>>();

  private notifyInbox() {
    this.inboxSubscribers.forEach(cb => cb([...this.conversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())));
  }

  private notifyConv(id: string) {
    const subs = this.convSubscribers.get(id);
    if (subs) {
      const conv = this.conversations.find(c => c.id === id);
      const msgs = this.messages[id] || [];
      if (conv) {
        subs.forEach(cb => cb([...msgs], { ...conv }));
      }
    }
  }

  async listConversations(filters?: { status?: string; unread?: boolean }): Promise<Conversation[]> {
    let result = this.conversations;
    if (filters?.status) result = result.filter(c => c.status === filters.status);
    if (filters?.unread) result = result.filter(c => c.unreadCount > 0);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.conversations.find(c => c.id === id) || null;
  }

  async listMessages(conversationId: string): Promise<Message[]> {
    return this.messages[conversationId] || [];
  }

  async sendMessage(conversationId: string, draft: { text: string }): Promise<Message> {
    const msg: Message = {
      id: "m" + Date.now(),
      conversationId,
      direction: "outbound",
      type: "text",
      text: draft.text,
      status: "pending",
      timestamp: new Date().toISOString()
    };
    
    if (!this.messages[conversationId]) this.messages[conversationId] = [];
    this.messages[conversationId].push(msg);
    
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = msg;
      conv.updatedAt = msg.timestamp;
    }
    
    this.notifyConv(conversationId);
    this.notifyInbox();

    // Simulate lifecycle
    setTimeout(() => {
      msg.status = Math.random() > 0.9 ? "failed" : "sent";
      this.notifyConv(conversationId);
      if (msg.status === "sent") {
        setTimeout(() => { msg.status = "delivered"; this.notifyConv(conversationId); }, 1000);
        setTimeout(() => { msg.status = "read"; this.notifyConv(conversationId); }, 2500);
      }
    }, 500);

    return msg;
  }

  async retryMessage(messageId: string): Promise<Message> {
    let foundMsg: Message | undefined;
    for (const convId in this.messages) {
      foundMsg = this.messages[convId].find(m => m.id === messageId);
      if (foundMsg) {
        foundMsg.status = "pending";
        this.notifyConv(convId);
        
        setTimeout(() => {
          if (foundMsg) {
            foundMsg.status = "sent";
            this.notifyConv(convId);
          }
        }, 500);
        break;
      }
    }
    if (!foundMsg) throw new Error("Message not found");
    return foundMsg;
  }

  subscribeToInbox(cb: (c: Conversation[]) => void): () => void {
    this.inboxSubscribers.add(cb);
    this.listConversations().then(cb);
    return () => this.inboxSubscribers.delete(cb);
  }

  subscribeToConversation(id: string, cb: (m: Message[], c: Conversation) => void): () => void {
    if (!this.convSubscribers.has(id)) this.convSubscribers.set(id, new Set());
    this.convSubscribers.get(id)!.add(cb);
    Promise.all([this.listMessages(id), this.getConversation(id)]).then(([m, c]) => {
      if (c) cb(m, c);
    });
    return () => {
      const subs = this.convSubscribers.get(id);
      if (subs) subs.delete(cb);
    };
  }
}

export const whatsappService = new MockWhatsAppAdapter();
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, relPath), content.trim());
}
console.log("Files generated successfully.");
