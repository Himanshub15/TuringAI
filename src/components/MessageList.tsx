"use client";

import type { UIMessage } from "ai";
import MessageBubble from "./MessageBubble";
import TuringLogo from "./TuringLogo";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Code, Globe, Lightbulb } from "lucide-react";

const GREETINGS = [
  "Hello! I'm TuringAI. How can I help you today?",
  "Hi there! Ready to assist you with anything.",
  "Welcome! Ask me anything -- I'm here to help.",
  "Hey! What would you like to explore today?",
];

function getGreeting() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

const SUGGESTIONS = [
  { icon: Code, text: "Write a Python script", color: "text-orange-500 dark:text-orange-400" },
  { icon: Lightbulb, text: "Explain a concept", color: "text-amber-500 dark:text-amber-400" },
  { icon: Globe, text: "Search the web", color: "text-orange-600 dark:text-orange-300" },
  { icon: Sparkles, text: "Creative writing", color: "text-amber-600 dark:text-amber-300" },
];

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
    <div className="flex-1 overflow-y-auto px-4 py-6 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 md:pt-24 text-center">
            {/* Glowing logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-orange-500/20 dark:bg-orange-500/30 blur-xl glow-orb" />
              <div className="relative mb-6">
                <TuringLogo size="lg" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent mb-2"
            >
              TuringAI
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 max-w-sm"
            >
              Powered by Kimi K2.5 via NVIDIA NIM
            </motion.p>

            {/* Greeting bubble */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-start gap-3 max-w-md mb-10"
            >
              <div className="flex-shrink-0">
                <TuringLogo size="sm" />
              </div>
              <div className="bg-orange-50 dark:bg-zinc-900 border border-orange-200/60 dark:border-orange-500/15 rounded-2xl rounded-tl-md px-4 py-3 text-left shadow-sm">
                <p className="text-[15px] text-zinc-700 dark:text-zinc-200">
                  {greeting}
                </p>
              </div>
            </motion.div>

            {/* Suggestion chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-3 w-full max-w-md"
            >
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-orange-50/60 dark:bg-white/[0.03] border border-orange-200/50 dark:border-orange-500/10 hover:bg-orange-100/60 dark:hover:bg-orange-500/[0.06] hover:border-orange-300/60 dark:hover:border-orange-500/20 transition-all text-left group"
                >
                  <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0 group-hover:scale-110 transition-transform`} />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                    {s.text}
                  </span>
                </motion.button>
              ))}
            </motion.div>
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
              <div className="flex-shrink-0">
                <TuringLogo size="sm" />
              </div>
              <div className="bg-orange-50 dark:bg-zinc-900 border border-orange-200/60 dark:border-orange-500/15 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:300ms]" />
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
