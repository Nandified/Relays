"use client";

import * as React from "react";

/**
 * Premium chart components for the admin dashboard.
 * Smooth SVG-based charts with animations, hover states, and tooltips.
 */

interface ChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  colorMap?: Record<string, string>;
}

/* ── Tooltip ────────────────────────────────────────────────────── */

function Tooltip({
  x,
  y,
  label,
  value,
  visible,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={x - 36}
        y={y - 38}
        width={72}
        height={28}
        rx={8}
        fill="rgba(20, 20, 28, 0.95)"
        stroke="var(--border-hover)"
        strokeWidth={0.5}
      />
      <text x={x} y={y - 24} textAnchor="middle" fontSize="9" fontWeight="600" fill="#e2e8f0" fontFamily="system-ui">
        {value.toLocaleString()}
      </text>
      <text x={x} y={y - 14} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="system-ui">
        {label}
      </text>
    </g>
  );
}

/* ── Line Chart ─────────────────────────────────────────────────── */

export function AdminLineChart({ data, height = 200, color = "#8b5cf6" }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const padTop = 30;
  const padBottom = 24;
  const padLeft = 36;
  const padRight = 16;
  const chartW = 600;
  const chartH = height;
  const innerW = chartW - padLeft - padRight;
  const innerH = chartH - padTop - padBottom;

  const points = data.map((d, i) => ({
    x: padLeft + (i / Math.max(data.length - 1, 1)) * innerW,
    y: padTop + innerH - (d.value / max) * innerH,
  }));

  // Catmull-Rom to smooth cubic bezier path
  function smoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return "";
    if (pts.length === 2) return `M${pts[0].x},${pts[0].y}L${pts[1].x},${pts[1].y}`;

    let path = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`;
    }
    return path;
  }

  const linePath = smoothPath(points);
  const areaPath = `${linePath}L${points[points.length - 1].x},${padTop + innerH}L${points[0].x},${padTop + innerH}Z`;

  // Grid lines (4 horizontal)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: padTop + innerH * (1 - pct),
    label: Math.round(max * pct),
  }));

  // X-axis labels — show ~6 evenly spaced
  const step = Math.max(1, Math.floor(data.length / 6));
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id={`lineGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={padLeft} y1={g.y} x2={chartW - padRight} y2={g.y} stroke="var(--border)" strokeWidth={1} />
            <text x={padLeft - 6} y={g.y + 3} textAnchor="end" fontSize="8" fill="#475569" fontFamily="system-ui">
              {g.label}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#lineGrad-${color})`}
          opacity={mounted ? 1 : 0}
          style={{ transition: "opacity 0.8s ease" }}
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          strokeDasharray={mounted ? "0" : "2000"}
          strokeDashoffset={mounted ? "0" : "2000"}
          style={{ transition: "stroke-dasharray 1s ease, stroke-dashoffset 1s ease" }}
        />

        {/* Hover zones and dots */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* Invisible hover target */}
            <rect
              x={pt.x - innerW / data.length / 2}
              y={padTop}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
            />
            {/* Vertical line on hover */}
            {hoveredIndex === i && (
              <line
                x1={pt.x}
                y1={padTop}
                x2={pt.x}
                y2={padTop + innerH}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
            {/* Dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 5 : 3}
              fill={hoveredIndex === i ? color : "transparent"}
              stroke={hoveredIndex === i ? color : "transparent"}
              strokeWidth={2}
              style={{ transition: "all 0.15s ease" }}
            />
            {hoveredIndex === i && (
              <circle cx={pt.x} cy={pt.y} r={8} fill={color} opacity={0.15} />
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map((d) => {
          const idx = data.indexOf(d);
          if (idx < 0) return null;
          return (
            <text
              key={d.label}
              x={points[idx].x}
              y={chartH - 4}
              textAnchor="middle"
              fontSize="8"
              fill="#475569"
              fontFamily="system-ui"
            >
              {d.label}
            </text>
          );
        })}

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <Tooltip
            x={points[hoveredIndex].x}
            y={points[hoveredIndex].y}
            label={data[hoveredIndex].label}
            value={data[hoveredIndex].value}
            visible
          />
        )}
      </svg>
    </div>
  );
}

/* ── Donut Chart ────────────────────────────────────────────────── */

export function AdminDonutChart({ data, height = 220 }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"];

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 56;
  const strokeWidth = 18;

  // Build arc segments
  const segments: { startAngle: number; endAngle: number; color: string; index: number }[] = [];
  let currentAngle = -90; // start from top
  data.forEach((d, i) => {
    const angle = (d.value / total) * 360;
    segments.push({
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: colors[i % colors.length],
      index: i,
    });
    currentAngle += angle;
  });

  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  return (
    <div className="flex items-center gap-6" style={{ minHeight: height }}>
      <div
        className="relative flex-shrink-0"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />

          {/* Segments */}
          {segments.map((seg) => {
            const isHovered = hoveredIndex === seg.index;
            const gap = 2; // degrees gap between segments
            return (
              <path
                key={seg.index}
                d={describeArc(cx, cy, radius, seg.startAngle + gap / 2, seg.endAngle - gap / 2)}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeLinecap="round"
                opacity={mounted ? (hoveredIndex !== null && !isHovered ? 0.4 : 1) : 0}
                style={{
                  transition: "opacity 0.6s ease, stroke-width 0.2s ease",
                  transitionDelay: mounted ? `${seg.index * 0.08}s` : "0s",
                  filter: isHovered ? `drop-shadow(0 0 6px ${seg.color}60)` : "none",
                }}
                onMouseEnter={() => setHoveredIndex(seg.index)}
                className="cursor-pointer"
              />
            );
          })}

          {/* Center label */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#e2e8f0" fontFamily="system-ui">
            {hoveredIndex !== null ? data[hoveredIndex].value : total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="system-ui">
            {hoveredIndex !== null ? data[hoveredIndex].label : "Total"}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2 flex-1 min-w-0">
        {data.map((d, i) => {
          const pct = ((d.value / total) * 100).toFixed(1);
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={d.label}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors cursor-pointer ${
                isHovered ? "bg-black/[0.04] dark:bg-white/[0.04]" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: colors[i % colors.length],
                  boxShadow: isHovered ? `0 0 8px ${colors[i % colors.length]}60` : "none",
                }}
              />
              <span className={`text-xs truncate flex-1 ${isHovered ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                {d.label}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{d.value}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-600 tabular-nums w-10 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Bar Chart ──────────────────────────────────────────────────── */

export function AdminBarChart({ data, height = 200, color = "#8b5cf6", colorMap }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-1.5" style={{ minHeight: height }}>
      {data.map((d, i) => {
        const barColor = colorMap?.[d.label] ?? color;
        const pct = (d.value / max) * 100;
        const isHovered = hoveredIndex === i;
        return (
          <div
            key={d.label}
            className={`group flex items-center gap-3 rounded-lg px-1 py-1 transition-colors ${
              isHovered ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className={`text-xs w-20 truncate text-right transition-colors ${isHovered ? "text-slate-800 dark:text-slate-200" : "text-slate-500"}`}>
              {d.label}
            </span>
            <div className="flex-1 h-6 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] overflow-hidden relative">
              <div
                className="h-full rounded-lg transition-all duration-700 ease-out relative overflow-hidden"
                style={{
                  width: mounted ? `${Math.max(pct, 3)}%` : "0%",
                  backgroundColor: barColor,
                  transitionDelay: `${i * 0.06}s`,
                  boxShadow: isHovered ? `0 0 12px ${barColor}40` : "none",
                }}
              >
                {/* Shimmer effect on hover */}
                {isHovered && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    style={{ animation: "shimmerSweep 1.5s ease infinite" }}
                  />
                )}
              </div>
            </div>
            <span className={`text-xs w-12 text-right font-semibold tabular-nums transition-colors ${
              isHovered ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
            }`}>
              {d.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Funnel Chart ───────────────────────────────────────────────── */

export function AdminFunnelChart({ data, height = 200 }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const max = Math.max(...data.map((d) => d.value), 1);
  const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#c084fc"];

  return (
    <div className="space-y-2" style={{ minHeight: height }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const prevPct = i > 0 ? ((d.value / data[i - 1].value) * 100).toFixed(0) : null;
        const segColor = colors[i % colors.length];
        const isHovered = hoveredIndex === i;
        const dropoff = i > 0 ? data[i - 1].value - d.value : 0;

        return (
          <div key={d.label}>
            <div
              className={`flex items-center gap-3 rounded-lg px-1 py-1 transition-colors ${isHovered ? "bg-black/[0.02] dark:bg-white/[0.02]" : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className={`text-xs w-28 truncate text-right transition-colors ${isHovered ? "text-slate-800 dark:text-slate-200" : "text-slate-500"}`}>
                {d.label}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] overflow-hidden flex items-center relative">
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: mounted ? `${Math.max(pct, 10)}%` : "0%",
                      backgroundColor: segColor,
                      transitionDelay: `${i * 0.1}s`,
                      boxShadow: isHovered ? `0 0 16px ${segColor}40` : "none",
                    }}
                  >
                    <span className="text-[11px] text-white/90 font-semibold tabular-nums relative z-10">
                      {d.value.toLocaleString()}
                    </span>
                    {isHovered && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        style={{ animation: "shimmerSweep 1.5s ease infinite" }}
                      />
                    )}
                  </div>
                </div>
                {prevPct && (
                  <div className="flex flex-col items-end w-14">
                    <span className={`text-[10px] font-medium tabular-nums ${
                      Number(prevPct) >= 60 ? "text-emerald-400" : Number(prevPct) >= 40 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {prevPct}%
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-600 tabular-nums">-{dropoff}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Connector arrow between funnel steps */}
            {i < data.length - 1 && (
              <div className="flex items-center pl-[calc(7rem+12px)] py-0.5">
                <svg width="12" height="10" viewBox="0 0 12 10" className="text-slate-700">
                  <path d="M6 0 L6 6 L3 6 L6 10 L9 6 L6 6" fill="currentColor" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
