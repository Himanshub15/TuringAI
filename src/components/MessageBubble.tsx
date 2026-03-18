"use client";

import type { UIMessage } from "ai";
import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import TuringLogo from "./TuringLogo";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-md bg-zinc-200 dark:bg-white/5 hover:bg-zinc-300 dark:hover:bg-white/10 text-zinc-500 dark:text-white/40 hover:text-zinc-700 dark:hover:text-white transition-colors opacity-0 group-hover/code:opacity-100"
      title="Copy code"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

function renderContent(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    const codeMatch = part.match(/^```(\w*)\n?([\s\S]*?)\n?```$/);
    if (codeMatch) {
      const lang = codeMatch[1] || "code";
      const code = codeMatch[2];
      return (
        <div
          key={i}
          className="group/code relative my-3 rounded-xl overflow-hidden border border-orange-200/40 dark:border-orange-500/10"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-orange-50/50 dark:bg-zinc-900/80 border-b border-orange-200/40 dark:border-orange-500/10">
            <span className="text-xs text-zinc-500 dark:text-white/40 font-mono">
              {lang}
            </span>
            <CopyButton text={code} />
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-zinc-800 dark:text-gray-200 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      );
    }

    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((inline, j) => {
          if (inline.startsWith("`") && inline.endsWith("`")) {
            return (
              <code
                key={j}
                className="px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-500/10 text-sm font-mono text-orange-700 dark:text-amber-300"
              >
                {inline.slice(1, -1)}
              </code>
            );
          }
          return inline;
        })}
      </span>
    );
  });
}

export default function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  const textContent =
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") || "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        {isUser ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-md bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-white dark:to-zinc-200 text-white dark:text-black">
            U
          </div>
        ) : (
          <div className="flex-shrink-0">
            <TuringLogo size="sm" />
          </div>
        )}

        {/* Message content */}
        <div
          className={`
            rounded-2xl px-4 py-3 leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-orange-500 dark:bg-orange-500 text-white rounded-tr-md"
                : "bg-orange-50 dark:bg-zinc-900 border border-orange-200/60 dark:border-orange-500/10 text-zinc-800 dark:text-zinc-200 rounded-tl-md"
            }
          `}
        >
          <div className="whitespace-pre-wrap break-words text-[15px]">
            {isUser ? textContent : renderContent(textContent)}
          </div>
        </div>
      </div>
    </div>
  );
}
