"use client";

/**
 * Stub chart components for the admin dashboard.
 * Replace with real charting library (recharts, etc.) when needed.
 */

interface ChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  colorMap?: Record<string, string>;
}

export function AdminLineChart({ data, height = 200, color = "var(--accent, #3b82f6)" }: ChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="relative" style={{ height }}>
      <svg viewBox={`0 0 ${data.length * 40} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={data
            .map((d, i) => `${i * 40 + 20},${height - (d.value / max) * (height - 20) - 10}`)
            .join(" ")}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {data.map((d) => (
          <span key={d.label} className="text-[9px] text-slate-600 truncate">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function AdminDonutChart({ data, height = 200 }: ChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  return (
    <div className="flex items-center gap-4" style={{ minHeight: height }}>
      <div className="relative h-24 w-24 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          {(() => {
            let offset = 0;
            return data.map((d, i) => {
              const pct = (d.value / total) * 100;
              const el = (
                <circle
                  key={d.label}
                  cx="18" cy="18" r="15.92"
                  fill="none"
                  stroke={colors[i % colors.length]}
                  strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset={`${-offset}`}
                />
              );
              offset += pct;
              return el;
            });
          })()}
        </svg>
      </div>
      <div className="space-y-1">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-slate-400">{d.label}</span>
            <span className="text-slate-300 font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminBarChart({ data, height = 200, color = "var(--accent, #3b82f6)", colorMap }: ChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2" style={{ minHeight: height }}>
      {data.map((d) => {
        const barColor = colorMap?.[d.label] ?? color;
        return (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-20 truncate text-right">{d.label}</span>
            <div className="flex-1 h-5 rounded-lg bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-lg"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="text-xs text-slate-300 w-10 text-right font-medium">{d.value}</span>
          </div>
        );
      })}
    </div>
  );
}
