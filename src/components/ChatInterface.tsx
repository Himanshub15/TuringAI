"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import MessageList, { getGreeting } from "./MessageList";
import { PromptInputBox } from "./ui/ai-prompt-box";
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
  const titleSet = useRef(false);

  const greeting = useMemo(() => getGreeting(), []);

  const transport = useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, setMessages, sendMessage, status } = useChat({
    id: conversationId,
    transport,
  });

  useEffect(() => {
    const saved = getMessages(conversationId) as UIMessage[];
    if (saved.length > 0) {
      setMessages(saved);
    }
    titleSet.current = false;
  }, [conversationId, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(conversationId, messages);
    }

    if (!titleSet.current && messages.length >= 1) {
      const firstUser = messages.find((m) => m.role === "user");
      if (firstUser) {
        const text =
          firstUser.parts
            ?.filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("") || "";
        if (text) {
          const title = text.slice(0, 50) + (text.length > 50 ? "..." : "");
          onTitleUpdate(conversationId, title);
          titleSet.current = true;
        }
      }
    }
  }, [messages, conversationId, onTitleUpdate]);

  const handleSend = useCallback(
    async (message: string) => {
      if (!message.trim() || status !== "ready") return;

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
      {/* Subtle aurora background */}
      <div className="absolute inset-0 aurora-bg pointer-events-none" />

      <MessageList
        messages={messages}
        isLoading={isActive || isSearching}
        greeting={greeting}
      />

      <div className="relative px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 dark:from-zinc-950 dark:via-zinc-950/95 to-transparent transition-colors">
        <div className="max-w-3xl mx-auto">
          <PromptInputBox
            onSend={(msg) => handleSend(msg)}
            isLoading={isActive || isSearching}
            placeholder={
              isSearching ? "Searching the web..." : "Message TuringAI..."
            }
            searchEnabled={searchEnabled}
            onSearchToggle={setSearchEnabled}
          />
          {isSearching && (
            <p className="text-center text-xs text-cyan-500 animate-pulse mt-2">
              Searching the web...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
