"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  mockConversations,
  conversationMeta,
  mockConnectRequests,
} from "@/lib/mock-notifications";

function timeAgo(date: string): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1d";
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const conversations = mockConversations;
  const connectRequests = mockConnectRequests.filter((r) => r.status === "pending");
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Messages</h1>
        <p className="mt-1 text-sm text-slate-400">
          {totalUnread > 0 ? `${totalUnread} unread conversation${totalUnread !== 1 ? "s" : ""}` : "All messages read"}
        </p>
      </div>

      {/* Pending connect requests */}
      {connectRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Pending Introductions</h2>
          {connectRequests.map((req) => (
            <Link key={req.id} href={`/messages/connect/${req.id}`}>
              <Card hover padding="none" className="overflow-hidden border-indigo-500/15 mb-2">
                <div className="h-[2px] bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent" />
                <div className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/15">
                    <svg width="18" height="18" fill="none" stroke="#818cf8" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">Request to Connect</span>
                      <Badge variant="accent" className="text-[10px]">Pending</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      To {req.proName} • {req.message.slice(0, 60)}…
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-600 flex-shrink-0">{timeAgo(req.createdAt)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Conversations */}
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Conversations</h2>
      
      {conversations.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/15">
              <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">No conversations yet</h3>
            <p className="text-sm text-slate-500">
              Start a conversation from your journey page by messaging a pro.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2 stagger-children">
          {conversations.map((conv) => {
            const meta = conversationMeta[conv.id];
            if (!meta) return null;

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`}>
                <Card hover padding="none" className={`overflow-hidden ${conv.unreadCount > 0 ? "border-blue-500/10" : ""}`}>
                  {conv.unreadCount > 0 && (
                    <div className="h-[2px] bg-gradient-to-r from-blue-500/40 to-transparent" />
                  )}
                  <div className="flex items-center gap-3 p-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="h-11 w-11 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]">
                        <Image
                          src={meta.otherPartyAvatar}
                          alt={meta.otherPartyName}
                          width={44}
                          height={44}
                          className="object-cover"
                        />
                      </div>
                      {/* Online dot placeholder */}
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--bg-card)] bg-emerald-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-sm truncate ${conv.unreadCount > 0 ? "font-semibold text-slate-100" : "font-medium text-slate-300"}`}>
                            {meta.otherPartyName}
                          </span>
                          <Badge variant="outline" className="text-[10px] flex-shrink-0">
                            {meta.otherPartyRole}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-600 flex-shrink-0">{timeAgo(conv.lastMessageAt)}</span>
                      </div>
                      
                      {/* Journey context */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg width="10" height="10" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0">
                          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[11px] text-slate-600 truncate">{meta.journeyTitle}</span>
                      </div>

                      {/* Last message preview */}
                      <p className={`mt-1 text-xs truncate ${conv.unreadCount > 0 ? "text-slate-300" : "text-slate-500"}`}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {conv.unreadCount > 0 && (
                      <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.4)] flex-shrink-0">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
