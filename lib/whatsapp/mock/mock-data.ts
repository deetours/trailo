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