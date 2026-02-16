"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { mockPostCloseChecklist, type PostCloseChecklistItem } from "@/lib/mock-data-extended";
import { HomeworkeCrossSellCard } from "@/components/homeworke/HomeworkeCrossSellCard";

function ChecklistItem({ item, checked, onToggle }: { item: PostCloseChecklistItem; checked: boolean; onToggle: () => void }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
        checked
          ? "border-emerald-500/15 bg-emerald-500/[0.03] opacity-70"
          : "border-[var(--border)] bg-[var(--bg-card)]/60 hover:border-[var(--border-hover)]"
      }`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border transition-all flex-shrink-0 cursor-pointer ${
          checked ? "bg-emerald-500 border-emerald-500" : "border-[var(--border)] hover:border-emerald-500/40"
        }`}
      >
        {checked && (
          <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base">{item.icon}</span>
          <h4 className={`text-sm font-medium transition-all ${checked ? "text-slate-500 line-through" : "text-slate-200"}`}>
            {item.title}
          </h4>
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
        {item.link && item.linkLabel && !checked && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors"
          >
            {item.linkLabel}
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export function PostCloseBanner({ clientName }: { clientName: string }) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter out the homeworke item — it gets its own section
  const checklistItems = mockPostCloseChecklist.filter((i) => i.category !== "homeworke");
  const completedCount = checkedItems.size;
  const totalCount = checklistItems.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group by category
  const grouped: Record<string, PostCloseChecklistItem[]> = {};
  for (const item of checklistItems) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const categoryLabels: Record<string, { label: string; icon: string }> = {
    utilities: { label: "Transfer Utilities", icon: "⚡" },
    address: { label: "Change of Address", icon: "📬" },
    warranty: { label: "Home Protection", icon: "🛡️" },
    maintenance: { label: "Home Maintenance", icon: "🔧" },
  };

  return (
    <div className="space-y-6">
      {/* Celebration Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-teal-500/10">
        {/* Confetti-like particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-[15%] h-2 w-2 rounded-full bg-emerald-400/30 animate-float-breathe" />
          <div className="absolute top-8 right-[20%] h-1.5 w-1.5 rounded-full bg-amber-400/30 animate-float-breathe" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-6 left-[40%] h-2 w-2 rounded-full bg-blue-400/30 animate-float-breathe" style={{ animationDelay: "2s" }} />
          <div className="absolute top-12 left-[60%] h-1.5 w-1.5 rounded-full bg-purple-400/25 animate-float-breathe" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-8 right-[30%] h-2 w-2 rounded-full bg-pink-400/25 animate-float-breathe" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.1),transparent_70%)]" />

        <div className="relative p-6 sm:p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Congratulations on your new home!
          </h2>
          <p className="text-sm text-emerald-200/70 max-w-md mx-auto">
            Welcome home, {clientName}! Here&apos;s everything you need to get settled in. Check off each item as you complete it.
          </p>

          {/* Progress bar */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-emerald-300/60">{completedCount} of {totalCount} completed</span>
              <span className="font-semibold text-emerald-400">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Checklist sections */}
      {Object.entries(grouped).map(([category, items]) => {
        const meta = categoryLabels[category] || { label: category, icon: "📋" };
        return (
          <div key={category}>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>{meta.icon}</span>
              {meta.label}
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={checkedItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Homeworke Cross-Sell */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>🏗️</span>
          Repairs & Renovations
        </h3>
        <HomeworkeCrossSellCard />
      </div>
    </div>
  );
}
