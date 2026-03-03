"use client";

import type { UIMessage } from "ai";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

const GREETINGS = [
  "Hello! I'm TuringAI. How can I help you today?",
  "Hi there! Ready to assist you with anything.",
  "Welcome! Ask me anything — I'm here to help.",
  "Hey! What would you like to explore today?",
];

function getGreeting() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

export default function MessageList({
  messages,
  isLoading,
  greeting,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  greeting: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            {/* TuringAI Logo */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
              TuringAI
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 max-w-sm">
              Powered by Kimi K2.5 via NVIDIA NIM
            </p>

            {/* Greeting bubble */}
            <div className="flex items-start gap-3 max-w-md">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                T
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-3 text-left">
                <p className="text-[15px] text-zinc-700 dark:text-zinc-200">
                  {greeting}
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Thinking animation */}
        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
                T
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export { getGreeting };
