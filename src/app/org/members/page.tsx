"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ROLE_META } from "@/lib/rbac";
import type { OrgMember, OrgRole } from "@/lib/types";
import {
  mockOrganizations,
  getOrgMembers,
  getJourneysForAgent,
  getActiveOrgMembers,
  MOCK_CURRENT_USER,
} from "@/lib/mock-org-data";

/* ── Role Badge Component ─────────────────────────────────────── */

function RoleBadge({ role }: { role: OrgRole }) {
  const meta = ROLE_META[role];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.bgClass} ${meta.textClass} border ${meta.borderClass}`}>
      {meta.shortLabel}
    </span>
  );
}

/* ── Status Indicator ─────────────────────────────────────────── */

function StatusDot({ status }: { status: OrgMember["status"] }) {
  const colors = {
    active: "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
    invited: "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
    deactivated: "bg-slate-600",
  };
  return <div className={`h-2 w-2 rounded-full ${colors[status]}`} />;
}

/* ── Invite Modal ─────────────────────────────────────────────── */

function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<OrgRole>("agent");
  const [sent, setSent] = React.useState(false);

  const handleInvite = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail("");
      onClose();
    }, 2000);
  };

  return (
    <Modal open={open} title="Invite Team Member" onClose={onClose}>
      {sent ? (
        <div className="text-center py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mx-auto mb-3">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-sm text-slate-200">Invite sent to {email}</p>
          <p className="text-xs text-slate-500 mt-1">They&apos;ll receive an email with a link to join.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="agent@luxuryrealtychi.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select
            label="Role"
            options={[
              { value: "agent", label: "Agent" },
              { value: "manager", label: "Manager / Broker" },
              { value: "transaction_coordinator", label: "Transaction Coordinator" },
              { value: "assistant", label: "Assistant" },
            ]}
            value={role}
            onChange={(e) => setRole(e.target.value as OrgRole)}
          />
          <div className="rounded-xl bg-white/5 border border-[var(--border)] p-3">
            <p className="text-xs font-medium text-slate-300 mb-1">Role Permissions</p>
            <p className="text-xs text-slate-500">{ROLE_META[role].description}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleInvite} disabled={!email.includes("@")} className="flex-1">Send Invite</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ── Change Role Modal ────────────────────────────────────────── */

function ChangeRoleModal({ open, member, onClose }: { open: boolean; member: OrgMember | null; onClose: () => void }) {
  const [newRole, setNewRole] = React.useState<OrgRole>(member?.role ?? "agent");

  React.useEffect(() => {
    if (member) setNewRole(member.role);
  }, [member]);

  if (!member) return null;

  return (
    <Modal open={open} title="Change Role" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-slate-300">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{member.name}</p>
            <p className="text-xs text-slate-500">{member.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RoleBadge role={member.role} />
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          <RoleBadge role={newRole} />
        </div>

        <Select
          label="New Role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager / Broker" },
            { value: "agent", label: "Agent" },
            { value: "transaction_coordinator", label: "Transaction Coordinator" },
            { value: "assistant", label: "Assistant" },
          ]}
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as OrgRole)}
        />

        <div className="rounded-xl bg-white/5 border border-[var(--border)] p-3">
          <p className="text-xs font-medium text-slate-300 mb-1">{ROLE_META[newRole].label} Permissions</p>
          <p className="text-xs text-slate-500">{ROLE_META[newRole].description}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={onClose} disabled={newRole === member.role} className="flex-1">Update Role</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Deactivate Modal (with journey transfer) ─────────────────── */

function DeactivateModal({ open, member, onClose }: { open: boolean; member: OrgMember | null; onClose: () => void }) {
  const [step, setStep] = React.useState<"confirm" | "transfer" | "done">("confirm");
  const [targetAgent, setTargetAgent] = React.useState("");

  React.useEffect(() => {
    if (open) setStep("confirm");
  }, [open]);

  if (!member) return null;

  const memberJourneys = getJourneysForAgent(member.userId);
  const activeAgents = getActiveOrgMembers("org_1").filter(
    (m) => m.role === "agent" && m.userId !== member.userId,
  );

  return (
    <Modal open={open} title="Deactivate Member" onClose={onClose}>
      {step === "confirm" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-300">This action cannot be undone</p>
                <p className="text-xs text-slate-500 mt-1">
                  Deactivating <strong className="text-slate-300">{member.name}</strong> will revoke their access to the organization.
                  {memberJourneys.length > 0 && ` They have ${memberJourneys.length} active journey${memberJourneys.length > 1 ? "s" : ""} that need to be reassigned.`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button
              variant="danger"
              onClick={() => memberJourneys.length > 0 ? setStep("transfer") : setStep("done")}
              className="flex-1"
            >
              {memberJourneys.length > 0 ? "Continue to Transfer" : "Deactivate"}
            </Button>
          </div>
        </div>
      )}

      {step === "transfer" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Reassign {member.name}&apos;s {memberJourneys.length} journey{memberJourneys.length > 1 ? "s" : ""} to another agent:
          </p>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {memberJourneys.map((j) => (
              <div key={j.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs">
                <span className="text-slate-300 font-medium flex-1 truncate">{j.title}</span>
                <Badge variant={j.status === "active" ? "success" : "default"}>{j.status}</Badge>
              </div>
            ))}
          </div>

          <Select
            label="Transfer All Journeys To"
            options={[
              { value: "", label: "Select an agent..." },
              ...activeAgents.map((a) => ({ value: a.userId, label: a.name })),
            ]}
            value={targetAgent}
            onChange={(e) => setTargetAgent(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setStep("confirm")} className="flex-1">Back</Button>
            <Button variant="danger" onClick={() => setStep("done")} disabled={!targetAgent} className="flex-1">
              Transfer & Deactivate
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mx-auto mb-3">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-sm text-slate-200">{member.name} has been deactivated</p>
          {memberJourneys.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">{memberJourneys.length} journey{memberJourneys.length > 1 ? "s" : ""} transferred successfully.</p>
          )}
          <Button variant="secondary" onClick={onClose} className="mt-4">Close</Button>
        </div>
      )}
    </Modal>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function OrgMembersPage() {
  const org = mockOrganizations[0];
  const members = getOrgMembers(org.id);

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [roleModalMember, setRoleModalMember] = React.useState<OrgMember | null>(null);
  const [deactivateMember, setDeactivateMember] = React.useState<OrgMember | null>(null);
  const [filterRole, setFilterRole] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  const filtered = members.filter((m) => {
    if (filterRole !== "all" && m.role !== filterRole) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const seatPercentage = Math.round((org.currentSeats / org.maxSeats) * 100);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Members</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your team&apos;s roles and access</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 border border-[var(--border)] px-3 py-1.5">
            <span className="text-xs text-slate-500">Seats:</span>
            <span className="text-xs font-semibold text-slate-200 tabular-nums">{org.currentSeats}/{org.maxSeats}</span>
            <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${seatPercentage}%` }} />
            </div>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5"><path d="M12 4v16m8-8H4" /></svg>
            Invite
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: "all", label: "All Roles" },
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager" },
            { value: "agent", label: "Agent" },
            { value: "transaction_coordinator", label: "TC" },
            { value: "assistant", label: "Assistant" },
          ]}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Members Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Journeys</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Last Active</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-bold text-slate-300 shrink-0 border border-[var(--border)]">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{member.name}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <StatusDot status={member.status} />
                      <span className="text-xs text-slate-400 capitalize">{member.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-slate-300 tabular-nums">{member.journeyCount}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-slate-500 tabular-nums">
                      {member.lastActiveAt ? formatDate(member.lastActiveAt) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setRoleModalMember(member)}
                        className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                        title="Change Role"
                      >
                        Role
                      </button>
                      {member.status === "active" && member.userId !== MOCK_CURRENT_USER.userId && (
                        <button
                          onClick={() => setDeactivateMember(member)}
                          className="rounded-lg px-2 py-1 text-xs text-red-400/60 hover:bg-red-500/5 hover:text-red-400 transition-colors"
                          title="Deactivate"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Legend */}
      <Card>
        <h3 className="text-sm font-medium text-slate-300 mb-3">Role Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(ROLE_META) as OrgRole[]).map((role) => {
            const meta = ROLE_META[role];
            return (
              <div key={role} className="flex items-start gap-2">
                <RoleBadge role={role} />
                <span className="text-xs text-slate-500 leading-relaxed">{meta.description}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modals */}
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <ChangeRoleModal open={!!roleModalMember} member={roleModalMember} onClose={() => setRoleModalMember(null)} />
      <DeactivateModal open={!!deactivateMember} member={deactivateMember} onClose={() => setDeactivateMember(null)} />
    </div>
  );
}

/* ── Utils ─────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
