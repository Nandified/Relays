"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { type UnclaimedProfessional } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProfessionalProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [professional, setProfessional] = React.useState<UnclaimedProfessional | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    async function fetchProfessional() {
      try {
        const res = await fetch(`/api/professionals/${params.id}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setProfessional(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfessional();
  }, [params.id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 h-4 w-24 rounded bg-white/5 animate-pulse" />
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-3xl bg-white/5 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-64 rounded bg-white/[0.03] animate-pulse" />
              <div className="h-4 w-36 rounded bg-white/[0.03] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !professional) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-100">Professional not found</h1>
        <p className="mt-2 text-sm text-slate-400">This profile doesn&apos;t exist or has been removed.</p>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
          ← Back to Marketplace
        </Link>
      </main>
    );
  }

  const initials = professional.name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const isExpired = professional.expires
    ? new Date(professional.expires) < new Date()
    : false;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Back / Close */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to browsing
      </button>

      {/* Profile header card */}
      <Card padding="lg" className="shadow-[var(--shadow-elevated)]">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl border border-[var(--border)] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-2xl font-bold text-slate-300">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{professional.name}</h1>
              <Badge variant="success" className="flex items-center gap-1">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Licensed
              </Badge>
            </div>

            {professional.company && (
              <p className="mt-1 text-sm text-slate-400">{professional.company}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{professional.category}</Badge>
              <span className="text-xs text-slate-500">
                {[professional.city, professional.state].filter(Boolean).join(", ")}
                {professional.zip ? ` ${professional.zip}` : ""}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* License details card */}
      <Card padding="lg" className="mt-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          License Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LicenseField label="License Number" value={professional.licenseNumber} />
          <LicenseField label="License Type" value={professional.licenseType} />
          <LicenseField label="Licensed Since" value={formatDate(professional.licensedSince)} />
          <LicenseField
            label="Expires"
            value={formatDate(professional.expires)}
            alert={isExpired}
          />
          {professional.county && (
            <LicenseField label="County" value={professional.county} />
          )}
          <LicenseField
            label="Disciplinary Action"
            value={professional.disciplined ? "Yes" : "None"}
            alert={professional.disciplined}
          />
        </div>
      </Card>

      {/* Enrichment data (if available) */}
      {(professional.phone || professional.email || professional.website) && (
        <Card padding="lg" className="mt-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Contact Information
          </h2>
          <div className="space-y-3">
            {professional.phone && (
              <div className="flex items-center gap-3 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <a href={`tel:${professional.phone}`} className="text-blue-400 hover:underline">{professional.phone}</a>
              </div>
            )}
            {professional.email && (
              <div className="flex items-center gap-3 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href={`mailto:${professional.email}`} className="text-blue-400 hover:underline">{professional.email}</a>
              </div>
            )}
            {professional.website && (
              <div className="flex items-center gap-3 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{professional.website}</a>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* CTA */}
      <Card padding="lg" className="mt-4">
        <div className="text-center">
          <h3 className="text-base font-semibold text-slate-200">Is this you?</h3>
          <p className="mt-1 text-sm text-slate-400">
            Claim this profile to manage your presence on Relays, get verified, and connect with clients.
          </p>
          <Button variant="primary" size="lg" className="mt-4">
            Claim This Profile
          </Button>
        </div>
      </Card>
    </main>
  );
}

/* ── Helper components ─────────────────────────────────────────── */

function LicenseField({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</dt>
      <dd className={`mt-0.5 text-sm font-medium ${alert ? "text-red-400" : "text-slate-200"}`}>
        {value || "—"}
      </dd>
    </div>
  );
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}
