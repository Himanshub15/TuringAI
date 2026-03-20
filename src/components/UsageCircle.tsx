"use client";

import { useState, useEffect, useCallback } from "react";

export default function UsageCircle() {
  const [usage, setUsage] = useState({ used: 0, max: 20, percentage: 0, isAdmin: false });
  const [hovering, setHovering] = useState(false);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      if (res.ok) setUsage(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, [fetchUsage]);

  const pct = usage.percentage;
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const filled = (pct / 100) * circumference;
  const strokeColor =
    usage.isAdmin
      ? "#22c55e"
      : pct < 50
      ? "#f97316"
      : pct < 80
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
        <svg width="30" height="30" viewBox="0 0 30 30">
          {/* Background circle */}
          <circle
            cx="15"
            cy="15"
            r={radius}
            fill="none"
            className="stroke-zinc-200 dark:stroke-zinc-700"
            strokeWidth="2.5"
          />
          {/* Usage arc */}
          <circle
            cx="15"
            cy="15"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            transform="rotate(-90 15 15)"
            className="transition-all duration-500"
          />
          {/* Center text */}
          <text
            x="15"
            y="15"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-zinc-600 dark:fill-zinc-300"
            fontSize="7"
            fontWeight="600"
          >
            {usage.isAdmin ? "~" : `${pct}%`}
          </text>
        </svg>
      </div>

      {/* Hover tooltip */}
      {hovering && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg text-xs whitespace-nowrap z-50">
          {usage.isAdmin ? (
            <span className="text-green-600 dark:text-green-400 font-medium">Admin — Unlimited</span>
          ) : (
            <div className="space-y-1">
              <p className="font-medium text-zinc-700 dark:text-zinc-200">
                {usage.used} / {usage.max} messages used
              </p>
              <div className="w-32 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: strokeColor }}
                />
              </div>
              <p className="text-zinc-400 dark:text-zinc-500">
                {usage.max - usage.used} remaining this hour
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
