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
    <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all
            ${activeId === tab.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs ${activeId === tab.id ? "text-[var(--accent)]" : "text-slate-400"}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
