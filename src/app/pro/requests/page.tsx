"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { mockProIncomingRequests } from "@/lib/mock-data";

export default function ProRequestsPage() {
  const [tab, setTab] = React.useState("pending");

  const tabs = [
    { id: "pending", label: "Pending", count: mockProIncomingRequests.filter(r => r.status === "pending").length },
    { id: "accepted", label: "Accepted", count: mockProIncomingRequests.filter(r => r.status === "accepted").length },
    { id: "declined", label: "Declined", count: mockProIncomingRequests.filter(r => r.status === "declined").length },
  ];

  const filtered = mockProIncomingRequests.filter((r) => r.status === tab);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Incoming Requests</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your incoming leads and bookings</p>
      </div>

      <div className="mb-6">
        <Tabs tabs={tabs} activeId={tab} onChange={setTab} />
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <Card key={req.id} hover padding="lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-900">{req.clientName}</h3>
                  <Badge variant={req.status === "pending" ? "warning" : req.status === "accepted" ? "success" : "danger"}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{req.clientEmail}</p>
                <p className="mt-2 text-sm text-slate-700">{req.description}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span>{req.category}</span>
                  <span>•</span>
                  <span>{req.addressOrArea}</span>
                  <span>•</span>
                  <span>{new Date(req.receivedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {req.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button size="sm">Accept Lead</Button>
                <Button size="sm" variant="secondary">Suggest Time</Button>
                <Button size="sm" variant="ghost">Decline</Button>
              </div>
            )}

            {req.status === "accepted" && (
              <div className="mt-4">
                <Link href={`/pro/requests/${req.id}`}>
                  <Button size="sm" variant="secondary">View Details →</Button>
                </Link>
              </div>
            )}
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-slate-500">No {tab} requests</p>
          </Card>
        )}
      </div>
    </div>
  );
}
