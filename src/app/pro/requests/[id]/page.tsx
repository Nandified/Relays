"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockProIncomingRequests } from "@/lib/mock-data";

export default function ProRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const request = mockProIncomingRequests.find((r) => r.id === params.id);

  if (!request) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-100">Request not found</h1>
        <Link href="/pro/requests" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
          ← Back to Requests
        </Link>
      </main>
    );
  }

  const statusBadgeVariant = request.status === "pending" ? "warning" : request.status === "accepted" ? "success" : "danger";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/pro/requests" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Requests
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-slate-100">Lead from {request.clientName}</h1>
        <Badge variant={statusBadgeVariant}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </div>

      {/* Client info */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">Client Information</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500">Name</div>
            <div className="text-sm text-slate-200 font-medium">{request.clientName}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Email</div>
            <div className="text-sm text-slate-200">{request.clientEmail}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Service</div>
            <div className="text-sm text-slate-200">{request.category}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Location</div>
            <div className="text-sm text-slate-200">{request.addressOrArea}</div>
          </div>
        </div>
      </Card>

      {/* Request details */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">Request Details</h2>
        <p className="text-sm text-slate-300">{request.description}</p>
        <div className="mt-3 text-xs text-slate-500">
          Received: {new Date(request.receivedAt).toLocaleString()}
        </div>
      </Card>

      {/* Actions */}
      {request.status === "pending" && (
        <Card padding="lg" className="mb-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Actions</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1">Accept Lead</Button>
            <Button variant="secondary" className="flex-1">Suggest Times</Button>
            <Button variant="ghost" className="flex-1">Request More Info</Button>
          </div>
          <div className="mt-3">
            <Button variant="danger" size="sm">Decline</Button>
          </div>
        </Card>
      )}

      {request.status === "accepted" && (
        <Card padding="lg" className="mb-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Update Status</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1">Schedule Appointment</Button>
            <Button variant="secondary" className="flex-1">Send Message</Button>
            <Button variant="secondary" className="flex-1">Mark Complete</Button>
          </div>
        </Card>
      )}

      {/* Notes */}
      <Card padding="lg">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">Notes</h2>
        <textarea
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-300 placeholder:text-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] min-h-[100px] resize-y"
          placeholder="Add internal notes about this request..."
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="secondary">Save Notes</Button>
        </div>
      </Card>
    </div>
  );
}
