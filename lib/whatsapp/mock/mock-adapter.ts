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