"use client";

import * as React from "react";
import Link from "next/link";
import { mockNotifications } from "@/lib/mock-notifications";
import { type Notification, type NotificationType } from "@/lib/types";

/* ── Notification type config ─────────────────────────────────── */
const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  moment_triggered: {
    icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  booking_requested: {
    icon: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  booking_confirmed: {
    icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  booking_declined: {
    icon: <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  doc_uploaded: {
    icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  doc_requested: {
    icon: <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  message_received: {
    icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  profile_claimed: {
    icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  review_received: {
    icon: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  connect_request: {
    icon: <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  system: {
    icon: <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
  },
};

function NotificationIcon({ type, size = 16 }: { type: NotificationType; size?: number }) {
  const config = typeConfig[type];
  const isFilled = type === "review_received";
  return (
    <svg
      width={size}
      height={size}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      className={config.color}
    >
      {config.icon}
    </svg>
  );
}

/* ── Time formatting ──────────────────────────────────────────── */
function timeAgo(date: string): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByDate(notifications: Notification[]): { label: string; items: Notification[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  const groups: { label: string; items: Notification[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const n of notifications) {
    const d = new Date(n.createdAt);
    if (d >= today) groups[0].items.push(n);
    else if (d >= yesterday) groups[1].items.push(n);
    else groups[2].items.push(n);
  }

  return groups.filter((g) => g.items.length > 0);
}

/* ── Main Component ───────────────────────────────────────────── */
export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const grouped = groupByDate(notifications);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-badge-appear">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[70vh] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/95 backdrop-blur-xl shadow-[var(--shadow-elevated)] z-50 animate-dropdown-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto max-h-[calc(70vh-100px)] scrollbar-none">
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center py-10 px-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-sm text-slate-400">All caught up!</p>
                <p className="text-xs text-slate-600 mt-1">No new notifications</p>
              </div>
            ) : (
              grouped.map((group) => (
                <div key={group.label}>
                  <div className="sticky top-0 bg-[var(--bg-card)]/95 backdrop-blur-sm px-4 py-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{group.label}</span>
                  </div>
                  {group.items.map((notif) => (
                    <NotificationRow
                      key={notif.id}
                      notification={notif}
                      onRead={markRead}
                      onClose={() => setOpen(false)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border)] px-4 py-2.5">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all notifications
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Notification Row ─────────────────────────────────────────── */
function NotificationRow({
  notification: n,
  onRead,
  onClose,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onClose: () => void;
}) {
  const config = typeConfig[n.type];

  return (
    <Link
      href={n.link || "/notifications"}
      onClick={() => {
        onRead(n.id);
        onClose();
      }}
      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] border-b border-[var(--border-subtle)] last:border-b-0 ${
        !n.read ? "bg-blue-500/[0.03]" : ""
      }`}
    >
      {/* Icon */}
      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}>
        <NotificationIcon type={n.type} size={14} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-slate-100" : "font-medium text-slate-300"}`}>
            {n.title}
          </p>
          {!n.read && (
            <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.body}</p>
        <span className="mt-1 block text-[11px] text-slate-600">{timeAgo(n.createdAt)}</span>
      </div>
    </Link>
  );
}
