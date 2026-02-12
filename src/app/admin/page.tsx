"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAdminMetrics, mockActivityFeed, mockVerificationQueue } from "@/lib/mock-admin-data";

const metricCards = [
  { label: "Total Pros", value: mockAdminMetrics.totalPros, icon: "👤", href: "/admin/pros", color: "violet" },
  { label: "Total Consumers", value: mockAdminMetrics.totalConsumers, icon: "🏠", href: null, color: "blue" },
  { label: "Teams Built", value: mockAdminMetrics.teamsBuilt, icon: "👥", href: null, color: "emerald" },
  { label: "Pending Verifications", value: mockAdminMetrics.pendingVerifications, icon: "🛡️", href: "/admin/verification", color: "amber" },
  { label: "Active Journeys", value: mockAdminMetrics.activeJourneys, icon: "🗺️", href: null, color: "blue" },
  { label: "Google Places", value: mockAdminMetrics.googlePlacesListings, icon: "📍", href: "/admin/pros", color: "violet" },
];

const colorMap: Record<string, string> = {
  violet: "from-violet-500/10 to-violet-500/5 border-violet-500/10",
  blue: "from-blue-500/10 to-blue-500/5 border-blue-500/10",
  emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10",
  amber: "from-amber-500/10 to-amber-500/5 border-amber-500/10",
};

const activityTypeIcons: Record<string, { icon: string; color: string }> = {
  pro_signup: { icon: "👤", color: "text-violet-400" },
  consumer_signup: { icon: "🏠", color: "text-blue-400" },
  verification_submitted: { icon: "📋", color: "text-amber-400" },
  verification_approved: { icon: "✅", color: "text-emerald-400" },
  team_built: { icon: "👥", color: "text-blue-400" },
  journey_started: { icon: "🗺️", color: "text-violet-400" },
  profile_claimed: { icon: "🔗", color: "text-emerald-400" },
  outreach_sent: { icon: "📧", color: "text-blue-400" },
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of your Relays platform metrics and activity.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        {metricCards.map((metric) => {
          const content = (
            <div
              key={metric.label}
              className={`admin-metric-card rounded-2xl border bg-gradient-to-b ${colorMap[metric.color]} p-4 transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{metric.icon}</span>
                {metric.href && (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-600">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
              <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{metric.label}</div>
            </div>
          );

          return metric.href ? (
            <Link key={metric.label} href={metric.href}>
              {content}
            </Link>
          ) : (
            <React.Fragment key={metric.label}>{content}</React.Fragment>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Activity feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Recent Activity</h2>
          </div>
          <Card padding="none" className="divide-y divide-[var(--border)]">
            {mockActivityFeed.map((event) => {
              const typeInfo = activityTypeIcons[event.type] ?? { icon: "📌", color: "text-slate-400" };
              return (
                <div key={event.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <span className="mt-0.5 text-sm">{typeInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{event.description}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{formatTimeAgo(event.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Quick actions + pending verifications */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div>
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/admin/verification">
                <Card hover padding="sm" className="flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/10">
                    <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200">Review Verifications</div>
                    <div className="text-xs text-slate-500">{mockVerificationQueue.filter(v => v.status === "pending").length} pending</div>
                  </div>
                  <Badge variant="warning">{mockVerificationQueue.filter(v => v.status === "pending").length}</Badge>
                </Card>
              </Link>

              <Link href="/admin/pros">
                <Card hover padding="sm" className="flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/10">
                    <svg width="16" height="16" fill="none" stroke="#8b5cf6" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200">Manage Pros</div>
                    <div className="text-xs text-slate-500">{mockAdminMetrics.totalPros} registered</div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/categories">
                <Card hover padding="sm" className="flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/10">
                    <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200">Manage Categories</div>
                    <div className="text-xs text-slate-500">5 active categories</div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/metrics">
                <Card hover padding="sm" className="flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/10">
                    <svg width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-200">View Metrics</div>
                    <div className="text-xs text-slate-500">Detailed analytics</div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Pending verifications preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300">Pending Verifications</h3>
              <Link href="/admin/verification" className="text-xs text-violet-400 hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {mockVerificationQueue.filter(v => v.status === "pending").slice(0, 3).map((ver) => (
                <Card key={ver.id} padding="sm" className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-xs font-bold text-amber-400">
                    {ver.proName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{ver.proName}</div>
                    <div className="text-[11px] text-slate-500">{ver.category} · {ver.licenseType}</div>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
