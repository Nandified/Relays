"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getProByUsername,
  getProById,
  getGroupBySlug,
  getDefaultGroupForPro,
  getGroupPartnersByCategory,
} from "@/lib/mock-data";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";
import type { CuratedGroup, ProServiceCategory } from "@/lib/types";

const CATEGORY_META: Record<string, { icon: string; label: string; color: string; colorBg: string }> = {
  "Mortgage Lender": { icon: "💰", label: "Lending", color: "text-emerald-400", colorBg: "bg-emerald-500/10 border-emerald-500/20" },
  Attorney: { icon: "⚖️", label: "Legal", color: "text-purple-400", colorBg: "bg-purple-500/10 border-purple-500/20" },
  "Home Inspector": { icon: "🔍", label: "Inspection", color: "text-amber-400", colorBg: "bg-amber-500/10 border-amber-500/20" },
  "Insurance Agent": { icon: "🛡️", label: "Insurance", color: "text-cyan-400", colorBg: "bg-cyan-500/10 border-cyan-500/20" },
};

const DISPLAY_CATEGORIES: ProServiceCategory[] = [
  "Mortgage Lender",
  "Attorney",
  "Home Inspector",
  "Insurance Agent",
];

function CategorySection({
  category,
  group,
}: {
  category: ProServiceCategory;
  group: CuratedGroup;
}) {
  const meta = CATEGORY_META[category];
  const partners = getGroupPartnersByCategory(group, category);
  if (partners.length === 0) return null;

  const pros = partners
    .slice(0, 3)
    .map((p) => getProById(p.proId))
    .filter(Boolean);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${meta.colorBg} text-sm`}>
          {meta.icon}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{meta.label}</h3>
      </div>
      <div className="space-y-2">
        {pros.map((pro, idx) => {
          if (!pro) return null;
          return (
            <Link key={pro.id} href={`/pros/${pro.slug}`}>
              <div className="glass-card rounded-2xl p-4 cursor-pointer mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                      <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
                    </div>
                    {/* Subtle position indicator */}
                    <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[9px] font-bold text-slate-600 dark:text-slate-400">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{pro.name}</span>
                      {pro.verified && (
                        <Badge variant="success" className="text-[9px] py-0">✓</Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-500">{pro.companyName}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs text-amber-400">
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                        </svg>
                        {pro.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-500">{pro.reviewCount} reviews</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="h-9 w-9 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                      <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function SharePageContent({
  username,
  groupSlug,
}: {
  username: string;
  groupSlug?: string;
}) {
  const pro = getProByUsername(username);

  if (!pro) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Professional not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This profile link doesn&apos;t exist.</p>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-blue-500 dark:text-blue-400 hover:underline">
          Browse Marketplace →
        </Link>
      </main>
    );
  }

  // Resolve group: slug → specific group, or fall back to default
  let activeGroup: CuratedGroup | undefined;
  if (groupSlug) {
    activeGroup = getGroupBySlug(pro.id, groupSlug);
  }
  if (!activeGroup) {
    activeGroup = getDefaultGroupForPro(pro.id);
  }

  // If we have a group, show grouped partners. Otherwise fall back to topThree.
  const hasGroup = !!activeGroup;
  const topThreePros = !hasGroup
    ? pro.topThree.map(getProById).filter(Boolean)
    : [];

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      {/* Pro header */}
      <Card padding="lg" className="text-center shadow-[var(--shadow-elevated)] mb-6 glow-hover">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-2 border-[var(--bg-card)] shadow-md bg-[var(--bg-elevated)]">
              <Image src={pro.headshotUrl} alt={pro.name} width={96} height={96} />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 overflow-hidden rounded-xl border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)] shadow-sm">
              <Image src={pro.companyLogoUrl} alt={pro.companyName} width={40} height={40} />
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{pro.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-500">{pro.companyName}</p>

        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="14" height="14" fill={star <= Math.round(pro.rating) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">{pro.rating.toFixed(1)} ({pro.reviewCount})</span>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {pro.categories.map((cat) => (
            <Badge key={cat} variant="outline">{cat}</Badge>
          ))}
          {pro.verified && <Badge variant="success">✓ Verified</Badge>}
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{pro.blurb}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-500">
          {pro.serviceAreas.map((area, i) => (
            <span key={area}>
              {area}{i < pro.serviceAreas.length - 1 ? " •" : ""}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-2">
          <Link href={`/pros/${pro.slug}`}>
            <Button className="w-full">View Full Profile</Button>
          </Link>
          <SoftWallGate action="request_booking" context={{ proSlug: pro.slug, from: "share" }}>
            {(_authed, begin) => (
              <Button variant="secondary" className="w-full" onClick={begin}>
                Request Booking
              </Button>
            )}
          </SoftWallGate>
        </div>
      </Card>

      {/* Group-based curated partners (NO group labels visible to client) */}
      {hasGroup && activeGroup && (
        <div>
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-4 text-center">
            Recommended Professionals
          </h2>
          {DISPLAY_CATEGORIES.map((cat) => (
            <CategorySection key={cat} category={cat} group={activeGroup} />
          ))}
        </div>
      )}

      {/* Legacy fallback: plain topThree list */}
      {!hasGroup && topThreePros.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-3 text-center">
            Recommended Professionals
          </h2>
          <div className="space-y-3">
            {topThreePros.map((recPro) => {
              if (!recPro) return null;
              return (
                <Link key={recPro.id} href={`/pros/${recPro.slug}`}>
                  <Card hover padding="none" className="p-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                        <Image src={recPro.headshotUrl} alt={recPro.name} width={48} height={48} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{recPro.name}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-500">{recPro.companyName}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recPro.categories.map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                        <Image src={recPro.companyLogoUrl} alt={recPro.companyName} width={36} height={36} />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Powered by Relays */}
      <div className="mt-10 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 transition-colors">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--accent)] text-[8px] font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]">R</div>
          Powered by Relays
        </Link>
      </div>
    </main>
  );
}
