"use client";

import type { UIMessage } from "ai";
import { useState, useCallback } from "react";

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
      className="p-1 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover/code:opacity-100"
      title="Copy code"
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );
}

function renderContent(text: string) {
  // Split by code blocks (```lang\n...\n```)
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    const codeMatch = part.match(/^```(\w*)\n?([\s\S]*?)\n?```$/);
    if (codeMatch) {
      const lang = codeMatch[1] || "code";
      const code = codeMatch[2];
      return (
        <div key={i} className="group/code relative my-3 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 dark:bg-zinc-900 border-b border-zinc-700">
            <span className="text-xs text-zinc-400 font-mono">{lang}</span>
            <CopyButton text={code} />
          </div>
          <div className="bg-zinc-900 dark:bg-[#0d0d0d] p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-zinc-100 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      );
    }

    // Render inline code with backticks
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((inline, j) => {
          if (inline.startsWith("`") && inline.endsWith("`")) {
            return (
              <code
                key={j}
                className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-sm font-mono text-indigo-600 dark:text-indigo-400"
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
        className={`flex items-start gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
            ${
              isUser
                ? "bg-indigo-600 text-white"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
            }
          `}
        >
          {isUser ? "U" : "T"}
        </div>

        {/* Message content */}
        <div
          className={`
            rounded-2xl px-4 py-3 leading-relaxed
            ${
              isUser
                ? "bg-indigo-600 text-white rounded-tr-md"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-md"
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
