"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { mockAdminTeam, type AdminTeamMember, type AdminRole } from "@/lib/mock-admin-data";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

const roleBadge: Record<AdminRole, { variant: "accent" | "success" | "default" | "warning"; label: string }> = {
  super_admin: { variant: "accent", label: "Super Admin" },
  admin: { variant: "accent", label: "Admin" },
  support: { variant: "success", label: "Support" },
  viewer: { variant: "default", label: "Viewer" },
};

const roleColors: Record<AdminRole, string> = {
  super_admin: "bg-violet-500/10 text-violet-400 border-violet-500/10",
  admin: "bg-violet-500/10 text-violet-400 border-violet-500/10",
  support: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
  viewer: "bg-slate-500/10 text-slate-400 border-slate-500/10",
};

const ROLES: AdminRole[] = ["super_admin", "admin", "support", "viewer"];
const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  support: "Support",
  viewer: "Viewer",
};

export default function AdminTeamPage() {
  const [team, setTeam] = React.useState(mockAdminTeam);
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteName, setInviteName] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<AdminRole>("viewer");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    const newMember: AdminTeamMember = {
      id: `admin_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatarUrl: null,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      activityLog: [
        { id: `al_${Date.now()}`, action: "Invited", timestamp: new Date().toISOString(), details: `Invited to team as ${ROLE_LABELS[inviteRole]}` },
      ],
    };
    setTeam(prev => [...prev, newMember]);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("viewer");
    setInviteModalOpen(false);
  };

  const handleRemove = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Team Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage Relays admin team members, roles, and permissions.
          </p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ROLES.map((role) => {
          const count = team.filter(m => m.role === role).length;
          return (
            <div key={role} className="rounded-2xl border border-[var(--border)] bg-white/[0.02] p-3 text-center">
              <div className="text-lg font-bold text-slate-100 tabular-nums">{count}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">{ROLE_LABELS[role]}s</div>
            </div>
          );
        })}
      </div>

      {/* Team list */}
      <div className="space-y-3">
        {team.map((member) => {
          const roleInfo = roleBadge[member.role];
          const isExpanded = expandedId === member.id;
          return (
            <Card key={member.id} padding="none" className="glow-violet overflow-hidden">
              <div
                className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-white/[0.01] transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : member.id)}
              >
                {/* Avatar */}
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold ${roleColors[member.role]}`}>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{member.name}</span>
                    <Badge variant={roleInfo.variant} className="text-[10px]">{roleInfo.label}</Badge>
                    {member.role === "super_admin" && (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="text-violet-400">
                        <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{member.email}</p>
                </div>

                {/* Meta */}
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-500">Last active {formatTimeAgo(member.lastActiveAt)}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Joined {formatDate(member.joinedAt)}</div>
                </div>

                {/* Expand arrow */}
                <svg
                  width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  className={`text-slate-600 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>

                {/* Remove button */}
                {member.role !== "super_admin" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(member.id); }}
                    className="rounded-xl p-2 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    title="Remove member"
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Activity Log (expandable) */}
              {isExpanded && member.activityLog.length > 0 && (
                <div className="border-t border-[var(--border)] bg-white/[0.01] px-4 py-3 animate-in">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2">Activity Log</div>
                  <div className="space-y-2">
                    {member.activityLog.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500/50 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-300">{entry.action}</span>
                            <span className="text-[10px] text-slate-600">{formatTimeAgo(entry.timestamp)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{entry.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isExpanded && member.activityLog.length === 0 && (
                <div className="border-t border-[var(--border)] bg-white/[0.01] px-4 py-4 text-xs text-slate-600 text-center">
                  No activity recorded yet.
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Role legend */}
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white/[0.02] p-5">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <Badge variant="accent" className="mb-2">Super Admin</Badge>
            <p className="text-slate-500 leading-relaxed">Full access including team management, billing, and destructive actions.</p>
          </div>
          <div>
            <Badge variant="accent" className="mb-2">Admin</Badge>
            <p className="text-slate-500 leading-relaxed">Full access to all settings, categories, verification queue, and data import.</p>
          </div>
          <div>
            <Badge variant="success" className="mb-2">Support</Badge>
            <p className="text-slate-500 leading-relaxed">Manage verifications, view metrics, handle support requests.</p>
          </div>
          <div>
            <Badge variant="default" className="mb-2">Viewer</Badge>
            <p className="text-slate-500 leading-relaxed">Read-only access to dashboard and metrics. Cannot modify data.</p>
          </div>
        </div>
      </div>

      {/* Invite modal */}
      <Modal open={inviteModalOpen} title="Invite Team Member" onClose={() => setInviteModalOpen(false)}>
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g., Casey Kim"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="casey@relays.app"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-300">Role</span>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setInviteRole(role)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    inviteRole === role
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                      : "border-[var(--border)] bg-[var(--bg-elevated)] text-slate-400 hover:border-[var(--border-hover)]"
                  }`}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
