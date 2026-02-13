"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  lastLoaded: string | null;
}

interface ImportResult {
  success: boolean;
  importedCount: number;
  message: string;
  filename: string;
}

const CATEGORIES = [
  "Realtor",
  "Home Inspector",
  "Mortgage Lender",
  "Insurance Agent",
  "Attorney",
];

export default function DataImportPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [file, setFile] = React.useState<File | null>(null);
  const [category, setCategory] = React.useState(CATEGORIES[0]);
  const [preview, setPreview] = React.useState<string[][] | null>(null);
  const [headers, setHeaders] = React.useState<string[] | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Load stats on mount
  React.useEffect(() => {
    fetch("/api/professionals/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Parse CSV preview when file selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setPreview(null);
        setHeaders(null);
        return;
      }

      const parseLine = (line: string) => line.split(",").map((f) => f.trim().replace(/^"|"$/g, ""));
      setHeaders(parseLine(lines[0]));
      setPreview(lines.slice(1, 6).map(parseLine));
    };
    reader.readAsText(f);
  };

  // Handle import
  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const res = await fetch("/api/professionals/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        // Refresh stats
        const statsRes = await fetch("/api/professionals/stats");
        const newStats = await statsRes.json();
        setStats(newStats);
        // Clear form
        setFile(null);
        setPreview(null);
        setHeaders(null);
      } else {
        setError(data.error || "Import failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Data Import</h1>
        <p className="mt-1 text-sm text-slate-500">
          Import IDFPR license data and manage professional records.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total records */}
        <Card padding="md">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Records</div>
          <div className="mt-1 text-2xl font-bold text-slate-100">
            {loading ? (
              <div className="h-8 w-20 rounded bg-white/5 animate-pulse" />
            ) : (
              stats?.total.toLocaleString() ?? "—"
            )}
          </div>
          {stats?.lastLoaded && (
            <div className="mt-1 text-[11px] text-slate-600">
              Loaded: {new Date(stats.lastLoaded).toLocaleString()}
            </div>
          )}
        </Card>

        {/* Per-category stats */}
        {!loading && stats && Object.entries(stats.byCategory).map(([cat, count]) => (
          <Card key={cat} padding="md">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{cat}</div>
              <Badge variant="outline" className="text-[10px]">{cat}</Badge>
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-100">
              {count.toLocaleString()}
            </div>
          </Card>
        ))}
      </div>

      {/* Import form */}
      <Card padding="lg">
        <h2 className="text-base font-semibold text-slate-100 mb-4">Import CSV</h2>

        <div className="space-y-4">
          {/* Category selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* File input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">CSV File</label>
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)]/50 p-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto text-slate-500 mb-2">
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                </svg>
                <p className="text-sm text-slate-400">
                  {file ? file.name : "Click to upload or drag & drop"}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">CSV files only</p>
              </label>
            </div>
          </div>

          {/* CSV Preview */}
          {headers && preview && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Preview (first {preview.length} rows)
              </label>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/30">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      {headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-medium text-slate-400 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-[var(--border)] last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-slate-500 whitespace-nowrap max-w-[200px] truncate">
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

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/8 border border-red-500/15 px-3 py-2.5 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {result && (
            <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-xs font-medium text-emerald-400">{result.message}</span>
              </div>
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
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Importing...
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
                </svg>
                Import CSV
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Info card */}
      <Card padding="md" className="opacity-70">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Expected CSV Format</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          CSV files should include headers matching IDFPR data format:{" "}
          <code className="text-violet-400/80">name, license_number, type, company, city, state, zip, county, licensed_since, expires, disciplined</code>.
          The <code className="text-violet-400/80">type</code> column determines the professional category mapping.
          Brokerages (is_business=True) and appraisers are automatically skipped.
        </p>
      </Card>
    </div>
  );
}
