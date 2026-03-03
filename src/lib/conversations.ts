import { Conversation } from "@/types";

const CONVERSATIONS_KEY = "ai-wrapper-conversations";
const MESSAGES_PREFIX = "ai-wrapper-messages-";

export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONVERSATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveConversation(conv: Conversation): void {
  const convs = getConversations();
  const idx = convs.findIndex((c) => c.id === conv.id);
  if (idx >= 0) {
    convs[idx] = conv;
  } else {
    convs.unshift(conv);
  }
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
}

export function deleteConversation(id: string): void {
  const convs = getConversations().filter((c) => c.id !== id);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs));
  localStorage.removeItem(MESSAGES_PREFIX + id);
}

export function getMessages(conversationId: string): unknown[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MESSAGES_PREFIX + conversationId);
  return raw ? JSON.parse(raw) : [];
}

export function saveMessages(
  conversationId: string,
  messages: unknown[]
): void {
  localStorage.setItem(
    MESSAGES_PREFIX + conversationId,
    JSON.stringify(messages)
  );
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
