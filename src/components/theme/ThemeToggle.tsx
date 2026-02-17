"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    // Simple toggle: if currently dark → light, if light → dark
    // (System mode is available in Settings for granular control)
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative flex h-8 w-[3.75rem] items-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-0.5 transition-all duration-300 hover:border-[var(--border-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2">
        {/* Sun icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 ${isDark ? "text-slate-600" : "text-amber-500 scale-110"}`}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
        {/* Moon icon */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 ${isDark ? "text-blue-400 scale-110" : "text-slate-400"}`}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      {/* Sliding dot */}
      <span
        className={`
          relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isDark
            ? "translate-x-[1.9rem] bg-slate-700"
            : "translate-x-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
          }
        `}
      />
    </button>
  );
}
