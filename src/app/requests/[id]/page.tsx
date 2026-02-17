"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRequestById, getTimelineForRequest, getProById } from "@/lib/mock-data";
import { type RequestStatus } from "@/lib/types";

const statusSteps: RequestStatus[] = ["submitted", "reviewing", "matched", "scheduled", "completed"];
const stepLabels: Record<string, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  matched: "Matched",
  scheduled: "Scheduled",
  completed: "Complete",
};

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const request = getRequestById(params.id);
  const timeline = getTimelineForRequest(params.id);
  const pro = request?.assignedProId ? getProById(request.assignedProId) : null;

  if (!request) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Request not found</h1>
        <Link href="/requests" className="mt-4 inline-block text-sm text-blue-500 dark:text-blue-400 hover:underline">
          ← Back to Requests
        </Link>
      </main>
    );
  }

  const currentStepIndex = statusSteps.indexOf(request.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/requests" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Requests
      </Link>

      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{request.category}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{request.addressOrArea}</p>

      {/* Status stepper */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Status</h2>
        <div className="flex items-center">
          {statusSteps.map((step, i) => {
            const isPast = i <= currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${isCurrent
                      ? "bg-[var(--accent)] text-white ring-4 ring-[var(--accent-light)]"
                      : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-500"
                    }
                  `}>
                    {isPast && !isCurrent ? (
                      <svg width="14" height="14" fill="white" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`mt-1 text-[10px] font-medium whitespace-nowrap ${isCurrent ? "text-blue-400" : isPast ? "text-emerald-400" : "text-slate-500 dark:text-slate-500"}`}>
                    {stepLabels[step]}
                  </span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${i < currentStepIndex ? "bg-emerald-500/50" : "bg-[var(--border)]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Assigned pro */}
      {pro && (
        <Card padding="lg" className="mb-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Assigned Professional</h2>
          <Link href={`/pros/${pro.slug}`} className="flex items-center gap-3 group">
            <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{pro.name}</div>
              <div className="text-xs text-slate-600 dark:text-slate-500">{pro.companyName}</div>
            </div>
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
            </div>
          </Link>
        </Card>
      )}

      {/* Request details */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Details</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{request.description}</p>
        {request.notes && (
          <div className="rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border)] p-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Notes: </span>
            {request.notes}
          </div>
        )}
      </Card>

      {/* Timeline */}
      <Card padding="lg">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Timeline</h2>
        <div className="space-y-0">
          {timeline.map((event, i) => (
            <div key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-[var(--accent)]" : "bg-slate-300 dark:bg-slate-600"}`} />
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-[var(--border)] my-1" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{event.label}</span>
                  <Badge variant="default" className="text-[10px]">{event.actor}</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{event.description}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
