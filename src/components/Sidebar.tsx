"use client";

import { useState, useEffect } from "react";
import { Conversation } from "@/types";
import { ThemeToggle } from "./ui/theme-toggle";
import TuringLogo from "./TuringLogo";
import Link from "next/link";
import {
  Plus,
  MessageSquare,
  X,
  ChevronLeft,
  Menu,
  LogIn,
  Settings,
  Type,
  Check,
  Shield,
  ShieldCheck,
  LogOut,
  Pencil,
} from "lucide-react";

const FONTS = [
  { id: "inter", name: "Inter", preview: "The quick brown fox" },
  { id: "dm-sans", name: "DM Sans", preview: "The quick brown fox" },
  { id: "plus-jakarta", name: "Plus Jakarta Sans", preview: "The quick brown fox" },
  { id: "space-grotesk", name: "Space Grotesk", preview: "The quick brown fox" },
];

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
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
  onRename,
  isOpen,
  onToggle,
  collapsed,
  onCollapse,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg transition-colors"
      >
        <Menu className="w-5 h-5 text-zinc-600 dark:text-gray-300" />
      </button>

      <button
        onClick={onCollapse}
        className="hidden md:flex fixed top-4 z-50 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out"
        style={{ left: collapsed ? "16px" : "284px" }}
        title={collapsed ? "Show sidebar" : "Hide sidebar"}
      >
        <ChevronLeft
          className={`w-4 h-4 text-zinc-500 dark:text-gray-400 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`
          hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${collapsed ? "w-0" : "w-72"}
        `}
      >
        <aside className="w-72 h-full flex flex-col bg-orange-50/40 dark:bg-zinc-950 border-r border-orange-200/60 dark:border-zinc-800 transition-colors duration-300">
          <SidebarContent
            conversations={conversations}
            activeId={activeId}
            onSelect={onSelect}
            onNew={onNew}
            onDelete={onDelete}
            onRename={onRename}
          />
        </aside>
      </div>

      <aside
        className={`
          fixed md:hidden inset-y-0 left-0 z-40
          w-72 flex flex-col
          bg-orange-50/40 dark:bg-zinc-950 border-r border-orange-200/60 dark:border-zinc-800
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
          onRename={onRename}
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
  onRename,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  return (
    <>
      {/* Logo header */}
      <div className="px-4 pt-4 pb-2">
        <TuringLogo size="sm" showText />
      </div>

      <div className="px-4 pb-3 flex items-center gap-3">
        <button
          onClick={onNew}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-400 dark:active:bg-orange-600 rounded-full text-white text-sm font-medium transition-colors shadow-lg shadow-orange-500/25"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
        <ThemeToggle />
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-white/30 px-2 mb-2">
          Conversations
        </p>
        {conversations.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-white/30 px-2 py-4">
            No conversations yet
          </p>
        )}
        <div className="space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                if (editingId !== conv.id) onSelect(conv.id);
              }}
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all
                ${
                  conv.id === activeId
                    ? "bg-white dark:bg-white/10 border border-orange-200/60 dark:border-orange-500/15 shadow-sm dark:shadow-none"
                    : "hover:bg-white/60 dark:hover:bg-white/5"
                }
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-orange-400/60 dark:text-orange-500/40" />
                {editingId === conv.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (editValue.trim()) onRename(conv.id, editValue.trim());
                        setEditingId(null);
                      }
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={() => {
                      if (editValue.trim()) onRename(conv.id, editValue.trim());
                      setEditingId(null);
                    }}
                    autoFocus
                    className="flex-1 min-w-0 text-sm bg-transparent text-zinc-800 dark:text-zinc-200 border-b border-orange-400 focus:outline-none py-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate text-sm text-zinc-700 dark:text-gray-300">
                    {conv.title}
                  </span>
                )}
              </div>
              {editingId !== conv.id && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(conv.id);
                      setEditValue(conv.title);
                    }}
                    className="p-1 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/20 text-zinc-400 dark:text-white/30 hover:text-orange-500 dark:hover:text-orange-400 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-zinc-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-orange-200/60 dark:border-zinc-800 space-y-1 transition-colors">
        <Link
          href="/login"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-500 dark:text-white/40 hover:bg-white/60 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-white/60 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Link>
        <SettingsButton />
      </div>
    </>
  );
}

function SettingsButton() {
  const [open, setOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState("inter");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminInput, setShowAdminInput] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ai-wrapper-font");
    if (saved) setCurrentFont(saved);
    // Check if admin cookie exists
    setIsAdmin(document.cookie.includes("turing-admin="));
  }, []);

  const changeFont = (fontId: string) => {
    setCurrentFont(fontId);
    localStorage.setItem("ai-wrapper-font", fontId);
    document.documentElement.setAttribute("data-font", fontId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-500 dark:text-white/40 hover:bg-white/60 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-white/60 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span className="text-xs">Settings</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl p-4 space-y-4 transition-colors max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700 dark:text-gray-200">Theme</span>
              <ThemeToggle />
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700 dark:text-gray-200">Font</span>
              </div>
              <div className="space-y-1.5">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => changeFont(font.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                      currentFont === font.id
                        ? "bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20"
                        : "hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          currentFont === font.id
                            ? "text-orange-700 dark:text-orange-300"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                        style={{ fontFamily: `var(--font-${font.id}), system-ui, sans-serif` }}
                      >
                        {font.name}
                      </p>
                      <p
                        className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5"
                        style={{ fontFamily: `var(--font-${font.id}), system-ui, sans-serif` }}
                      >
                        {font.preview}
                      </p>
                    </div>
                    {currentFont === font.id && (
                      <Check className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700" />

            {/* Admin section */}
            <div>
              {isAdmin ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Admin</span>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch("/api/admin", { method: "DELETE" });
                      setIsAdmin(false);
                    }}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              ) : showAdminInput ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-gray-200">Admin Login</span>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAdminError("");
                      try {
                        const res = await fetch("/api/admin", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ secret: adminInput }),
                        });
                        if (res.ok) {
                          setIsAdmin(true);
                          setAdminInput("");
                          setShowAdminInput(false);
                        } else {
                          setAdminError("Invalid secret");
                        }
                      } catch {
                        setAdminError("Failed to connect");
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="password"
                      value={adminInput}
                      onChange={(e) => setAdminInput(e.target.value)}
                      placeholder="Secret key"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs rounded-lg bg-orange-500 text-white hover:bg-orange-400 transition-colors"
                    >
                      Login
                    </button>
                  </form>
                  {adminError && (
                    <p className="text-xs text-red-500">{adminError}</p>
                  )}
                  <button
                    onClick={() => { setShowAdminInput(false); setAdminError(""); }}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminInput(true)}
                  className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Login
                </button>
              )}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-700" />
            <div className="text-xs text-zinc-400 dark:text-white/40">
              <p className="font-medium text-zinc-600 dark:text-gray-300">TuringAI v1.0</p>
              <p className="mt-1">Powered by Kimi K2.5 via NVIDIA NIM</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
