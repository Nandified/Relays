"use client";

import { useEffect, useState } from "react";
import { type ReviewStats } from "@/lib/types";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/Badge";

interface ReviewStatsHeaderProps {
  stats: ReviewStats;
  className?: string;
}

export function ReviewStatsHeader({ stats, className = "" }: ReviewStatsHeaderProps) {
  const [animatedWidths, setAnimatedWidths] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  // Animate the distribution bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const widths: Record<number, number> = {};
      const maxCount = Math.max(
        ...Object.values(stats.ratingDistribution)
      );
      for (let i = 1; i <= 5; i++) {
        const count = stats.ratingDistribution[i as 1 | 2 | 3 | 4 | 5];
        widths[i] = maxCount > 0 ? (count / maxCount) * 100 : 0;
      }
      setAnimatedWidths(widths);
    }, 100);
    return () => clearTimeout(timer);
  }, [stats.ratingDistribution]);

  return (
    <div className={`rounded-2xl border border-[var(--border)] liquid-glass p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: Big rating number + stars */}
        <div className="flex flex-col items-center sm:items-start sm:min-w-[140px]">
          <div className="text-5xl font-bold text-white tabular-nums tracking-tight">
            {stats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={stats.averageRating} size={18} className="mt-2" />
          <div className="text-sm text-slate-500 mt-1">
            {stats.totalReviews.toLocaleString()} review{stats.totalReviews !== 1 ? "s" : ""}
          </div>
          {/* Response rate badge */}
          {stats.responseRate > 0 && (
            <Badge
              variant={stats.responseRate >= 70 ? "success" : "default"}
              className="mt-3 text-[11px]"
            >
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Responds to {stats.responseRate}% of reviews
            </Badge>
          )}
        </div>

        {/* Right: Distribution bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              stats.ratingDistribution[star as 1 | 2 | 3 | 4 | 5];
            const width = animatedWidths[star] ?? 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8 justify-end flex-shrink-0">
                  <span className="text-xs text-slate-500 tabular-nums">
                    {star}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    fill="#f59e0b"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                  </svg>
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${width}%`,
                      background:
                        star >= 4
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                          : star === 3
                            ? "linear-gradient(90deg, #94a3b8, #cbd5e1)"
                            : "linear-gradient(90deg, #ef4444, #f87171)",
                      boxShadow:
                        star >= 4 && width > 0
                          ? "0 0 8px rgba(245, 158, 11, 0.3)"
                          : "none",
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-600 tabular-nums w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
