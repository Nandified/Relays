"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import {
  mockWebhookEndpoints,
  mockAPIKeys,
  mockIntegrations,
  eventCatalog,
  getDeliveriesForEndpoint,
} from "@/lib/mock-webhook-data";
import type {
  WebhookEndpoint,
  WebhookDelivery,
  APIKey,
  EventType,
} from "@/lib/types";

/* ── Helpers ─────────────────────────────────────────────────── */

function timeAgo(dateStr: string): string {
  const now = new Date("2026-02-16T15:00:00Z");
  const diff = now.getTime() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/* ── Status Dot ──────────────────────────────────────────────── */

function StatusDot({ status }: { status: string }) {
  const bg: Record<string, string> = {
    active: "bg-emerald-400", connected: "bg-emerald-400", syncing: "bg-blue-400",
    paused: "bg-amber-400", failed: "bg-red-400", error: "bg-red-400",
  };
  const pulse = ["active", "connected", "failed", "error"].includes(status);
  return (
    <span className="relative flex h-2.5 w-2.5">
      {pulse && <span className={`absolute inline-flex h-full w-full animate-ping-slow rounded-full ${bg[status]}/40 opacity-75`} />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${bg[status] || "bg-slate-500"}`} />
    </span>
  );
}

/* ── Integration Icons ───────────────────────────────────────── */

function IntIcon({ name }: { name: string }) {
  const map: Record<string, { gradient: string; label: string }> = {
    "Follow Up Boss": { gradient: "from-blue-500 to-blue-600", label: "FUB" },
    "kvCORE": { gradient: "from-violet-500 to-purple-600", label: "kv" },
    "HubSpot": { gradient: "from-orange-500 to-orange-600", label: "HS" },
    "Salesforce": { gradient: "from-sky-400 to-blue-500", label: "SF" },
    "Google Sheets": { gradient: "from-green-500 to-emerald-600", label: "GS" },
    "Zapier": { gradient: "from-orange-400 to-amber-500", label: "⚡" },
    "Make (Integromat)": { gradient: "from-fuchsia-500 to-purple-600", label: "M" },
  };
  const cfg = map[name] || { gradient: "from-slate-500 to-slate-600", label: "?" };
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.gradient} text-white text-sm font-bold shadow-lg`}>
      {cfg.label}
    </div>
  );
}

/* ── Delivery Row ────────────────────────────────────────────── */

function DeliveryRow({ d }: { d: WebhookDelivery }) {
  const icons: Record<string, React.ReactNode> = {
    delivered: <span className="text-emerald-400">✓</span>,
    failed: <span className="text-red-400">✗</span>,
    retrying: <span className="text-amber-400">↻</span>,
    pending: <span className="text-slate-500">◌</span>,
  };
  const vars: Record<string, "success" | "danger" | "warning" | "default"> = {
    delivered: "success", failed: "danger", retrying: "warning", pending: "default",
  };
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
      <div className="w-5 text-center">{icons[d.status]}</div>
      <div className="flex-1 min-w-0">
        <code className="text-xs font-mono text-slate-300">{d.eventType}</code>
        <div className="text-[11px] text-slate-500 mt-0.5">{d.eventId}</div>
      </div>
      <Badge variant={vars[d.status]}>{d.status}{d.statusCode ? ` · ${d.statusCode}` : ""}</Badge>
      <div className="text-xs text-slate-500 tabular-nums w-16 text-right">{d.responseMs ? `${d.responseMs}ms` : "—"}</div>
      <div className="text-xs text-slate-500 tabular-nums w-10 text-right">×{d.attempts}</div>
      <div className="text-xs text-slate-500 w-16 text-right">{timeAgo(d.createdAt)}</div>
    </div>
  );
}

/* ── Add Webhook Modal ───────────────────────────────────────── */

function AddWebhookModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [sel, setSel] = React.useState<EventType[]>([]);
  const [testRes, setTestRes] = React.useState<{ ok: boolean; msg: string } | null>(null);

  const cats: { label: string; events: EventType[] }[] = [
    { label: "Person", events: ["person.created", "person.updated"] },
    { label: "Journey", events: ["journey.created", "journey.stage_changed", "journey.owner_changed", "pro.added_to_journey", "curated_group.changed", "referral.sent"] },
    { label: "Booking", events: ["booking.requested", "booking.accepted", "booking.declined"] },
    { label: "Documents", events: ["doc.requested", "doc.uploaded"] },
    { label: "Messaging", events: ["connect.requested", "connect.accepted", "message.sent"] },
    { label: "Verification", events: ["verification.completed"] },
  ];

  const toggle = (e: EventType) => setSel((p) => p.includes(e) ? p.filter((x) => x !== e) : [...p, e]);
  const handleTest = () => {
    const ok = url.startsWith("https://");
    setTestRes({ ok, msg: ok ? "Test ping delivered · 200 OK · 89ms" : "Endpoint must use HTTPS" });
    setTimeout(() => setTestRes(null), 4000);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Webhook Endpoint">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <Input label="Endpoint URL" placeholder="https://your-app.com/webhooks/relays" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Input label="Signing Secret" placeholder="whsec_your_secret_key" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <p className="text-[11px] text-slate-500 -mt-2">Used to sign payloads with HMAC-SHA256. Store securely.</p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Subscribe to Events</span>
            <div className="flex gap-2">
              <button onClick={() => setSel(cats.flatMap((c) => c.events))} className="text-[11px] text-blue-400 hover:text-blue-300">All</button>
              <button onClick={() => setSel([])} className="text-[11px] text-slate-500 hover:text-slate-400">Clear</button>
            </div>
          </div>
          <div className="space-y-3">
            {cats.map((cat) => (
              <div key={cat.label}>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">{cat.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.events.map((evt) => (
                    <button key={evt} onClick={() => toggle(evt)} className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${sel.includes(evt) ? "bg-blue-500/15 text-blue-400 border border-blue-500/30" : "bg-white/[0.03] text-slate-500 border border-white/[0.06] hover:border-white/10"}`}>
                      {evt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {testRes && (
          <div className={`rounded-xl px-3 py-2 text-xs ${testRes.ok ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {testRes.ok ? "✓" : "✗"} {testRes.msg}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="ghost" onClick={handleTest} className="text-blue-400">Test</Button>
          <Button onClick={onClose} className="flex-1" disabled={!url || sel.length === 0}>Create</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Endpoint Detail Modal ───────────────────────────────────── */

function EndpointDetailModal({ open, onClose, endpoint }: { open: boolean; onClose: () => void; endpoint: WebhookEndpoint | null }) {
  const [testRes, setTestRes] = React.useState<string | null>(null);
  if (!endpoint) return null;
  const deliveries = getDeliveriesForEndpoint(endpoint.id);

  return (
    <Modal open={open} onClose={onClose} title="Webhook Endpoint">
      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusDot status={endpoint.status} />
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">{endpoint.status}</span>
          </div>
          <code className="text-sm font-mono text-slate-200 break-all">{endpoint.url}</code>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
            <span>Created {timeAgo(endpoint.createdAt)}</span>
            {endpoint.lastDeliveryAt && <span>Last delivery {timeAgo(endpoint.lastDeliveryAt)}</span>}
            {endpoint.failureCount > 0 && <span className="text-red-400">{endpoint.failureCount} failures</span>}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-400 mb-2">Subscribed Events</div>
          <div className="flex flex-wrap gap-1.5">
            {endpoint.events.map((evt) => (
              <span key={evt} className="px-2 py-0.5 rounded-md text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/15">{evt}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => { setTestRes("✓ Test ping · 200 OK · 72ms"); setTimeout(() => setTestRes(null), 3000); }}>
            ⚡ Send Test
          </Button>
          <Button size="sm" variant="ghost">{endpoint.status === "paused" ? "Resume" : "Pause"}</Button>
          <Button size="sm" variant="danger">Delete</Button>
        </div>

        {testRes && <div className="rounded-xl px-3 py-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{testRes}</div>}

        <div>
          <div className="text-xs font-medium text-slate-400 mb-2">Recent Deliveries</div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {deliveries.length > 0
              ? deliveries.map((d) => <DeliveryRow key={d.id} d={d} />)
              : <div className="px-4 py-6 text-center text-xs text-slate-500">No deliveries yet</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── Generate Key Modal ──────────────────────────────────────── */

function GenKeyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = React.useState("");
  const [key, setKey] = React.useState<string | null>(null);
  const gen = () => setKey(`rl_live_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`);
  const close = () => { setName(""); setKey(null); onClose(); };

  return (
    <Modal open={open} onClose={close} title="Generate API Key">
      {!key ? (
        <div className="space-y-4">
          <Input label="Key Name" placeholder="e.g. Production, Staging" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={gen} className="flex-1" disabled={!name.trim()}>Generate</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/15 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-400">⚠</span>
              <span className="text-xs font-medium text-amber-400">Copy now — won&apos;t be shown again</span>
            </div>
            <code className="text-sm font-mono text-slate-200 break-all select-all">{key}</code>
          </div>
          <Button onClick={close} className="w-full">Done</Button>
        </div>
      )}
    </Modal>
  );
}

/* ── Event Catalog Entry (inline preview) ────────────────────── */

function EventPreview({ entry }: { entry: (typeof eventCatalog)[number] }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="border-b border-white/[0.04] last:border-b-0">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left">
        <code className="text-xs font-mono text-blue-400 shrink-0">{entry.type}.{entry.version}</code>
        <span className="text-xs text-slate-400 flex-1 truncate">{entry.description}</span>
        <svg className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 animate-in">
          <div className="rounded-xl bg-[#0d0d14] border border-white/[0.06] p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-slate-300 whitespace-pre leading-relaxed">
              {JSON.stringify(entry.samplePayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/* ══  MAIN PAGE  ═════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════ */

export default function IntegrationsPage() {
  const [tab, setTab] = React.useState("integrations");
  const [addWH, setAddWH] = React.useState(false);
  const [selEP, setSelEP] = React.useState<WebhookEndpoint | null>(null);
  const [genKey, setGenKey] = React.useState(false);
  const [keys, setKeys] = React.useState(mockAPIKeys);

  const tabs = [
    { id: "integrations", label: "Integrations" },
    { id: "webhooks", label: "Webhooks", count: mockWebhookEndpoints.length },
    { id: "api-keys", label: "API Keys", count: keys.filter((k) => k.status === "active").length },
    { id: "events", label: "Event Catalog" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <a href="/pro/settings" className="hover:text-slate-400 transition-colors">Settings</a>
          <span>/</span>
          <span className="text-slate-300">Integrations</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Integrations &amp; API</h1>
            <p className="text-sm text-slate-500 mt-1">Connect Relays to your CRM, automate workflows, and manage API access.</p>
          </div>
          <a href="/developers/events" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Event Docs
          </a>
        </div>
      </div>

      <div className="mb-6"><Tabs tabs={tabs} activeId={tab} onChange={setTab} /></div>

      {/* ── Integrations Tab ── */}
      {tab === "integrations" && (
        <div className="space-y-6 stagger-children">
          {/* Connected */}
          <div>
            <h2 className="text-sm font-medium text-slate-300 mb-3">Connected</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mockIntegrations.filter((i) => i.connected).map((i) => (
                <Card key={i.id} hover padding="lg" glow className="group">
                  <div className="flex items-start gap-3">
                    <IntIcon name={i.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">{i.name}</span>
                        <StatusDot status={i.status || "connected"} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{i.description}</p>
                      {i.lastSyncAt && <p className="text-[11px] text-slate-600 mt-1.5">Synced {timeAgo(i.lastSyncAt)}</p>}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex gap-2">
                    <Button size="sm" variant="ghost" className="flex-1 text-xs">Configure</Button>
                    <Button size="sm" variant="ghost" className="text-red-400/60 hover:text-red-400 text-xs">Disconnect</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Available */}
          <div>
            <h2 className="text-sm font-medium text-slate-300 mb-3">Available</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mockIntegrations.filter((i) => !i.connected).map((i) => (
                <Card key={i.id} hover padding="lg" className="group">
                  <div className="flex items-start gap-3">
                    <IntIcon name={i.name} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-slate-200">{i.name}</span>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{i.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/[0.04]">
                    <Button size="sm" variant="secondary" className="w-full text-xs">Connect</Button>
                  </div>
                </Card>
              ))}

              {/* Build Custom Card */}
              <Card hover padding="lg" className="group border-dashed border-white/10">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-dashed border-white/10 text-slate-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-200">Build Custom</span>
                    <p className="text-xs text-slate-500 mt-0.5">Use webhooks and our API to build your own integration.</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex gap-2">
                  <Button size="sm" variant="ghost" className="flex-1 text-xs" onClick={() => setTab("webhooks")}>Webhooks</Button>
                  <a href="/developers/events">
                    <Button size="sm" variant="ghost" className="text-xs">Event Docs →</Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ── Webhooks Tab ── */}
      {tab === "webhooks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Receive real-time event notifications via HTTP POST.</p>
            <Button size="sm" onClick={() => setAddWH(true)}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
              Add Endpoint
            </Button>
          </div>

          <div className="space-y-2">
            {mockWebhookEndpoints.map((ep) => (
              <button key={ep.id} onClick={() => setSelEP(ep)} className="w-full text-left group">
                <Card hover padding="lg" className="transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-1"><StatusDot status={ep.status} /></div>
                      <div className="min-w-0">
                        <code className="text-sm font-mono text-slate-200 truncate block">{ep.url}</code>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <Badge variant={ep.status === "active" ? "success" : ep.status === "paused" ? "warning" : "danger"}>{ep.status}</Badge>
                          <span className="text-xs text-slate-500">{ep.events.length} events</span>
                          {ep.lastDeliveryAt && <span className="text-xs text-slate-500">Last: {timeAgo(ep.lastDeliveryAt)}</span>}
                          {ep.failureCount > 0 && <span className="text-xs text-red-400">{ep.failureCount} failures</span>}
                        </div>
                      </div>
                    </div>
                    <svg className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Card>
              </button>
            ))}
          </div>

          {/* All Deliveries */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-2 mt-6">All Deliveries</h3>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-2 border-b border-white/[0.06] text-[11px] text-slate-500 uppercase tracking-wide">
                <div className="w-5" />
                <div className="flex-1">Event</div>
                <div>Status</div>
                <div className="w-16 text-right">Latency</div>
                <div className="w-10 text-right">Tries</div>
                <div className="w-16 text-right">When</div>
              </div>
              {[...getDeliveriesForEndpoint("wh_01"), ...getDeliveriesForEndpoint("wh_02"), ...getDeliveriesForEndpoint("wh_03")]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((d) => <DeliveryRow key={d.id} d={d} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── API Keys Tab ── */}
      {tab === "api-keys" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">Manage API keys for server-to-server authentication.</p>
            <Button size="sm" onClick={() => setGenKey(true)}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>
              Generate Key
            </Button>
          </div>

          <Card padding="none">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] last:border-b-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{k.name}</span>
                    <Badge variant={k.status === "active" ? "success" : "danger"}>{k.status}</Badge>
                  </div>
                  <code className="text-xs font-mono text-slate-500 mt-0.5 block">{k.prefix}••••••••{k.lastFour}</code>
                </div>
                <div className="text-xs text-slate-500">{k.lastUsedAt ? `Used ${timeAgo(k.lastUsedAt)}` : "Never used"}</div>
                {k.status === "active" && (
                  <Button size="sm" variant="ghost" onClick={() => setKeys((p) => p.map((x) => x.id === k.id ? { ...x, status: "revoked" as const } : x))} className="text-red-400 hover:text-red-300">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </Card>

          {/* Usage note */}
          <Card padding="lg" className="border-blue-500/10">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Authentication</p>
                <p className="text-xs text-slate-500 mt-0.5">Include your API key in the <code className="text-blue-400/80 bg-blue-500/5 px-1 rounded">Authorization: Bearer rl_live_...</code> header of every request.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Event Catalog Tab ── */}
      {tab === "events" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">All {eventCatalog.length} event types available for webhook subscriptions.</p>
            <a href="/developers/events">
              <Button size="sm" variant="secondary">Full Documentation →</Button>
            </a>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {eventCatalog.map((entry) => (
              <EventPreview key={entry.type} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddWebhookModal open={addWH} onClose={() => setAddWH(false)} />
      <EndpointDetailModal open={!!selEP} onClose={() => setSelEP(null)} endpoint={selEP} />
      <GenKeyModal open={genKey} onClose={() => setGenKey(false)} />
    </div>
  );
}