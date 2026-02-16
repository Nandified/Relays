/* ── Relays — Role-Based Access Control ─────────────────────── */

import type { OrgRole } from "@/lib/types";

/**
 * RBAC Enforcement Layer
 *
 * Per the v19 spec (§25.3):
 * - Solo agent: 100% private
 * - Team lead: can oversee their agents
 * - Brokerage admin: oversight dashboards + journey visibility + limited intervention
 * - TC/Assistant: view everything needed to step in
 */

/* ── Permission predicates ──────────────────────────────────── */

/** Can the user view a given journey? */
export function canViewJourney(role: OrgRole, isOwner: boolean): boolean {
  if (isOwner) return true;
  // Admin, TC, and assistants can view all journeys
  if (role === "admin" || role === "transaction_coordinator" || role === "assistant") return true;
  // Managers have read-only oversight
  if (role === "manager") return true;
  // Agents can only see their own
  return false;
}

/** Can the user edit a given journey? */
export function canEditJourney(role: OrgRole, isOwner: boolean): boolean {
  if (isOwner) return true;
  // Admin and TC can edit (step-in)
  if (role === "admin" || role === "transaction_coordinator") return true;
  // Manager: read-only by default
  // Assistant: view but not edit unless granted
  return false;
}

/** Can the user manage org members (invite, change roles)? */
export function canManageMembers(role: OrgRole): boolean {
  return role === "admin" || role === "manager";
}

/** Can the user view org-wide reports? */
export function canViewReports(role: OrgRole): boolean {
  return role === "admin" || role === "manager" || role === "transaction_coordinator";
}

/** Can the user deactivate another agent? */
export function canDeactivateAgent(role: OrgRole): boolean {
  return role === "admin";
}

/** Can the user reassign journeys between agents? */
export function canReassignJourney(role: OrgRole): boolean {
  return role === "admin" || role === "transaction_coordinator";
}

/** Can the user change org settings? */
export function canEditSettings(role: OrgRole): boolean {
  return role === "admin";
}

/** Can the user invite new members? */
export function canInviteMembers(role: OrgRole): boolean {
  return role === "admin" || role === "manager";
}

/** Can the user export compliance data? */
export function canExportCompliance(role: OrgRole): boolean {
  return role === "admin" || role === "manager";
}

/** Can the user view the audit trail? */
export function canViewAuditTrail(role: OrgRole): boolean {
  return role === "admin" || role === "manager" || role === "transaction_coordinator";
}

/* ── Role metadata ──────────────────────────────────────────── */

export interface RoleMeta {
  label: string;
  shortLabel: string;
  color: string; // Tailwind color name
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
}

export const ROLE_META: Record<OrgRole, RoleMeta> = {
  admin: {
    label: "Admin",
    shortLabel: "Admin",
    color: "purple",
    bgClass: "bg-purple-500/12",
    textClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    description: "Full access to all org settings, members, journeys, and reports",
  },
  manager: {
    label: "Manager / Broker",
    shortLabel: "Manager",
    color: "blue",
    bgClass: "bg-blue-500/12",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/20",
    description: "Read-only oversight of journeys, referrals, and team activity",
  },
  agent: {
    label: "Agent",
    shortLabel: "Agent",
    color: "emerald",
    bgClass: "bg-emerald-500/12",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/20",
    description: "Full control of own journeys within org policy guardrails",
  },
  transaction_coordinator: {
    label: "Transaction Coordinator",
    shortLabel: "TC",
    color: "amber",
    bgClass: "bg-amber-500/12",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/20",
    description: "View and step into journeys to manage transactions",
  },
  assistant: {
    label: "Assistant",
    shortLabel: "Asst",
    color: "slate",
    bgClass: "bg-white/5",
    textClass: "text-slate-400",
    borderClass: "border-white/10",
    description: "View access to support agents with their journeys",
  },
};

/** Get a human-readable summary of what a role can do */
export function getRolePermissions(role: OrgRole): string[] {
  const perms: string[] = [];
  if (canViewJourney(role, false)) perms.push("View all org journeys");
  if (canEditJourney(role, false)) perms.push("Edit any journey (step-in)");
  if (canManageMembers(role)) perms.push("Manage org members");
  if (canDeactivateAgent(role)) perms.push("Deactivate agents");
  if (canReassignJourney(role)) perms.push("Reassign journeys");
  if (canViewReports(role)) perms.push("View org reports");
  if (canEditSettings(role)) perms.push("Edit org settings");
  if (canExportCompliance(role)) perms.push("Export compliance data");
  return perms;
}
