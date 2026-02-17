"use client";

import * as React from "react";
import {
  type JourneyStage,
  JOURNEY_STAGES,
  JOURNEY_STAGE_LABELS,
  JOURNEY_STAGE_ICONS,
} from "@/lib/types";

interface StageTimelineProps {
  currentStage: JourneyStage;
  onStageClick?: (stage: JourneyStage) => void;
  /** Compact mode for dashboard cards */
  compact?: boolean;
}

export function StageTimeline({ currentStage, onStageClick, compact = false }: StageTimelineProps) {
  const currentIdx = JOURNEY_STAGES.indexOf(currentStage);
  const [hoveredStage, setHoveredStage] = React.useState<JourneyStage | null>(null);

  return (
    <div className="relative w-full">
      {/* Desktop horizontal timeline */}
      <div className={`hidden sm:block ${compact ? "" : "px-2"}`}>
        {/* Connector line */}
        <div className="relative flex items-center justify-between">
          {/* Background track */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
          {/* Progress fill */}
          <div
            className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
            style={{
              width: currentIdx === 0 ? "0%" : `${(currentIdx / (JOURNEY_STAGES.length - 1)) * 100}%`,
              background: "linear-gradient(90deg, #10b981, #3b82f6)",
            }}
          />

          {/* Stage dots */}
          {JOURNEY_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isFuture = idx > currentIdx;
            const isHovered = hoveredStage === stage;

            return (
              <div
                key={stage}
                className="relative z-10 flex flex-col items-center"
                style={{ flex: idx === 0 || idx === JOURNEY_STAGES.length - 1 ? "0 0 auto" : "1 1 0%" }}
              >
                {/* Dot */}
                <button
                  onClick={() => onStageClick?.(stage)}
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                  className={`
                    relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer
                    ${compact ? "h-6 w-6" : "h-8 w-8"}
                    ${isCompleted
                      ? "bg-emerald-500 border-2 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : isCurrent
                        ? "bg-blue-500 border-2 border-blue-400/50 shadow-[0_0_16px_rgba(59,130,246,0.5)] animate-moment-pulse"
                        : "bg-[var(--bg-elevated)] border-2 border-black/[0.08] dark:border-white/[0.08]"
                    }
                    ${isFuture ? "opacity-40" : ""}
                    ${onStageClick ? "hover:scale-110" : ""}
                  `}
                  title={JOURNEY_STAGE_LABELS[stage]}
                >
                  {isCompleted ? (
                    <svg
                      width={compact ? 10 : 12}
                      height={compact ? 10 : 12}
                      fill="white"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                  ) : isCurrent ? (
                    <span className={compact ? "text-[8px]" : "text-xs"}>{JOURNEY_STAGE_ICONS[stage]}</span>
                  ) : (
                    <div className={`rounded-full bg-black/5 dark:bg-white/10 ${compact ? "h-2 w-2" : "h-2.5 w-2.5"}`} />
                  )}
                </button>

                {/* Label (non-compact only) */}
                {!compact && (
                  <div className={`
                    absolute top-full mt-2 whitespace-nowrap text-center transition-all duration-200
                    ${isHovered || isCurrent ? "opacity-100" : "opacity-0 sm:opacity-60"}
                  `}>
                    <span className={`
                      text-[10px] font-medium
                      ${isCompleted ? "text-emerald-400" : isCurrent ? "text-blue-400" : "text-slate-500 dark:text-slate-500"}
                    `}>
                      {JOURNEY_STAGE_LABELS[stage]}
                    </span>
                  </div>
                )}

                {/* Tooltip on hover */}
                {isHovered && compact && (
                  <div className="absolute bottom-full mb-2 whitespace-nowrap rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] px-2.5 py-1 shadow-lg z-50 animate-in">
                    <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                      {JOURNEY_STAGE_ICONS[stage]} {JOURNEY_STAGE_LABELS[stage]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: compact horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
          {JOURNEY_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isFuture = idx > currentIdx;

            return (
              <React.Fragment key={stage}>
                {idx > 0 && (
                  <div className={`h-[2px] w-3 flex-shrink-0 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-black/[0.06] dark:bg-white/[0.06]"}`} />
                )}
                <button
                  onClick={() => onStageClick?.(stage)}
                  className={`
                    flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition-all
                    ${isCompleted
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : isCurrent
                        ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/25 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        : "text-slate-500 dark:text-slate-500 border border-transparent"
                    }
                    ${isFuture ? "opacity-40" : ""}
                  `}
                >
                  {isCompleted && (
                    <svg width="8" height="8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                  {isCurrent && <span>{JOURNEY_STAGE_ICONS[stage]}</span>}
                  {JOURNEY_STAGE_LABELS[stage]}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
