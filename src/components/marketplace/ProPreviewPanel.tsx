"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type Pro } from "@/lib/types";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";

export function ProPreviewPanel({ pro }: { pro: Pro }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900">{pro.name}</div>
          <div className="truncate text-xs text-slate-600">{pro.companyName}</div>
        </div>
        <div className="h-10 w-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Image src={pro.companyLogoUrl} alt={pro.companyName} width={40} height={40} />
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-700">{pro.blurb}</div>

      <div className="mt-3 flex flex-wrap gap-1">
        {pro.categories.map((c) => (
          <span
            key={c}
            className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href={`/pros/${pro.slug}`} className="col-span-2">
          <Button variant="secondary" className="w-full">
            View profile
          </Button>
        </Link>

        <SoftWallGate action="add_to_team" context={{ proSlug: pro.slug, from: "marketplace" }}>
          {(authed, begin) => (
            <Button className="w-full" onClick={begin}>
              Add to team
            </Button>
          )}
        </SoftWallGate>

        <SoftWallGate action="request_booking" context={{ proSlug: pro.slug, from: "marketplace" }}>
          {(authed, begin) => (
            <Button variant="secondary" className="w-full" onClick={begin}>
              Request booking
            </Button>
          )}
        </SoftWallGate>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        {pro.rating.toFixed(1)} • {pro.reviewCount} reviews • {pro.serviceAreas.join(", ")}
      </div>
    </Card>
  );
}
