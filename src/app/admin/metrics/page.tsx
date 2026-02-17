"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { mockMetricsTimeline, mockAdminMetrics, type MetricDataPoint } from "@/lib/mock-admin-data";
import { AdminLineChart, AdminBarChart, AdminFunnelChart } from "@/components/admin/Charts";

/* ── Helper: group daily data by period ────────────────────────── */

function groupByPeriod(daily: typeof mockMetricsTimeline.daily, period: "daily" | "weekly" | "monthly"): MetricDataPoint[] {
  if (period === "daily") {
    return daily.map(d => ({
      label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: d.signups,
    }));
  }

  if (period === "weekly") {
    const weeks: MetricDataPoint[] = [];
    for (let i = 0; i < daily.length; i += 7) {
      const chunk = daily.slice(i, i + 7);
      const total = chunk.reduce((s, d) => s + d.signups, 0);
      const startDate = new Date(chunk[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      weeks.push({ label: startDate, value: total });
    }
    return weeks;
  }

  // Monthly
  const months: Record<string, number> = {};
  for (const d of daily) {
    const key = new Date(d.date).toLocaleDateString("en-US", { month: "short" });
    months[key] = (months[key] || 0) + d.signups;
  }
  return Object.entries(months).map(([label, value]) => ({ label, value }));
}

/* ── Metric Highlight Card ────────────────────────────────────── */

function MetricHighlight({
  label,
  current,
  previous,
  icon,
  color = "violet",
}: {
  label: string;
  current: number;
  previous: number;
  icon: string;
  color?: string;
}) {
  const change = previous > 0 ? ((current - previous) / previous * 100) : 0;
  const isUp = change >= 0;

  const colorMap: Record<string, { border: string; bg: string; glow: string }> = {
    violet: { border: "border-violet-500/10", bg: "from-violet-500/8", glow: "shadow-[0_0_20px_rgba(139,92,246,0.08)]" },
    blue: { border: "border-blue-500/10", bg: "from-blue-500/8", glow: "shadow-[0_0_20px_rgba(59,130,246,0.08)]" },
    emerald: { border: "border-emerald-500/10", bg: "from-emerald-500/8", glow: "shadow-[0_0_20px_rgba(16,185,129,0.08)]" },
    amber: { border: "border-amber-500/10", bg: "from-amber-500/8", glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]" },
  };

  const c = colorMap[color] || colorMap.violet;

  return (
    <div className={`group admin-metric-card rounded-2xl border ${c.border} bg-gradient-to-b ${c.bg} to-transparent p-4 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {isUp ? "↑" : "↓"} {Math.abs(change).toFixed(0)}%
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{current.toLocaleString()}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      <div className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">vs. {previous.toLocaleString()} prev</div>
    </div>
  );
}

/* ── Platform Health Card ─────────────────────────────────────── */

function HealthMetric({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string;
  unit: string;
  status: "good" | "warning" | "critical";
}) {
  const statusColors = {
    good: "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    warning: "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
    critical: "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
  };

  const statusLabels = {
    good: "Healthy",
    warning: "Warning",
    critical: "Critical",
  };

  return (
    <div className="group flex items-center justify-between py-3 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] px-2 -mx-2 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${statusColors[status]} transition-transform group-hover:scale-125`} />
        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-slate-800 dark:text-slate-200 tabular-nums font-medium">
          {value}<span className="text-slate-500 ml-0.5">{unit}</span>
        </div>
        <Badge
          variant={status === "good" ? "success" : status === "warning" ? "warning" : "danger"}
          className="text-[9px] px-1.5 py-0 hidden sm:inline-flex"
        >
          {statusLabels[status]}
        </Badge>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AdminMetricsPage() {
  const [signupPeriod, setSignupPeriod] = React.useState("daily");

  const signupData = groupByPeriod(mockMetricsTimeline.daily, signupPeriod as "daily" | "weekly" | "monthly");

  const periodTabs = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  // Pro acquisition funnel
  const proFunnel: MetricDataPoint[] = [
    { label: "Registered", value: 148 },
    { label: "Onboarded", value: 98 },
    { label: "Verified", value: 52 },
    { label: "Active (weekly)", value: 34 },
  ];

  // Consumer funnel
  const consumerFunnel: MetricDataPoint[] = [
    { label: "Signed Up", value: 423 },
    { label: "Created Team", value: 187 },
    { label: "Filled Roles", value: 89 },
    { label: "Started Journey", value: 34 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics & Metrics</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Detailed platform analytics, funnels, and health monitoring.
          </p>
        </div>
        <Badge variant="accent" className="hidden sm:inline-flex">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
          Live Data
        </Badge>
      </div>

      {/* Highlight metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        <MetricHighlight label="Total Users" current={mockAdminMetrics.totalPros + mockAdminMetrics.totalConsumers} previous={380} icon="👥" color="violet" />
        <MetricHighlight label="Active Pros" current={mockAdminMetrics.totalPros} previous={89} icon="👤" color="blue" />
        <MetricHighlight label="Consumer Searches" current={178} previous={89} icon="🔍" color="emerald" />
        <MetricHighlight label="Active Journeys" current={mockAdminMetrics.activeJourneys} previous={16} icon="🗺️" color="amber" />
      </div>

      {/* ── Signups Over Time (with toggle) ────────────────────── */}
      <Card padding="lg" className="glow-violet">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Signups Over Time</h3>
            <p className="text-xs text-slate-500 mt-0.5">Platform growth by {signupPeriod} interval</p>
          </div>
          <Tabs tabs={periodTabs} activeId={signupPeriod} onChange={setSignupPeriod} />
        </div>
        <AdminLineChart data={signupData} color="#8b5cf6" height={260} />
      </Card>

      {/* ── Funnels ────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg" className="glow-violet">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pro Acquisition Funnel</h3>
              <Badge variant="outline" className="text-[10px]">{((34 / 148) * 100).toFixed(1)}% conversion</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Registered → Onboarded → Verified → Active</p>
          </div>
          <AdminFunnelChart data={proFunnel} />
        </Card>

        <Card padding="lg" className="glow-violet">
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Consumer Funnel</h3>
              <Badge variant="outline" className="text-[10px]">{((34 / 423) * 100).toFixed(1)}% conversion</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Signed Up → Created Team → Filled Roles → Journey</p>
          </div>
          <AdminFunnelChart data={consumerFunnel} />
        </Card>
      </div>

      {/* ── Geographic & Category ──────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top cities */}
        <Card padding="lg" className="glow-violet">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Top Cities</h3>
            <p className="text-xs text-slate-500 mt-0.5">Professional distribution by metro area</p>
          </div>
          <AdminBarChart data={mockMetricsTimeline.topCities} color="#3b82f6" height={260} />
        </Card>

        {/* Category breakdown */}
        <Card padding="lg" className="glow-violet">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Category Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Professionals per service category</p>
          </div>
          <AdminBarChart data={mockMetricsTimeline.categoryBreakdown} height={260} />
        </Card>
      </div>

      {/* ── Platform Health ────────────────────────────────────── */}
      <Card padding="lg" className="glow-violet">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Platform Health</h3>
            <p className="text-xs text-slate-500 mt-0.5">System performance and reliability metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-0 divide-y divide-[var(--border)]">
            <div className="pb-2 mb-1">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Performance</span>
            </div>
            <HealthMetric label="API Response Time (p50)" value="45" unit="ms" status="good" />
            <HealthMetric label="API Response Time (p95)" value="189" unit="ms" status="good" />
            <HealthMetric label="API Response Time (p99)" value="420" unit="ms" status="warning" />
            <HealthMetric label="Uptime (30d)" value="99.98" unit="%" status="good" />
          </div>
          <div className="space-y-0 divide-y divide-[var(--border)]">
            <div className="pb-2 mb-1">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Infrastructure</span>
            </div>
            <HealthMetric label="Error Rate (24h)" value="0.12" unit="%" status="good" />
            <HealthMetric label="Active Connections" value="23" unit="" status="good" />
            <HealthMetric label="Database Size" value="1.2" unit="GB" status="good" />
            <HealthMetric label="CDN Cache Hit Rate" value="94.3" unit="%" status="good" />
          </div>
        </div>
      </Card>

      {/* ── Platform Summary Table ─────────────────────────────── */}
      <Card padding="none" className="overflow-hidden glow-violet">
        <div className="px-5 py-3.5 border-b border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02]">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Platform Summary</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[
            { label: "Total Professionals (Registered)", value: mockAdminMetrics.totalPros.toString(), highlight: true },
            { label: "Google Places Listings", value: mockAdminMetrics.googlePlacesListings.toLocaleString() },
            { label: "Claimed Profiles", value: mockAdminMetrics.claimedProfiles.toString() },
            { label: "Total Consumers", value: mockAdminMetrics.totalConsumers.toString(), highlight: true },
            { label: "Teams Built", value: mockAdminMetrics.teamsBuilt.toString() },
            { label: "Active Journeys", value: mockAdminMetrics.activeJourneys.toString() },
            { label: "Pending Verifications", value: mockAdminMetrics.pendingVerifications.toString() },
            { label: "Weekly Signups", value: mockAdminMetrics.weeklySignups.toString() },
            { label: "IDFPR Records Imported", value: "9,001", highlight: true },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
              <span className="text-sm text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className={`text-sm font-medium tabular-nums ${row.highlight ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
