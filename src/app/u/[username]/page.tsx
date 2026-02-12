"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getProByUsername, getProById } from "@/lib/mock-data";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";

export default function SharePage() {
  const params = useParams<{ username: string }>();
  const pro = getProByUsername(params.username);

  if (!pro) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Professional not found</h1>
        <p className="mt-2 text-sm text-slate-600">This profile link doesn&apos;t exist.</p>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
          Browse Marketplace →
        </Link>
      </main>
    );
  }

  const topThreePros = pro.topThree.map(getProById).filter(Boolean);

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      {/* Pro header */}
      <Card padding="lg" className="text-center shadow-[var(--shadow-elevated)] mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-2 border-white shadow-md bg-slate-50">
              <Image src={pro.headshotUrl} alt={pro.name} width={96} height={96} />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm">
              <Image src={pro.companyLogoUrl} alt={pro.companyName} width={40} height={40} />
            </div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900">{pro.name}</h1>
        <p className="text-sm text-slate-500">{pro.companyName}</p>

        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="14" height="14" fill={star <= Math.round(pro.rating) ? "#f59e0b" : "#e5e7eb"} viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-slate-600">{pro.rating.toFixed(1)} ({pro.reviewCount})</span>
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {pro.categories.map((cat) => (
            <Badge key={cat} variant="outline">{cat}</Badge>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-600">{pro.blurb}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-xs text-slate-500">
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

      {/* Curated top 3 */}
      {topThreePros.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
            Recommended Professionals
          </h2>
          <div className="space-y-3">
            {topThreePros.map((recPro) => {
              if (!recPro) return null;
              return (
                <Link key={recPro.id} href={`/pros/${recPro.slug}`}>
                  <Card hover padding="none" className="p-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-50">
                        <Image src={recPro.headshotUrl} alt={recPro.name} width={48} height={48} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900">{recPro.name}</div>
                        <div className="text-xs text-slate-500">{recPro.companyName}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recPro.categories.map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
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
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[var(--accent)] text-[8px] font-bold text-white">R</div>
          Powered by Relays
        </Link>
      </div>
    </main>
  );
}
