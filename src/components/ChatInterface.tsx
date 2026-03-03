"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import MessageList, { getGreeting } from "./MessageList";
import SearchToggle from "./SearchToggle";
import { getMessages, saveMessages } from "@/lib/conversations";

interface ChatInterfaceProps {
  conversationId: string;
  onTitleUpdate: (id: string, title: string) => void;
}

export default function ChatInterface({
  conversationId,
  onTitleUpdate,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const titleSet = useRef(false);

  // Stable greeting per conversation
  const greeting = useMemo(() => getGreeting(), []);

  const transport = useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, setMessages, sendMessage, status } = useChat({
    id: conversationId,
    transport,
  });

  // Load persisted messages on mount
  useEffect(() => {
    const saved = getMessages(conversationId) as UIMessage[];
    if (saved.length > 0) {
      setMessages(saved);
    }
    titleSet.current = false;
  }, [conversationId, setMessages]);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(conversationId, messages);
    }

    // Auto-title from first user message
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || status !== "ready") return;

      const userMessage = input.trim();
      setInput("");

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
    [input, status, searchEnabled, sendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const isActive = status === "streaming" || status === "submitted";

  return (
    <div className="flex-1 flex flex-col h-full">
      <MessageList
        messages={messages}
        isLoading={isActive || isSearching}
        greeting={greeting}
      />

      {/* Floating input area */}
      <div className="relative px-4 pb-6 pt-2 bg-gradient-to-t from-white via-white dark:from-zinc-950 dark:via-zinc-950 to-transparent">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-300/50 dark:shadow-black/40 border border-zinc-200/80 dark:border-zinc-700/60 focus-within:border-indigo-500/60 dark:focus-within:border-indigo-500/50 focus-within:shadow-xl focus-within:shadow-indigo-500/10 dark:focus-within:shadow-indigo-500/5 transition-all duration-200">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isSearching
                  ? "Searching the web..."
                  : "Message TuringAI..."
              }
              disabled={isSearching}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-[15px] text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-2">
                <SearchToggle
                  enabled={searchEnabled}
                  onToggle={() => setSearchEnabled(!searchEnabled)}
                />
                {isSearching && (
                  <span className="text-xs text-indigo-500 animate-pulse">
                    Searching...
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isActive || isSearching}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all duration-200 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 disabled:shadow-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
