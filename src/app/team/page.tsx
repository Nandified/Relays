"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockTeam, getProById } from "@/lib/mock-data";
import { type ProServiceCategory } from "@/lib/types";

const roleOrder: ProServiceCategory[] = [
  "Realtor",
  "Mortgage Lender",
  "Home Inspector",
  "Attorney",
  "Insurance Agent",
];

export default function TeamPage() {
  const byRole = roleOrder.reduce((acc, role) => {
    const members = mockTeam.filter((m) => m.role === role);
    if (members.length > 0) acc.push({ role, members });
    return acc;
  }, [] as { role: ProServiceCategory; members: typeof mockTeam }[]);

  const filledRoles = new Set(mockTeam.map((m) => m.role));
  const emptyRoles = roleOrder.filter((r) => !filledRoles.has(r));

  const totalRoles = roleOrder.length;
  const filledCount = filledRoles.size;
  const progress = totalRoles === 0 ? 0 : Math.round((filledCount / totalRoles) * 100);

  const emptyRoleCopy: Record<ProServiceCategory, string> = {
    Realtor: "Every journey starts with a great agent",
    "Mortgage Lender": "Get pre-approved to make your offer stronger",
    Attorney: "Protect your interests at closing",
    "Home Inspector": "Know exactly what you're buying",
    "Insurance Agent": "Protect your investment from day one",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {filledCount < totalRoles && (
        <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
          <span className="text-slate-800 dark:text-slate-200">Complete your team</span> to be ready for every step of your home journey
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Dream Team</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mockTeam.length} professional{mockTeam.length !== 1 ? "s" : ""} on your team
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-12">
              <svg viewBox="0 0 36 36" className="h-12 w-12 text-[var(--accent)]">
                <path
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="3"
                  opacity="0.35"
                />
                <path
                  d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${progress}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                {filledCount}/{totalRoles}
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500 tabular-nums">{filledCount} of {totalRoles} roles filled</div>
            <div className="mt-1 text-[11px] text-slate-500 tabular-nums">Your team is {filledCount}/{totalRoles} complete</div>
          </div>

          <Link href="/marketplace">
            <Button size="sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Add Pro
            </Button>
          </Link>
        </div>
      </div>

      {/* Filled roles */}
      <div className="space-y-8">
        {byRole.map(({ role, members }) => (
          <div key={role}>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {role}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {members.map((member) => {
                const pro = getProById(member.proId);
                if (!pro) return null;
                return (
                  <Link key={member.proId} href={`/pros/${pro.slug}`}>
                    <Card hover padding="none" className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                          <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{pro.name}</span>
                            {pro.verified && <Badge variant="success" className="text-[10px]">✓</Badge>}
                          </div>
                          <div className="truncate text-xs text-slate-500">{pro.companyName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-0.5 text-xs text-slate-500">
                              <svg width="10" height="10" fill="#f59e0b" viewBox="0 0 20 20">
                                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                              </svg>
                              {pro.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-600">{pro.reviewCount} reviews</span>
                          </div>
                        </div>
                        <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                          <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty role slots */}
      {emptyRoles.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Still Looking For
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {emptyRoles.map((role) => (
              <Link key={role} href={`/marketplace`}>
                <Card hover padding="none" className="p-4 border-dashed">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-[var(--border)] flex items-center justify-center">
                      <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{role}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-600">{emptyRoleCopy[role]}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
