"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  type Journey,
  type JourneyStage,
  JOURNEY_STAGES,
  JOURNEY_STAGE_LABELS,
  JOURNEY_STAGE_ICONS,
} from "@/lib/types";

interface StageAdvancementProps {
  journey: Journey;
  onAdvanceStage: (journey: Journey) => void;
  onSetStage: (journey: Journey, stage: JourneyStage) => void;
}

export function StageAdvancement({ journey, onAdvanceStage, onSetStage }: StageAdvancementProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [closingDate, setClosingDate] = React.useState(journey.closingDate?.split("T")[0] ?? "");
  const currentIdx = JOURNEY_STAGES.indexOf(journey.stage);
  const isLast = currentIdx >= JOURNEY_STAGES.length - 1;
  const nextStage = isLast ? null : JOURNEY_STAGES[currentIdx + 1];
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-blue-400">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
            Stage Controls
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-600 mt-0.5">
            Advance the journey stage to trigger new referral moments
          </p>
        </div>
        <Badge variant="accent">
          {JOURNEY_STAGE_ICONS[journey.stage]} {JOURNEY_STAGE_LABELS[journey.stage]}
        </Badge>
      </div>

      {/* Next stage button */}
      <div className="flex items-center gap-2">
        {!isLast && nextStage && (
          <Button
            size="sm"
            onClick={() => onAdvanceStage(journey)}
            className="flex-1"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
              <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Advance to {JOURNEY_STAGE_LABELS[nextStage]}
          </Button>
        )}
        {isLast && (
          <div className="flex-1 text-center py-2">
            <Badge variant="success" className="text-xs">
              ✨ Journey Complete
            </Badge>
          </div>
        )}

        {/* Stage dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-xs"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-elevated)] z-50 overflow-hidden animate-in">
              <div className="p-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider px-2 py-1 mb-1">
                  Jump to Stage
                </div>
                {JOURNEY_STAGES.map((stage, idx) => {
                  const isCurrent = stage === journey.stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => {
                        onSetStage(journey, stage);
                        setShowDropdown(false);
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer
                        ${isCurrent
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      <span className="text-sm">{JOURNEY_STAGE_ICONS[stage]}</span>
                      <div className="flex-1">
                        <span className={`text-xs font-medium ${isCurrent ? "text-blue-400" : idx < currentIdx ? "text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                          {JOURNEY_STAGE_LABELS[stage]}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] text-blue-400 font-medium">Current</span>
                      )}
                      {idx < currentIdx && (
                        <svg width="10" height="10" fill="#10b981" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Closing date input */}
      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Closing Date (optional — enables time-based triggers)
        </label>
        <input
          type="date"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 focus:border-blue-500/40 focus:outline-none transition-colors"
        />
      </div>

      {/* Recent audit trail */}
      {journey.auditTrail.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <h4 className="text-[11px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-2">Recent Activity</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-none">
            {journey.auditTrail.slice(-4).reverse().map((entry) => (
              <div key={entry.id} className="flex items-start gap-2">
                <div className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                  entry.type === "stage_change" ? "bg-blue-400" :
                  entry.type === "moment_triggered" ? "bg-amber-400" :
                  entry.type === "role_filled" ? "bg-emerald-400" :
                  "bg-slate-300 dark:bg-slate-400 dark:bg-slate-500"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{entry.description}</p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-600">
                    {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
