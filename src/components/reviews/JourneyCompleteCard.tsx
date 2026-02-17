"use client";

import { useState } from "react";
import Link from "next/link";
import { type Journey } from "@/lib/types";
import { getProById } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";

interface JourneyCompleteCardProps {
  journey: Journey;
  onDismiss?: () => void;
}

export function JourneyCompleteCard({
  journey,
  onDismiss,
}: JourneyCompleteCardProps) {
  const [showPros, setShowPros] = useState(false);

  const filledPros = journey.roles
    .filter((r) => r.status === "filled" && r.assignedProId)
    .map((r) => ({
      pro: getProById(r.assignedProId!),
      category: r.category,
    }))
    .filter((r) => r.pro);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-blue-500/[0.02] p-6 sm:p-8">
      {/* Celebration background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-60 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-blue-500/6 blur-3xl" />
      </div>

      <div className="relative">
        {/* Celebration header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="absolute -inset-3 rounded-full bg-emerald-500/10 animate-ping-slow" />
            <div className="relative text-4xl">🏠</div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Journey Complete!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Congratulations on closing{" "}
            <span className="text-emerald-400 font-medium">
              {journey.title}
            </span>
          </p>
          <Badge variant="success" className="mt-2">
            ✨ All 5 roles filled
          </Badge>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-3 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">5/5</div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400">Team Members</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-3 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {journey.auditTrail.length}
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400">Milestones</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">✓</div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400">Closed</div>
          </div>
        </div>

        {/* Review your team */}
        <div className="text-center">
          <button
            onClick={() => setShowPros(!showPros)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
          >
            {showPros ? "Hide" : "Review your team"}{" "}
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className={`inline ml-0.5 transition-transform ${showPros ? "rotate-180" : ""}`}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Pro list for review */}
        {showPros && (
          <div className="mt-4 space-y-2 animate-in">
            {filledPros.map(({ pro, category }) =>
              pro ? (
                <div
                  key={pro.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
                      <Image
                        src={pro.headshotUrl}
                        alt={pro.name}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {pro.name}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {category}
                      </div>
                    </div>
                  </div>
                  <Link href={`/review/${pro.slug}`}>
                    <Button size="sm" variant="secondary">
                      <svg
                        width="10"
                        height="10"
                        fill="#f59e0b"
                        viewBox="0 0 20 20"
                        className="mr-1"
                      >
                        <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                      </svg>
                      Review
                    </Button>
                  </Link>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Dismiss */}
        {onDismiss && (
          <div className="text-center mt-4">
            <button
              onClick={onDismiss}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
