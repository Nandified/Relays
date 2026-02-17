"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockConnectRequests } from "@/lib/mock-notifications";
import { getProById, getJourneyById } from "@/lib/mock-data";

export default function ConnectRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const request = mockConnectRequests.find((r) => r.id === id);
  const [status, setStatus] = React.useState(request?.status ?? "pending");

  if (!request) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🔗</div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Request not found</h1>
          <p className="text-sm text-slate-500 mb-4">This connect request may have expired.</p>
          <Link href="/messages"><Button>Back to Messages</Button></Link>
        </div>
      </div>
    );
  }

  const pro = getProById(request.proId);
  const journey = getJourneyById(request.journeyId);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Back */}
      <Link href="/messages" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-6">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back to Messages
      </Link>

      {/* Status card */}
      <Card padding="none" className="overflow-hidden">
        {/* Premium gradient header */}
        <div className="relative h-24 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/10 border-b border-[var(--border)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 right-8 h-16 w-16 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="absolute bottom-0 left-8 h-12 w-12 rounded-full bg-purple-500/10 blur-2xl" />
          </div>
          <div className="relative flex items-center justify-center h-full">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/10">
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Introduction Request</h1>
                <p className="text-xs text-white/60">Professional connection</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Status */}
          <div className="flex items-center justify-between mb-5">
            <Badge
              variant={status === "pending" ? "accent" : status === "accepted" ? "success" : "danger"}
              className="text-xs"
            >
              {status === "pending" ? "⏳ Awaiting Response" : status === "accepted" ? "✓ Accepted" : "✗ Declined"}
            </Badge>
            <span className="text-[11px] text-slate-500 dark:text-slate-600">
              {new Date(request.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          </div>

          {/* To */}
          <div className="mb-4">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">To</span>
            <div className="mt-1.5 flex items-center gap-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] p-3">
              {pro && (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/15 text-sm font-semibold text-indigo-400">
                    {pro.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{pro.name}</p>
                    <p className="text-xs text-slate-500">{pro.companyName} • {pro.categories[0]}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Journey context */}
          {journey && (
            <div className="mb-4">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Regarding</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-blue-500/[0.04] border border-blue-500/10 p-3">
                <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs text-slate-700 dark:text-slate-300">{journey.title} — {journey.address}</span>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="mb-4">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Your Message</span>
            <div className="mt-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] p-3">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{request.message}</p>
            </div>
          </div>

          {/* Preferred contact */}
          <div className="mb-6">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Preferred Contact</span>
            <div className="mt-1.5">
              <Badge variant="outline">
                {request.preferredContact === "in_app" ? "💬 In-App Messaging" : request.preferredContact === "email" ? "📧 Email" : "📱 Phone"}
              </Badge>
            </div>
          </div>

          {/* Status-dependent content */}
          {status === "pending" && (
            <div className="rounded-xl bg-amber-500/[0.04] border border-amber-500/10 p-3.5 text-center">
              <p className="text-sm text-amber-300/90">Waiting for {request.proName} to respond…</p>
              <p className="text-xs text-slate-500 mt-1">Pros typically respond within 24 hours</p>
            </div>
          )}

          {status === "accepted" && (
            <div className="space-y-3">
              <div className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 p-3.5 text-center">
                <p className="text-sm text-emerald-400">🎉 {request.proName} accepted your request!</p>
                <p className="text-xs text-slate-500 mt-1">You can now message them directly.</p>
              </div>
              <Link href="/messages/conv_1">
                <Button className="w-full">Open Conversation</Button>
              </Link>
            </div>
          )}

          {status === "declined" && (
            <div className="space-y-3">
              <div className="rounded-xl bg-red-500/[0.04] border border-red-500/10 p-3.5 text-center">
                <p className="text-sm text-red-400">{request.proName} isn&apos;t available right now.</p>
                <p className="text-xs text-slate-500 mt-1">Try another professional from the marketplace.</p>
              </div>
              <Link href="/marketplace">
                <Button variant="secondary" className="w-full">Browse Marketplace</Button>
              </Link>
            </div>
          )}

          {/* Demo controls */}
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <p className="text-[10px] text-slate-500 dark:text-slate-600 mb-2 text-center">Demo: simulate response</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus("accepted")}
                className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => setStatus("declined")}
                className="flex-1 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={() => setStatus("pending")}
                className="flex-1 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
