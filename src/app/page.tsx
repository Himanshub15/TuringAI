"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import {
  getConversations,
  saveConversation,
  deleteConversation,
  generateId,
} from "@/lib/conversations";
import { Conversation } from "@/types";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const createNewChat = useCallback(() => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveConversation(conv);
    setConversations((prev) => [conv, ...prev]);
    setActiveId(id);
    setSidebarOpen(false);
    return id;
  }, []);

  useEffect(() => {
    setMounted(true);
    const collapsed = localStorage.getItem("ai-wrapper-sidebar-collapsed");
    if (collapsed === "true") setSidebarCollapsed(true);
    const convs = getConversations();
    if (convs.length > 0) {
      setConversations(convs);
      setActiveId(convs[0].id);
    } else {
      createNewChat();
    }
  }, [createNewChat]);

  const handleTitleUpdate = useCallback(
    (id: string, title: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title, updatedAt: Date.now() } : c
        )
      );
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        saveConversation({ ...conv, title, updatedAt: Date.now() });
      }
    },
    [conversations]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteConversation(id);
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (id === activeId) {
        if (updated.length > 0) {
          setActiveId(updated[0].id);
        } else {
          createNewChat();
        }
      }
    },
    [conversations, activeId, createNewChat]
  );

  const toggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("ai-wrapper-sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950 transition-colors">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-orange-50/30 dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNew={createNewChat}
        onDelete={handleDelete}
        onRename={handleTitleUpdate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        collapsed={sidebarCollapsed}
        onCollapse={toggleCollapse}
      />
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 transition-colors duration-300">
        {activeId && (
          <ChatInterface
            key={activeId}
            conversationId={activeId}
            onTitleUpdate={handleTitleUpdate}
          />
        )}
      </main>
    </div>
  );
}
