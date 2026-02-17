"use client";

import Link from "next/link";
import { getTotalUnreadMessages } from "@/lib/mock-notifications";

export function MessageBadge() {
  const unreadCount = getTotalUnreadMessages();

  return (
    <Link
      href="/messages"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      aria-label="Messages"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-badge-appear">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
