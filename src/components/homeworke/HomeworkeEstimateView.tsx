"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockHomeworkeEstimate, type HomeworkeRepairItem } from "@/lib/mock-data-extended";

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  recommended: { label: "Recommended", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  optional: { label: "Optional", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
};

const categoryIcons: Record<string, string> = {
  structural: "🏗️",
  electrical: "⚡",
  plumbing: "🔧",
  hvac: "❄️",
  cosmetic: "🎨",
  exterior: "🏠",
  safety: "🛡️",
};

function formatCost(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function RepairItemCard({ item, selected, onToggle }: { item: HomeworkeRepairItem; selected: boolean; onToggle: () => void }) {
  const p = priorityConfig[item.priority];
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-amber-500/30 bg-amber-500/[0.05] shadow-[0_0_15px_rgba(245,158,11,0.08)]"
          : "border-[var(--border)] bg-[var(--bg-card)]/60 hover:border-[var(--border-hover)]"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition-all flex-shrink-0 ${
          selected ? "bg-amber-500 border-amber-500" : "border-[var(--border)] bg-transparent"
        }`}>
          {selected && (
            <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{categoryIcons[item.category] || "🔧"}</span>
            <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${p.bg} ${p.color}`}>
              {p.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm font-semibold text-amber-400">
              {formatCost(item.estimatedCostLow)} – {formatCost(item.estimatedCostHigh)}
            </span>
            <span className="text-[11px] text-slate-600">⏱ {item.timelineEstimate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeworkeEstimateView() {
  const estimate = mockHomeworkeEstimate;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = estimate.items.filter((item) => selectedIds.has(item.id));
  const selectedTotal = {
    low: selectedItems.reduce((sum, item) => sum + item.estimatedCostLow, 0),
    high: selectedItems.reduce((sum, item) => sum + item.estimatedCostHigh, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-r from-amber-500/[0.04] to-orange-500/[0.02] p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-400">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Powered by Homeworke
              </div>
              <Badge variant="success" className="text-[10px]">AI Estimate Ready</Badge>
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Repair & Renovation Estimates</h3>
            <p className="text-xs text-slate-500 mt-0.5">{estimate.propertyAddress}</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Range</div>
            <div className="text-lg font-bold text-amber-400">
              {formatCost(estimate.totalLow)} – {formatCost(estimate.totalHigh)}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-300">{estimate.items.length} items found</h4>
          <button
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            onClick={() => {
              if (selectedIds.size === estimate.items.length) {
                setSelectedIds(new Set());
              } else {
                setSelectedIds(new Set(estimate.items.map((i) => i.id)));
              }
            }}
          >
            {selectedIds.size === estimate.items.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        {estimate.items.map((item) => (
          <RepairItemCard
            key={item.id}
            item={item}
            selected={selectedIds.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>

      {/* Selected summary */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-4 rounded-2xl border border-amber-500/20 bg-[var(--bg-card)]/95 backdrop-blur-xl p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.3)] animate-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs text-slate-500">{selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected</div>
              <div className="text-lg font-bold text-amber-400">
                {formatCost(selectedTotal.low)} – {formatCost(selectedTotal.high)}
              </div>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Get Matched with Top 3 Contractors
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
