"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockImportHistory, mockStateDataStats } from "@/lib/mock-admin-data";

const CATEGORIES = [
  "Realtor",
  "Home Inspector",
  "Mortgage Lender",
  "Insurance Agent",
  "Attorney",
];

const categoryColors: Record<string, string> = {
  Realtor: "#8b5cf6",
  "Home Inspector": "#3b82f6",
  Attorney: "#f59e0b",
  "Mortgage Lender": "#10b981",
  "Insurance Agent": "#ec4899",
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelative(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export default function DataImportPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [category, setCategory] = React.useState(CATEGORIES[0]);
  const [preview, setPreview] = React.useState<string[][] | null>(null);
  const [headers, setHeaders] = React.useState<string[] | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [importSuccess, setImportSuccess] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const totalRecords = mockStateDataStats.reduce((s, st) => s + st.totalRecords, 0);
  const totalCategories = mockStateDataStats.reduce(
    (s, st) => s + Object.keys(st.categories).length,
    0
  );

  const handleFileChange = (f: File) => {
    setFile(f);
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setPreview(null);
        setHeaders(null);
        return;
      }
      const parseLine = (line: string) =>
        line
          .split(",")
          .map((f) => f.trim().replace(/^"|"$/g, ""));
      setHeaders(parseLine(lines[0]));
      setPreview(lines.slice(1, 6).map(parseLine));
    };
    reader.readAsText(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) handleFileChange(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    // Simulate import
    await new Promise((r) => setTimeout(r, 2000));
    setImporting(false);
    setImportSuccess(true);
    setFile(null);
    setPreview(null);
    setHeaders(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Data Import</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Import state license data and manage professional records across states.
        </p>
      </div>

      {/* ── Summary Stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-violet-500/10 bg-gradient-to-b from-violet-500/8 to-transparent p-4">
          <div className="text-2xl font-bold text-violet-400 tabular-nums">
            {totalRecords.toLocaleString()}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Total Records</div>
        </div>
        <div className="rounded-2xl border border-blue-500/10 bg-gradient-to-b from-blue-500/8 to-transparent p-4">
          <div className="text-2xl font-bold text-blue-500 dark:text-blue-400 tabular-nums">
            {mockStateDataStats.length}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">States Loaded</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/10 bg-gradient-to-b from-emerald-500/8 to-transparent p-4">
          <div className="text-2xl font-bold text-emerald-400 tabular-nums">
            {totalCategories}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Category Types</div>
        </div>
        <div className="rounded-2xl border border-amber-500/10 bg-gradient-to-b from-amber-500/8 to-transparent p-4">
          <div className="text-2xl font-bold text-amber-400 tabular-nums">
            {mockImportHistory.length}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Total Imports</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* ── Left: State Data + Import History ─────────────────── */}
        <div className="space-y-6">
          {/* State-by-State Data Status */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              State Data Overview
            </h2>
            <div className="space-y-3">
              {mockStateDataStats.map((state) => {
                const maxCatValue = Math.max(
                  ...Object.values(state.categories),
                  1
                );
                return (
                  <Card
                    key={state.stateCode}
                    padding="none"
                    className="glow-violet overflow-hidden"
                  >
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/10 text-sm font-bold text-violet-400">
                            {state.stateCode}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {state.state}
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400">
                              Updated {formatRelative(state.lastUpdated)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                            {state.totalRecords.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-400">
                            total records
                          </div>
                        </div>
                      </div>

                      {/* Category breakdown bars */}
                      <div className="space-y-2">
                        {Object.entries(state.categories).map(
                          ([cat, count]) => (
                            <div
                              key={cat}
                              className="flex items-center gap-3"
                            >
                              <span className="text-[11px] text-slate-600 dark:text-slate-400 w-28 truncate text-right">
                                {cat}
                              </span>
                              <div className="flex-1 h-3 rounded-full bg-black/[0.04] dark:bg-white/[0.04] overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${(count / maxCatValue) * 100}%`,
                                    backgroundColor:
                                      categoryColors[cat] || "#8b5cf6",
                                  }}
                                />
                              </div>
                              <span className="text-[11px] text-slate-600 dark:text-slate-400 w-12 text-right tabular-nums font-medium">
                                {count.toLocaleString()}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Placeholder for upcoming states */}
              <Card padding="none" className="overflow-hidden opacity-50">
                <div className="px-5 py-6 text-center">
                  <div className="text-slate-500 dark:text-slate-400 mb-2">
                    <svg
                      width="28"
                      height="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      className="mx-auto"
                    >
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    More states coming soon — Indiana, Wisconsin, Michigan
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Import History */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Import History
            </h2>
            <Card padding="none" className="overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_100px_80px_90px_80px_70px] gap-3 items-center border-b border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5">
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  File
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Category
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Records
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Imported By
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Date
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Status
                </div>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {mockImportHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="sm:grid sm:grid-cols-[1fr_100px_80px_90px_80px_70px] gap-3 items-center px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.04] dark:bg-white/[0.04] text-slate-600 dark:text-slate-400">
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {entry.filename}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {entry.state} · {entry.duration}s
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 sm:mt-0">
                      <Badge variant="outline" className="text-[10px]">
                        {entry.category}
                      </Badge>
                    </div>
                    <div className="mt-1 sm:mt-0 text-sm text-slate-700 dark:text-slate-300 tabular-nums font-medium">
                      {entry.recordCount.toLocaleString()}
                    </div>
                    <div className="mt-1 sm:mt-0 text-xs text-slate-600 dark:text-slate-400 truncate">
                      {entry.importedBy}
                    </div>
                    <div className="mt-1 sm:mt-0 text-[11px] text-slate-600 dark:text-slate-400">
                      {formatRelative(entry.importedAt)}
                    </div>
                    <div className="mt-1 sm:mt-0">
                      {entry.status === "completed" && (
                        <Badge variant="success" className="text-[10px]">
                          Done
                        </Badge>
                      )}
                      {entry.status === "running" && (
                        <Badge variant="warning" className="text-[10px]">
                          Running
                        </Badge>
                      )}
                      {entry.status === "failed" && (
                        <Badge variant="danger" className="text-[10px]">
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Right: Upload Zone ────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Import CSV
          </h2>

          {/* Category selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Upload */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              dragOver
                ? "border-violet-500/50 bg-violet-500/5 scale-[1.02]"
                : "border-[var(--border)] bg-[var(--bg-elevated)]/30 hover:border-black/10 dark:border-white/10"
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                  dragOver
                    ? "bg-violet-500/15 text-violet-400"
                    : "bg-black/[0.04] dark:bg-white/[0.04] text-slate-600 dark:text-slate-400"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                </svg>
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Drop CSV here or{" "}
                    <span className="text-violet-400 font-medium">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    CSV files up to 50MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* CSV Preview */}
          {headers && preview && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Preview ({preview.length} rows)
              </label>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/30">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-2.5 py-2 text-left font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--border)] last:border-0"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-2.5 py-1.5 text-slate-600 dark:text-slate-400 whitespace-nowrap max-w-[120px] truncate"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success message */}
          {importSuccess && (
            <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-4 py-3 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-xs font-medium text-emerald-400">
                Import completed successfully!
              </span>
            </div>
          )}

          {/* Import button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={handleImport}
            disabled={!file || importing}
          >
            {importing ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Importing...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                </svg>
                Import CSV
              </>
            )}
          </Button>

          {/* Expected format info */}
          <Card padding="sm" className="opacity-60">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Expected CSV Format
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Headers:{" "}
              <code className="text-violet-400/70">
                name, license_number, type, company, city, state, zip, county,
                licensed_since, expires, disciplined
              </code>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
