"use client";

import { useState } from "react";
import { Conversation } from "@/types";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
  onCollapse: () => void;
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onToggle,
  collapsed,
  onCollapse,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 transition-colors"
      >
        <svg
          className="w-5 h-5 text-zinc-700 dark:text-zinc-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Desktop collapse/expand button */}
      <button
        onClick={onCollapse}
        className="hidden md:flex fixed top-4 z-50 p-2 rounded-xl bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-300 ease-in-out"
        style={{ left: collapsed ? "16px" : "284px" }}
        title={collapsed ? "Show sidebar" : "Hide sidebar"}
      >
        <svg
          className={`w-4 h-4 text-zinc-600 dark:text-zinc-300 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Sidebar — smooth width animation */}
      <div
        className={`
          hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${collapsed ? "w-0" : "w-72"}
        `}
      >
        <aside
          className={`
            w-72 h-full flex flex-col
            bg-zinc-50 dark:bg-zinc-900
            border-r border-zinc-200 dark:border-zinc-800
          `}
        >
          <SidebarContent
            conversations={conversations}
            activeId={activeId}
            onSelect={onSelect}
            onNew={onNew}
            onDelete={onDelete}
          />
        </aside>
      </div>

      {/* Mobile sidebar — slide overlay */}
      <aside
        className={`
          fixed md:hidden inset-y-0 left-0 z-40
          w-72 flex flex-col
          bg-zinc-50 dark:bg-zinc-900
          border-r border-zinc-200 dark:border-zinc-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onNew={onNew}
          onDelete={onDelete}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={onNew}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl text-white text-sm font-medium transition-colors shadow-md shadow-indigo-500/20"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Chat
        </button>
        <ThemeToggle />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 mb-2">
          Conversations
        </p>
        {conversations.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 px-2 py-4">
            No conversations yet
          </p>
        )}
        <div className="space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors
                ${
                  conv.id === activeId
                    ? "bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <svg
                  className="w-4 h-4 flex-shrink-0 text-zinc-400 dark:text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
                <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {conv.title}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-500 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <Link
          href="/login"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Sign In
        </Link>
        <SettingsButton />
      </div>
    </>
  );
}

function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-xs">Settings</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Theme</span>
              <ThemeToggle />
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-700" />
            <div className="text-xs text-zinc-400 dark:text-zinc-500">
              <p className="font-medium text-zinc-600 dark:text-zinc-300">TuringAI v1.0</p>
              <p className="mt-1">Powered by Kimi K2.5 via NVIDIA NIM</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
