"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { eventCatalog } from "@/lib/mock-webhook-data";
import type { EventCategory } from "@/lib/types";

/* ── Category Icons ──────────────────────────────────────────── */

const CATEGORY_META: Record<EventCategory, { icon: string; color: string; gradient: string }> = {
  Person: { icon: "👤", color: "text-blue-400", gradient: "from-blue-500/10 to-blue-600/5" },
  Journey: { icon: "🗺️", color: "text-emerald-400", gradient: "from-emerald-500/10 to-emerald-600/5" },
  Booking: { icon: "📅", color: "text-violet-400", gradient: "from-violet-500/10 to-violet-600/5" },
  Documents: { icon: "📄", color: "text-amber-400", gradient: "from-amber-500/10 to-amber-600/5" },
  Messaging: { icon: "💬", color: "text-cyan-400", gradient: "from-cyan-500/10 to-cyan-600/5" },
  Verification: { icon: "✅", color: "text-green-400", gradient: "from-green-500/10 to-green-600/5" },
};

const CATEGORIES: EventCategory[] = ["Person", "Journey", "Booking", "Documents", "Messaging", "Verification"];

/* ── Syntax Highlighted JSON ─────────────────────────────────── */

function JsonBlock({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data, null, 2);

  // Simple syntax highlighting
  const highlighted = json
    .replace(/"([^"]+)":/g, '<span class="text-blue-700 dark:text-blue-300">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="text-emerald-700 dark:text-emerald-400">"$1"</span>')
    .replace(/: (\d+)/g, ': <span class="text-amber-600 dark:text-amber-400">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="text-violet-400">$1</span>');

  return (
    <div className="liquid-glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-500 ml-2">Sample Payload</span>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(json)}
          className="text-[11px] text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre
          className="text-xs font-mono leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}

/* ── Event Type Card ─────────────────────────────────────────── */

function EventTypeCard({ entry }: { entry: (typeof eventCatalog)[number] }) {
  const [expanded, setExpanded] = React.useState(false);
  const catMeta = CATEGORY_META[entry.category];

  return (
    <div className="group">
      <Card
        hover
        padding="none"
        className={`overflow-hidden transition-all duration-300 ${expanded ? "ring-1 ring-blue-500/20 border-blue-500/15" : ""}`}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-5 py-4 flex items-start gap-4"
        >
          <div className="mt-0.5 shrink-0">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${catMeta.gradient} flex items-center justify-center text-sm border border-black/[0.06] dark:border-white/[0.06]`}>
              {catMeta.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">{entry.type}.{entry.version}</code>
              <Badge variant="accent">{entry.category}</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{entry.description}</p>
          </div>
          <svg
            className={`w-4 h-4 text-slate-600 dark:text-slate-500 transition-transform duration-200 mt-1 shrink-0 ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Content */}
        {expanded && (
          <div className="px-5 pb-5 animate-in space-y-4">
            {/* Trigger conditions */}
            <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-500 mb-1">Trigger Conditions</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{entry.triggerConditions}</p>
            </div>

            {/* Sample Payload */}
            <JsonBlock data={entry.samplePayload} />

            {/* Webhook Headers */}
            <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-500 mb-2">HTTP Headers</div>
              <div className="space-y-1 text-xs font-mono">
                <div><span className="text-slate-600 dark:text-slate-500">Content-Type:</span> <span className="text-slate-700 dark:text-slate-300">application/json</span></div>
                <div><span className="text-slate-600 dark:text-slate-500">X-Relays-Event:</span> <span className="text-blue-400">{entry.type}</span></div>
                <div><span className="text-slate-600 dark:text-slate-500">X-Relays-Signature:</span> <span className="text-emerald-600 dark:text-emerald-400/60">sha256=...</span></div>
                <div><span className="text-slate-600 dark:text-slate-500">X-Relays-Delivery:</span> <span className="text-slate-600 dark:text-slate-400">del_...</span></div>
                <div><span className="text-slate-600 dark:text-slate-500">X-Relays-Timestamp:</span> <span className="text-slate-600 dark:text-slate-400">2026-02-16T14:30:00Z</span></div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ══  EVENT CATALOG PAGE  ════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════ */

export default function EventCatalogPage() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<EventCategory | "all">("all");

  const filtered = eventCatalog.filter((entry) => {
    const matchesSearch = !search ||
      entry.type.toLowerCase().includes(search.toLowerCase()) ||
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "all" || entry.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/8 border border-blue-500/15 px-3 py-1 text-xs text-blue-500 dark:text-blue-400 mb-4">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Relays Events API · v1
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Event Catalog</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Subscribe to real-time events via webhooks. Every event is versioned, signed with HMAC-SHA256, and includes an idempotency key.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none transition-all focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)]"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeCategory === "all"
                ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30"
                : "bg-black/[0.03] dark:bg-white/[0.03] text-slate-600 dark:text-slate-500 border border-black/[0.06] dark:border-white/[0.06] hover:border-black/10 dark:border-white/10 hover:text-slate-700 dark:hover:text-slate-400"
            }`}
          >
            All ({eventCatalog.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = eventCatalog.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30"
                    : "bg-black/[0.03] dark:bg-white/[0.03] text-slate-600 dark:text-slate-500 border border-black/[0.06] dark:border-white/[0.06] hover:border-black/10 dark:border-white/10 hover:text-slate-700 dark:hover:text-slate-400"
                }`}
              >
                <span>{CATEGORY_META[cat].icon}</span>
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Grid */}
      {filtered.length > 0 ? (
        <div className="space-y-3 stagger-children">
          {filtered.map((entry) => (
            <EventTypeCard key={entry.type} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-slate-600 dark:text-slate-400">No events match &quot;{search}&quot;</p>
          <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2">
            Clear filters
          </button>
        </div>
      )}

      {/* Footer — Verification & Security */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Card padding="lg" className="border-emerald-500/10">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Signed Webhooks</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 leading-relaxed">
                Every delivery is signed with HMAC-SHA256 using your endpoint secret. Verify the <code className="text-emerald-600 dark:text-emerald-400/80 bg-emerald-500/5 px-1 rounded">X-Relays-Signature</code> header before processing.
              </p>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="border-blue-500/10">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Automatic Retries</h3>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 leading-relaxed">
                Failed deliveries retry up to 5 times with exponential backoff (1m → 4m → 16m → 1h → 4h). Idempotency keys prevent duplicate processing.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
