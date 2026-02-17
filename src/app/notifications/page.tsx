"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { mockNotifications } from "@/lib/mock-notifications";
import { type Notification, type NotificationType } from "@/lib/types";

/* ── Type config ──────────────────────────────────────────────── */
const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  moment_triggered: {
    icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border border-amber-500/15",
    label: "Moment",
  },
  booking_requested: {
    icon: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border border-blue-500/15",
    label: "Booking",
  },
  booking_confirmed: {
    icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border border-emerald-500/15",
    label: "Booking",
  },
  booking_declined: {
    icon: <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    color: "text-red-400",
    bgColor: "bg-red-500/10 border border-red-500/15",
    label: "Booking",
  },
  doc_uploaded: {
    icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border border-cyan-500/15",
    label: "Document",
  },
  doc_requested: {
    icon: <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border border-orange-500/15",
    label: "Document",
  },
  message_received: {
    icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border border-blue-500/15",
    label: "Message",
  },
  profile_claimed: {
    icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border border-purple-500/15",
    label: "System",
  },
  review_received: {
    icon: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border border-amber-500/15",
    label: "System",
  },
  connect_request: {
    icon: <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10 border border-indigo-500/15",
    label: "System",
  },
  system: {
    icon: <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    color: "text-slate-500 dark:text-slate-400",
    bgColor: "bg-slate-300 dark:bg-slate-400 dark:bg-slate-500/10 border border-slate-300 dark:border-slate-500/15",
    label: "System",
  },
};

function NotificationIcon({ type, size = 18 }: { type: NotificationType; size?: number }) {
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

type FilterId = "all" | "bookings" | "moments" | "messages" | "documents" | "system";

const filterMap: Record<FilterId, NotificationType[]> = {
  all: [],
  bookings: ["booking_requested", "booking_confirmed", "booking_declined"],
  moments: ["moment_triggered"],
  messages: ["message_received"],
  documents: ["doc_uploaded", "doc_requested"],
  system: ["system", "profile_claimed", "review_received", "connect_request"],
};

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [activeFilter, setActiveFilter] = React.useState<FilterId>("all");

  const filtered = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => filterMap[activeFilter].includes(n.type));

  const unreadCount = filtered.filter((n) => !n.read).length;

  const tabs = [
    { id: "all", label: "All", count: notifications.length },
    { id: "bookings", label: "Bookings", count: notifications.filter((n) => filterMap.bookings.includes(n.type)).length },
    { id: "moments", label: "Moments", count: notifications.filter((n) => filterMap.moments.includes(n.type)).length },
    { id: "messages", label: "Messages", count: notifications.filter((n) => filterMap.messages.includes(n.type)).length },
    { id: "documents", label: "Documents", count: notifications.filter((n) => filterMap.documents.includes(n.type)).length },
    { id: "system", label: "System", count: notifications.filter((n) => filterMap.system.includes(n.type)).length },
  ];

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-none">
        <Tabs
          tabs={tabs}
          activeId={activeFilter}
          onChange={(id) => setActiveFilter(id as FilterId)}
        />
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/15">
              <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500">
              {activeFilter === "all"
                ? "No notifications to show. We'll let you know when something happens."
                : `No ${activeFilter} notifications right now.`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2 stagger-children">
          {filtered.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onRead={markRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification: n,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const config = typeConfig[n.type];

  return (
    <Link
      href={n.link || "/notifications"}
      onClick={() => onRead(n.id)}
    >
      <Card hover padding="none" className={`overflow-hidden ${!n.read ? "border-blue-500/10" : ""}`}>
        {/* Unread indicator bar */}
        {!n.read && (
          <div className="h-[2px] bg-gradient-to-r from-blue-500/50 via-blue-500/30 to-transparent" />
        )}

        <div className="flex gap-3 px-4 py-3.5">
          {/* Icon */}
          <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}>
            <NotificationIcon type={n.type} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-slate-900 dark:text-slate-100" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                  {n.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{n.body}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-600">{timeAgo(n.createdAt)}</span>
                {!n.read && (
                  <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                )}
              </div>
            </div>

            {/* Action hint */}
            {n.link && (
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-400/70">
                <span>View details</span>
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
