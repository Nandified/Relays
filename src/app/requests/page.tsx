"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockRequests, getProById } from "@/lib/mock-data";
import { type RequestStatus } from "@/lib/types";

function statusVariant(status: RequestStatus): "default" | "accent" | "success" | "warning" | "danger" {
  switch (status) {
    case "submitted": return "default";
    case "reviewing": return "accent";
    case "matched": return "accent";
    case "scheduled": return "warning";
    case "completed": return "success";
    case "cancelled": return "danger";
  }
}

function statusLabel(status: RequestStatus): string {
  switch (status) {
    case "submitted": return "Submitted";
    case "reviewing": return "Under Review";
    case "matched": return "Matched";
    case "scheduled": return "Scheduled";
    case "completed": return "Completed";
    case "cancelled": return "Cancelled";
  }
}

export default function RequestsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Requests</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {mockRequests.length} request{mockRequests.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <div className="space-y-3">
        {mockRequests.map((req) => {
          const pro = req.assignedProId ? getProById(req.assignedProId) : null;
          return (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card hover padding="none" className="p-4 mb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{req.category}</h3>
                      <Badge variant={statusVariant(req.status)}>{statusLabel(req.status)}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{req.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-500">
                      <span>{req.addressOrArea}</span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {pro && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="h-9 w-9 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                        <Image src={pro.headshotUrl} alt={pro.name} width={36} height={36} />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
