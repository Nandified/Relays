"use client";

import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
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
      <Card
        className={`p-3 transition ${selected ? "border-slate-300" : "hover:border-slate-300"}`}
      >
        <div className="flex items-start gap-3">
          <Avatar src={pro.headshotUrl} alt={pro.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{pro.name}</div>
                <div className="truncate text-xs text-slate-600">{pro.companyName}</div>
              </div>
              <div className="h-9 w-9 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {pro.categories.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {pro.rating.toFixed(1)} • {pro.reviewCount} reviews • {pro.serviceAreas[0]}
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
