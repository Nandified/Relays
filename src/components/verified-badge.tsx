"use client";

import * as React from "react";

export type VerifiedBadgeStatus = "not_verified" | "pending" | "verified";

interface VerifiedBadgeProps {
  status: VerifiedBadgeStatus;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show text label beside the icon */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
}

export function VerifiedBadge({
  status,
  size = "md",
  showLabel = false,
  className = "",
}: VerifiedBadgeProps) {
  if (status === "not_verified") return null;

  const sizes = {
    sm: { icon: 12, container: "h-5 px-1.5", text: "text-[10px]", iconOnly: "h-4 w-4" },
    md: { icon: 14, container: "h-6 px-2", text: "text-xs", iconOnly: "h-5 w-5" },
    lg: { icon: 18, container: "h-7 px-2.5", text: "text-sm", iconOnly: "h-6 w-6" },
  };

  const s = sizes[size];

  if (status === "verified") {
    return (
      <span
        className={`
          group relative inline-flex items-center gap-1 rounded-full
          ${showLabel ? `${s.container} bg-emerald-500/10 border border-emerald-500/20` : s.iconOnly}
          transition-all duration-300 hover:scale-105
          ${className}
        `}
        title="License verified"
      >
        {/* Glow effect on hover */}
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.3)]" />

        {/* Checkmark icon */}
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10 text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
        >
          <path
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {showLabel && (
          <span className={`relative z-10 ${s.text} font-medium text-emerald-400`}>
            Verified
          </span>
        )}

        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[11px] text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-[var(--shadow-elevated)]">
          License verified
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--bg-elevated)]" />
        </span>
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span
        className={`
          group relative inline-flex items-center gap-1 rounded-full
          ${showLabel ? `${s.container} bg-amber-500/10 border border-amber-500/20` : s.iconOnly}
          transition-all duration-300 hover:scale-105
          ${className}
        `}
        title="Verification in progress"
      >
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.2)]" />

        {/* Clock icon */}
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {showLabel && (
          <span className={`relative z-10 ${s.text} font-medium text-amber-400`}>
            Pending
          </span>
        )}

        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[11px] text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-[var(--shadow-elevated)]">
          Verification in progress
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--bg-elevated)]" />
        </span>
      </span>
    );
  }

  return null;
}
