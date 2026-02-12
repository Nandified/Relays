"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockMetricsTimeline, mockAdminMetrics, type MetricDataPoint } from "@/lib/mock-admin-data";

/* ── Simple Bar Chart (SVG) ───────────────────────────────────── */

function BarChart({
  data,
  color = "#8b5cf6",
  height = 160,
}: {
  data: MetricDataPoint[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barWidth = 100 / data.length;
  const barPadding = barWidth * 0.2;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            y1={height - ratio * (height - 30)}
            x2="100"
            y2={height - ratio * (height - 30)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.3"
          />
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / max) * (height - 30);
          const x = i * barWidth + barPadding / 2;
          const w = barWidth - barPadding;
          const y = height - 20 - barH;

          return (
            <g key={d.label}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx="1.5"
                fill={color}
                opacity="0.7"
              />
              {/* Glow */}
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx="1.5"
                fill={color}
                opacity="0.15"
                filter="blur(2px)"
              />
              {/* Value label */}
              <text
                x={x + w / 2}
                y={y - 3}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="3.5"
                fontWeight="600"
              >
                {d.value}
              </text>
              {/* X label */}
              <text
                x={x + w / 2}
                y={height - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.25)"
                fontSize="3"
              >
                {d.label.replace("Jan ", "J").replace("Feb ", "F")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Horizontal Bar Chart ─────────────────────────────────────── */

function HorizontalBarChart({ data }: { data: MetricDataPoint[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const colors = ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-300">{d.label}</span>
            <span className="text-xs text-slate-500">{d.value} pros</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: colors[i % colors.length],
                boxShadow: `0 0 10px ${colors[i % colors.length]}40`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Metric Highlight Card ────────────────────────────────────── */

function MetricHighlight({
  label,
  current,
  previous,
  icon,
}: {
  label: string;
  current: number;
  previous: number;
  icon: string;
}) {
  const change = previous > 0 ? ((current - previous) / previous * 100) : 0;
  const isUp = change >= 0;

  return (
    <div className="admin-metric-card rounded-2xl border border-[var(--border)] bg-gradient-to-b from-violet-500/5 to-transparent p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {isUp ? "↑" : "↓"} {Math.abs(change).toFixed(0)}%
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-100">{current}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function AdminMetricsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Analytics & Metrics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Platform performance and growth tracking.
        </p>
      </div>

      {/* Highlight metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <MetricHighlight label="Total Users" current={57} previous={35} icon="👥" />
        <MetricHighlight label="Active Pros" current={mockAdminMetrics.totalPros} previous={6} icon="👤" />
        <MetricHighlight label="Searches" current={178} previous={89} icon="🔍" />
        <MetricHighlight label="Journeys" current={8} previous={5} icon="🗺️" />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Signups over time */}
        <Card padding="lg" className="glow-violet">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Total Signups</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cumulative over time</p>
            </div>
            <Badge variant="accent">7 weeks</Badge>
          </div>
          <BarChart data={mockMetricsTimeline.signups} color="#8b5cf6" />
        </Card>

        {/* Consumer searches */}
        <Card padding="lg" className="glow-violet">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Consumer Searches</h3>
              <p className="text-xs text-slate-500 mt-0.5">Weekly search volume</p>
            </div>
            <Badge variant="accent">7 weeks</Badge>
          </div>
          <BarChart data={mockMetricsTimeline.consumerSearches} color="#3b82f6" />
        </Card>

        {/* Pro claims */}
        <Card padding="lg" className="glow-violet">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Pro Registrations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cumulative pro signups</p>
            </div>
            <Badge variant="accent">7 weeks</Badge>
          </div>
          <BarChart data={mockMetricsTimeline.proClaims} color="#10b981" />
        </Card>

        {/* Journey starts */}
        <Card padding="lg" className="glow-violet">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Journeys Started</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cumulative over time</p>
            </div>
            <Badge variant="accent">7 weeks</Badge>
          </div>
          <BarChart data={mockMetricsTimeline.journeyStarts} color="#f59e0b" />
        </Card>
      </div>

      {/* Category breakdown — full width */}
      <div className="mt-6">
        <Card padding="lg" className="glow-violet">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Category Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">Professionals per service category</p>
            </div>
          </div>
          <HorizontalBarChart data={mockMetricsTimeline.categoryBreakdown} />
        </Card>
      </div>

      {/* Key stats table */}
      <div className="mt-6">
        <Card padding="none" className="overflow-hidden glow-violet">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-slate-200">Platform Summary</h3>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[
              { label: "Total Professionals (Relays)", value: mockAdminMetrics.totalPros.toString() },
              { label: "Google Places Listings", value: mockAdminMetrics.googlePlacesListings.toString() },
              { label: "Claimed Profiles", value: mockAdminMetrics.claimedProfiles.toString() },
              { label: "Total Consumers", value: mockAdminMetrics.totalConsumers.toString() },
              { label: "Teams Built", value: mockAdminMetrics.teamsBuilt.toString() },
              { label: "Active Journeys", value: mockAdminMetrics.activeJourneys.toString() },
              { label: "Pending Verifications", value: mockAdminMetrics.pendingVerifications.toString() },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-slate-400">{row.label}</span>
                <span className="text-sm font-medium text-slate-200">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
