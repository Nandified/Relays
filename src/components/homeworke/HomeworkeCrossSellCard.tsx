"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function HomeworkeCrossSellCard() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.04] via-orange-500/[0.02] to-amber-600/[0.04]">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(234,88,12,0.08),transparent_70%)]" />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xl">
              🏗️
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Need Repairs or Renovations?</h3>
              <p className="text-xs text-slate-500 mt-0.5">Get instant estimates for any home project</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/15 px-3 py-1 text-[10px] font-medium text-amber-400">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by Homeworke
          </div>
        </div>

        {/* Value prop */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          Your inspection report revealed items that may need attention. Upload it to get AI-powered estimates and connect with top-rated contractors in your area — in minutes, not days.
        </p>

        {/* Features */}
        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          {[
            { icon: "📄", title: "Upload Report", desc: "Drop your inspection report" },
            { icon: "🤖", title: "AI Estimates", desc: "Instant cost breakdowns" },
            { icon: "👷", title: "Top Contractors", desc: "Matched to your area" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-4 text-center">
              <span className="text-xl">{f.icon}</span>
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-2">{f.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>

        {!showUpload ? (
          <Button
            onClick={() => setShowUpload(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]"
            size="lg"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            Get Your Free Estimate
          </Button>
        ) : (
          <div className="animate-in">
            {/* Upload zone */}
            <div className="rounded-2xl border-2 border-dashed border-amber-500/20 bg-amber-500/[0.03] p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/15">
                <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Drop your inspection report here</p>
              <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG up to 25MB</p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                Analyze Report
              </Button>
            </div>
          </div>
        )}

        {/* Co-branding */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-600">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-amber-400/60">Homeworke</span>
            ×
            <span className="font-semibold text-blue-400/60">Relays</span>
          </span>
          <span>•</span>
          <span>Estimates are AI-generated and may vary</span>
        </div>
      </div>
    </div>
  );
}
