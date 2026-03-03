"use client";

interface SearchToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SearchToggle({ enabled, onToggle }: SearchToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
        ${
          enabled
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
        }
      `}
      title={enabled ? "Web search enabled" : "Enable web search"}
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span>{enabled ? "Search ON" : "Search"}</span>
    </button>
  );
}
