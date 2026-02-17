"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockAdminMetrics, mockActivityFeed, mockVerificationQueue, mockMetricsTimeline } from "@/lib/mock-admin-data";
import { AdminLineChart, AdminDonutChart, AdminBarChart } from "@/components/admin/Charts";

/* ── Metric Card ──────────────────────────────────────────────── */

interface MetricCardData {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string | null;
  color: "violet" | "blue" | "emerald" | "amber" | "rose";
  change?: string;
  changeUp?: boolean;
}

const metricCards: MetricCardData[] = [
  {
    label: "Total Pros",
    value: mockAdminMetrics.totalPros,
    icon: <UsersIcon />,
    href: "/admin/pros",
    color: "violet",
    change: "+23%",
    changeUp: true,
  },
  {
    label: "Total Consumers",
    value: mockAdminMetrics.totalConsumers,
    icon: <HomeIcon />,
    href: null,
    color: "blue",
    change: "+18%",
    changeUp: true,
  },
  {
    label: "Active Journeys",
    value: mockAdminMetrics.activeJourneys,
    icon: <MapIcon />,
    href: null,
    color: "emerald",
    change: "+42%",
    changeUp: true,
  },
  {
    label: "Pending Verifications",
    value: mockAdminMetrics.pendingVerifications,
    icon: <ShieldIcon />,
    href: "/admin/verification",
    color: "amber",
  },
  {
    label: "Weekly Signups",
    value: mockAdminMetrics.weeklySignups,
    icon: <TrendUpIcon />,
    href: "/admin/metrics",
    color: "violet",
    change: "+31%",
    changeUp: true,
  },
  {
    label: "Monthly Revenue",
    value: "$0",
    icon: <DollarIcon />,
    href: null,
    color: "rose",
    change: "Pre-revenue",
  },
];

const colorConfig = {
  violet: { bg: "from-violet-500/10 to-violet-500/0", border: "border-violet-500/10", glow: "shadow-[0_0_20px_rgba(139,92,246,0.12)]", text: "text-violet-400", iconBg: "bg-violet-500/10" },
  blue: { bg: "from-blue-500/10 to-blue-500/0", border: "border-blue-500/10", glow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]", text: "text-blue-400", iconBg: "bg-blue-500/10" },
  emerald: { bg: "from-emerald-500/10 to-emerald-500/0", border: "border-emerald-500/10", glow: "shadow-[0_0_20px_rgba(16,185,129,0.12)]", text: "text-emerald-400", iconBg: "bg-emerald-500/10" },
  amber: { bg: "from-amber-500/10 to-amber-500/0", border: "border-amber-500/10", glow: "shadow-[0_0_20px_rgba(245,158,11,0.12)]", text: "text-amber-400", iconBg: "bg-amber-500/10" },
  rose: { bg: "from-rose-500/10 to-rose-500/0", border: "border-rose-500/10", glow: "shadow-[0_0_20px_rgba(244,63,94,0.12)]", text: "text-rose-400", iconBg: "bg-rose-500/10" },
};

/* ── Activity Icons ───────────────────────────────────────────── */

const activityTypeConfig: Record<string, { icon: string; color: string }> = {
  pro_signup: { icon: "👤", color: "bg-violet-500/10 border-violet-500/10" },
  consumer_signup: { icon: "🏠", color: "bg-blue-500/10 border-blue-500/10" },
  verification_submitted: { icon: "📋", color: "bg-amber-500/10 border-amber-500/10" },
  verification_approved: { icon: "✅", color: "bg-emerald-500/10 border-emerald-500/10" },
  verification_auto_approved: { icon: "🤖", color: "bg-emerald-500/10 border-emerald-500/10" },
  team_built: { icon: "👥", color: "bg-blue-500/10 border-blue-500/10" },
  journey_started: { icon: "🗺️", color: "bg-violet-500/10 border-violet-500/10" },
  profile_claimed: { icon: "🔗", color: "bg-emerald-500/10 border-emerald-500/10" },
  outreach_sent: { icon: "📧", color: "bg-blue-500/10 border-blue-500/10" },
  data_import: { icon: "📦", color: "bg-violet-500/10 border-violet-500/10" },
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const signupTrendData = mockMetricsTimeline.daily.map(d => ({
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: d.signups,
  }));

  const donutData = mockMetricsTimeline.categoryBreakdown;
  const topCitiesData = mockMetricsTimeline.topCities.slice(0, 6);
  const requestStatusData = mockMetricsTimeline.requestsByStatus;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Command Center</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-500">
            Platform overview and recent activity.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
          All systems operational
        </div>
      </div>

      {/* ── Metric Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 stagger-children">
        {metricCards.map((metric) => {
          const c = colorConfig[metric.color];
          const inner = (
            <div
              className={`group relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-b ${c.bg} p-4 transition-all duration-300 admin-metric-card`}
            >
              {/* Subtle corner glow */}
              <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full ${c.iconBg} blur-2xl opacity-40 transition-opacity group-hover:opacity-70`} />
              {/* Icon */}
              <div className={`relative mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg} border ${c.border} ${c.text}`}>
                {metric.icon}
              </div>
              {/* Value */}
              <div className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
              </div>
              {/* Label */}
              <div className="relative mt-0.5 text-xs text-slate-600 dark:text-slate-500">{metric.label}</div>
              {/* Change badge */}
              {metric.change && (
                <div className={`relative mt-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  metric.changeUp
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-200 dark:bg-slate-500/10 text-slate-600 dark:text-slate-500"
                }`}>
                  {metric.changeUp && "↑"} {metric.change}
                </div>
              )}
              {/* Arrow for linked cards */}
              {metric.href && (
                <div className="absolute top-3 right-3 text-slate-500 dark:text-slate-500 transition-all group-hover:text-slate-700 dark:group-hover:text-slate-400 group-hover:translate-x-0.5">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                </div>
              )}
            </div>
          );

          return metric.href ? (
            <Link key={metric.label} href={metric.href}>{inner}</Link>
          ) : (
            <div key={metric.label}>{inner}</div>
          );
        })}
      </div>

      {/* ── Charts Grid ───────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Signup Trend (Line) */}
        <Card padding="lg" className="glow-violet">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Signup Trend</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">Daily signups over last 30 days</p>
            </div>
            <Badge variant="accent">30 days</Badge>
          </div>
          <AdminLineChart data={signupTrendData} color="#8b5cf6" height={220} />
        </Card>

        {/* Category Distribution (Donut) */}
        <Card padding="lg" className="glow-violet">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pro Distribution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">By service category</p>
            </div>
            <Badge variant="accent">{mockAdminMetrics.totalPros} total</Badge>
          </div>
          <AdminDonutChart data={donutData} height={220} />
        </Card>

        {/* Top Cities (Bar) */}
        <Card padding="lg" className="glow-violet">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Top Cities</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">Professionals by metro area</p>
            </div>
          </div>
          <AdminBarChart data={topCitiesData} color="#3b82f6" height={220} />
        </Card>

        {/* Requests by Status (Bar) */}
        <Card padding="lg" className="glow-violet">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Requests by Status</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">Service request pipeline</p>
            </div>
          </div>
          <AdminBarChart data={requestStatusData} height={220} colorMap={{
            Submitted: "#8b5cf6",
            Reviewing: "#f59e0b",
            Matched: "#3b82f6",
            Scheduled: "#6366f1",
            Completed: "#10b981",
            Cancelled: "#ef4444",
          }} />
        </Card>
      </div>

      {/* ── Activity Feed + Quick Actions ─────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h2>
            <span className="text-xs text-slate-500 dark:text-slate-500">{mockActivityFeed.length} events</span>
          </div>
          <Card padding="none" className="divide-y divide-[var(--border)]">
            {mockActivityFeed.map((event, idx) => {
              const typeInfo = activityTypeConfig[event.type] ?? { icon: "📌", color: "bg-slate-200 dark:bg-slate-500/10 border-slate-300 dark:border-slate-500/10" };
              return (
                <div
                  key={event.id}
                  className="group flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm transition-transform group-hover:scale-105 ${typeInfo.color}`}>
                    {typeInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-500">{formatTimeAgo(event.timestamp)}</span>
                      {event.type === "verification_auto_approved" && (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0">AI Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Quick Actions + Pending Verifications */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/admin/verification">
                <Card hover padding="sm" className="group/qa flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/10 transition-transform group-hover/qa:scale-105">
                    <ShieldIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Review Verifications</div>
                    <div className="text-xs text-slate-600 dark:text-slate-500">{mockVerificationQueue.filter(v => v.status === "pending").length} pending review</div>
                  </div>
                  <Badge variant="warning">{mockVerificationQueue.filter(v => v.status === "pending").length}</Badge>
                </Card>
              </Link>

              <Link href="/admin/pros">
                <Card hover padding="sm" className="group/qa flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/10 transition-transform group-hover/qa:scale-105">
                    <UsersIcon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Manage Pros</div>
                    <div className="text-xs text-slate-600 dark:text-slate-500">{mockAdminMetrics.totalPros} registered</div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/data-import">
                <Card hover padding="sm" className="group/qa flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/10 transition-transform group-hover/qa:scale-105">
                    <DatabaseIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Data Import</div>
                    <div className="text-xs text-slate-600 dark:text-slate-500">9,001 records across IL</div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/metrics">
                <Card hover padding="sm" className="group/qa flex items-center gap-3 glow-violet">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/10 transition-transform group-hover/qa:scale-105">
                    <ChartIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Detailed Analytics</div>
                    <div className="text-xs text-slate-600 dark:text-slate-500">Funnels, health, growth</div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Pending verifications preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Verification Queue</h3>
              <Link href="/admin/verification" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-2">
              {mockVerificationQueue.filter(v => v.status === "pending").slice(0, 4).map((ver) => (
                <Card key={ver.id} padding="sm" className="group/vq flex items-center gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-xs font-bold text-amber-400 border border-amber-500/10 transition-transform group-hover/vq:scale-105">
                    {ver.proName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{ver.proName}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-500">{ver.category}</div>
                  </div>
                  {ver.ocrData && (
                    <div className={`text-[10px] font-medium tabular-nums ${
                      ver.ocrData.confidenceScore >= 90 ? "text-emerald-400" : ver.ocrData.confidenceScore >= 70 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {ver.ocrData.confidenceScore}%
                    </div>
                  )}
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

/* ── Icon Components ──────────────────────────────────────────── */

function UsersIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function HomeIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function MapIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function ShieldIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function TrendUpIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function DollarIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DatabaseIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}

function ChartIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
