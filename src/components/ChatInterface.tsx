"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import MessageList, { getGreeting } from "./MessageList";
import { PromptInputBox } from "./ui/ai-prompt-box";
import UsageCircle from "./UsageCircle";
import { getMessages, saveMessages } from "@/lib/conversations";

interface ChatInterfaceProps {
  conversationId: string;
  onTitleUpdate: (id: string, title: string) => void;
}

export default function ChatInterface({
  conversationId,
  onTitleUpdate,
}: ChatInterfaceProps) {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  const titleSet = useRef(false);

  const greeting = useMemo(() => getGreeting(), []);

  const transport = useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, setMessages, sendMessage, status, error } = useChat({
    id: conversationId,
    transport,
  });

  useEffect(() => {
    const saved = getMessages(conversationId) as UIMessage[];
    if (saved.length > 0) {
      setMessages(saved);
    }
    titleSet.current = false;
    titlePhase.current = 0;
  }, [conversationId, setMessages]);

  const titlePhase = useRef(0); // 0=none, 1=quick title, 2=ai title

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(conversationId, messages);
    }

    const userMessages = messages.filter((m) => m.role === "user");
    const userCount = userMessages.length;

    // Phase 1: quick title from first user message (instant)
    if (titlePhase.current === 0 && userCount >= 1) {
      const text =
        userMessages[0].parts
          ?.filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("") || "";
      if (text) {
        const title = text.slice(0, 50) + (text.length > 50 ? "..." : "");
        onTitleUpdate(conversationId, title);
        titlePhase.current = 1;
      }
    }

    // Phase 2: AI-generated title after we have both user + assistant messages
    const hasAssistantReply = messages.some((m) => m.role === "assistant");
    if (titlePhase.current === 1 && userCount >= 1 && hasAssistantReply) {
      titlePhase.current = 2; // prevent re-trigger
      fetch("/api/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.title) {
            onTitleUpdate(conversationId, data.title);
          }
        })
        .catch(() => {}); // keep the quick title on failure
    }
  }, [messages, conversationId, onTitleUpdate]);

  // Detect rate limit errors
  useEffect(() => {
    if (error) {
      const msg = error.message || "";
      if (msg.includes("429") || msg.toLowerCase().includes("rate limit")) {
        setRateLimitMsg(
          "You've reached the message limit. Please try again in a bit."
        );
        setTimeout(() => setRateLimitMsg(null), 10000);
      }
    }
  }, [error]);

  const handleSend = useCallback(
    async (message: string) => {
      if (!message.trim() || status !== "ready") return;

      setRateLimitMsg(null);
      const userMessage = message.trim();
      let searchContext: string | undefined;

      if (searchEnabled) {
        setIsSearching(true);
        try {
          const res = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userMessage }),
          });
          const data = await res.json();
          if (data.results) {
            searchContext = data.results;
          }
        } catch {
          // Continue without search
        }
        setIsSearching(false);
      }

      sendMessage(
        { text: userMessage },
        searchContext ? { body: { searchResults: searchContext } } : undefined
      );
    },
    [status, searchEnabled, sendMessage]
  );

  const isActive = status === "streaming" || status === "submitted";

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <MessageList
        messages={messages}
        isLoading={isActive || isSearching}
        greeting={greeting}
      />

      <div className="relative px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 dark:from-zinc-950 dark:via-zinc-950/95 to-transparent transition-colors">
        <div className="max-w-3xl mx-auto">
          {rateLimitMsg && (
            <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
              {rateLimitMsg}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <PromptInputBox
                onSend={(msg) => handleSend(msg)}
                isLoading={isActive || isSearching}
                placeholder={
                  isSearching ? "Searching the web..." : "Message TuringAI..."
                }
                searchEnabled={searchEnabled}
                onSearchToggle={setSearchEnabled}
              />
            </div>
            <div className="pb-1">
              <UsageCircle key={messages.length} />
            </div>
          </div>
          {isSearching && (
            <p className="text-center text-xs text-orange-500 animate-pulse mt-2">
              Searching the web...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
