"use client";

import { cn } from "@/lib/utils";

interface TuringLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export default function TuringLogo({
  size = "md",
  className,
  showText = false,
}: TuringLogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
  };
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-10 h-10",
  };
  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          sizes[size],
          "rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 dark:shadow-orange-500/20 flex-shrink-0"
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizes[size]}
        >
          {/* Circuit-brain icon */}
          <path
            d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M12 12h8M12 16h8M12 20h5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="22" cy="12" r="1.5" fill="white" />
          <circle cx="22" cy="16" r="1.5" fill="white" />
          <circle cx="19" cy="20" r="1.5" fill="white" />
          <path
            d="M10 10v12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="9" r="1.5" fill="white" />
          <circle cx="10" cy="23" r="1.5" fill="white" />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            textSizes[size],
            "font-bold bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent"
          )}
        >
          TuringAI
        </span>
      )}
    </div>
  );
}
