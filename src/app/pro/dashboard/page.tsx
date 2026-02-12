"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockProIncomingRequests } from "@/lib/mock-data";

export default function ProDashboardPage() {
  const pending = mockProIncomingRequests.filter((r) => r.status === "pending");
  const accepted = mockProIncomingRequests.filter((r) => r.status === "accepted");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Pro Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Welcome back! Here&apos;s what needs your attention.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        <Card padding="md">
          <div className="text-2xl font-bold text-blue-400">{pending.length}</div>
          <div className="text-xs text-slate-500 mt-1">New Leads</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-amber-400">{pending.length}</div>
          <div className="text-xs text-slate-500 mt-1">Pending Actions</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-emerald-400">{accepted.length}</div>
          <div className="text-xs text-slate-500 mt-1">Active Jobs</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-slate-300">4.9</div>
          <div className="text-xs text-slate-500 mt-1">Rating</div>
        </Card>
      </div>

      {/* Pending actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Incoming Leads</h2>
          <Link href="/pro/requests" className="text-xs text-blue-400 hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {pending.slice(0, 3).map((req) => (
            <Link key={req.id} href={`/pro/requests/${req.id}`}>
              <Card hover padding="none" className="p-4 mb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">{req.clientName}</span>
                      <Badge variant="warning">New</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">{req.description}</p>
                    <div className="mt-1 text-xs text-slate-500">{req.addressOrArea} • {new Date(req.receivedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="ghost">Decline</Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Get verified CTA */}
      <div className="mb-8">
        <Card padding="lg" className="border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--accent-light)] border border-blue-500/10 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-100">Get verified — submit your license</h3>
              <p className="text-xs text-slate-400 mt-1">Verified pros get more leads and rank higher in search results. Submit your license number or upload a copy for review.</p>
              <Button size="sm" className="mt-3">Submit Credentials</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h2>
        <Card padding="none">
          {[
            { icon: "✅", text: "Morgan Davis — inspection accepted", time: "2 hours ago" },
            { icon: "📋", text: "New review from Michael T. (5 stars)", time: "Yesterday" },
            { icon: "📅", text: "Inspection scheduled for 742 Maple Ave", time: "2 days ago" },
            { icon: "🔔", text: "Casey Wilson declined — outside service area", time: "3 days ago" },
          ].map((activity, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-[var(--border)]" : ""}`}>
              <span className="text-base">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-300 truncate">{activity.text}</div>
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
