"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ai-wrapper-theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ai-wrapper-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ai-wrapper-theme", "light");
    }
  };

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark
          ? "bg-zinc-900 border border-orange-500/30"
          : "bg-orange-50 border border-orange-200",
        className
      )}
      onClick={toggle}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark
              ? "transform translate-x-0 bg-orange-500"
              : "transform translate-x-8 bg-orange-400"
          )}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-orange-300/50" strokeWidth={1.5} />
          ) : (
            <Moon className="w-3.5 h-3.5 text-orange-300" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
