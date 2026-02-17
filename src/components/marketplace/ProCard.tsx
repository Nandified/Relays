"use client";

import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { type Pro } from "@/lib/types";

export function ProCard({
  pro,
  selected,
  onSelect,
}: {
  pro: Pro;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button className="w-full text-left" onClick={onSelect}>
      <Card hover selected={selected} padding="none" className="p-4 transition-all">
        <div className="flex items-start gap-3">
          <Avatar src={pro.headshotUrl} alt={pro.name} size={52} rounded="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{pro.name}</div>
                <div className="truncate text-xs text-slate-600 dark:text-slate-500">{pro.companyName}</div>
              </div>
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {pro.categories.slice(0, 2).map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
              {pro.verified && (
                <Badge variant="success">✓ Verified</Badge>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                  <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                </svg>
                {pro.rating.toFixed(1)}
              </span>
              <span>{pro.reviewCount} reviews</span>
              <span>{pro.serviceAreas[0]}</span>
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
