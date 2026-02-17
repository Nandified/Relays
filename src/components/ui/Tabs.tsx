"use client";

import * as React from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-2xl bg-black/5 dark:bg-white/5 p-1 border border-[var(--border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all
            ${activeId === tab.id
              ? "bg-[var(--bg-card)] text-slate-900 dark:text-slate-100 shadow-sm border border-[var(--border)]"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs ${activeId === tab.id ? "text-[var(--accent)]" : "text-slate-500 dark:text-slate-600"}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
