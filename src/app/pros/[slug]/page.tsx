"use client";

import { useParams } from "next/navigation";
import { mockPros } from "@/lib/mock-data";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";

export default function ProProfilePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const pro = mockPros.find((p) => p.slug === slug);

  if (!pro) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-sm font-semibold text-slate-900">Not found</div>
        <div className="mt-2 text-sm text-slate-600">That pro doesn’t exist yet.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <Image src={pro.headshotUrl} alt={pro.name} width={64} height={64} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-slate-900">{pro.name}</div>
            <div className="text-sm text-slate-600">{pro.companyName}</div>
            <div className="mt-2 text-xs text-slate-500">
              {pro.rating.toFixed(1)} • {pro.reviewCount} reviews
            </div>
          </div>
          <div className="h-12 w-12 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <Image src={pro.companyLogoUrl} alt={pro.companyName} width={48} height={48} />
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-700">{pro.blurb}</div>

        <div className="mt-4 flex flex-wrap gap-1">
          {pro.categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <SoftWallGate action="add_to_team" context={{ proSlug: pro.slug, from: "profile" }}>
            {(authed, begin) => (
              <Button className="w-full" onClick={begin}>
                Add to team
              </Button>
            )}
          </SoftWallGate>
          <SoftWallGate action="request_booking" context={{ proSlug: pro.slug, from: "profile" }}>
            {(authed, begin) => (
              <Button variant="secondary" className="w-full" onClick={begin}>
                Request booking
              </Button>
            )}
          </SoftWallGate>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Service areas: {pro.serviceAreas.join(", ")}
        </div>
      </div>
    </main>
  );
}
