"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  getGroupsForPro,
  getProById,
  getGroupPartnerCount,
  getGroupPartnersByCategory,
  mockCuratedGroups,
} from "@/lib/mock-data";
import type { CuratedGroup, CuratedGroupTag } from "@/lib/types";

const TAG_META: Record<CuratedGroupTag, { label: string; color: string; bgColor: string; icon: string }> = {
  lead_source: {
    label: "Lead Source",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    icon: "📡",
  },
  language: {
    label: "Language",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/20",
    icon: "🌐",
  },
  scenario: {
    label: "Scenario",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    icon: "🎯",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Mortgage Lender": "bg-emerald-500",
  Attorney: "bg-purple-500",
  "Home Inspector": "bg-amber-500",
  "Insurance Agent": "bg-cyan-500",
  Realtor: "bg-blue-500",
};

function GroupCard({ group }: { group: CuratedGroup }) {
  const partnerCount = getGroupPartnerCount(group);
  const owner = getProById(group.proId);
  const categories = ["Mortgage Lender", "Attorney", "Home Inspector", "Insurance Agent"] as const;

  // Collect first partner per category for mini preview
  const previewPartners = categories
    .map((cat) => {
      const partners = getGroupPartnersByCategory(group, cat);
      return partners[0] ? getProById(partners[0].proId) : null;
    })
    .filter(Boolean);

  return (
    <Link href={`/pro/groups/${group.id}`}>
      <Card hover padding="none" className="group relative overflow-hidden">
        {/* Ambient glow based on tag type */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {group.tags.includes("lead_source") && (
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
          )}
          {group.tags.includes("language") && (
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />
          )}
          {group.tags.includes("scenario") && (
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
          )}
        </div>

        <div className="relative p-5">
          {/* Header row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Group "cover" icon */}
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border ${
                group.isDefault
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-black/5 dark:bg-white/5 border-[var(--border)]"
              }`}>
                {group.isDefault ? (
                  <svg width="18" height="18" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                  </svg>
                ) : (
                  <span className="text-lg">
                    {group.tags[0] ? TAG_META[group.tags[0]].icon : "📋"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{group.name}</h3>
                  {group.isDefault && (
                    <Badge variant="warning" className="text-[10px] py-0">Default</Badge>
                  )}
                </div>
                {group.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5 line-clamp-1">{group.description}</p>
                )}
              </div>
            </div>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500 dark:text-slate-500 flex-shrink-0 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors mt-1">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {group.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-medium border ${TAG_META[tag].bgColor} ${TAG_META[tag].color}`}
              >
                {TAG_META[tag].label}
              </span>
            ))}
          </div>

          {/* Partner mini preview: category dots + avatars */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Category indicators */}
              <div className="flex gap-1">
                {categories.map((cat) => {
                  const hasPartner = getGroupPartnersByCategory(group, cat).length > 0;
                  return (
                    <div
                      key={cat}
                      className={`h-2 w-2 rounded-full ${hasPartner ? CATEGORY_COLORS[cat] : "bg-black/5 dark:bg-white/10"}`}
                      title={cat}
                    />
                  );
                })}
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-500">{partnerCount} partner{partnerCount !== 1 ? "s" : ""}</span>
            </div>

            {/* Avatar stack */}
            <div className="flex -space-x-1.5">
              {previewPartners.slice(0, 4).map((pro) => {
                if (!pro) return null;
                return (
                  <div
                    key={pro.id}
                    className="h-6 w-6 overflow-hidden rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)]"
                  >
                    <Image src={pro.headshotUrl} alt={pro.name} width={24} height={24} />
                  </div>
                );
              })}
              {previewPartners.length > 4 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--bg-card)] bg-[var(--bg-elevated)] text-[9px] text-slate-600 dark:text-slate-500">
                  +{previewPartners.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Share link preview */}
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              relaysapp.com/u/{owner?.username || "..."}/{group.slug}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CreateGroupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<CuratedGroupTag[]>([]);

  function toggleTag(tag: CuratedGroupTag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleCreate() {
    // Mock create — in production would call Supabase
    const newGroup: CuratedGroup = {
      id: `group_new_${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: description.trim() || undefined,
      tags: selectedTags,
      proId: "pro_9",
      partners: [],
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    mockCuratedGroups.push(newGroup);
    setName("");
    setDescription("");
    setSelectedTags([]);
    onClose();
  }

  return (
    <Modal open={open} title="Create New Group" onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Group Name"
          placeholder="e.g. Zillow Leads, Spanish, Luxury"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tags</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAG_META) as CuratedGroupTag[]).map((tag) => {
              const meta = TAG_META[tag];
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium border transition-all duration-200 ${
                    isSelected
                      ? `${meta.bgColor} ${meta.color} ring-1 ring-current/20`
                      : "border-[var(--border)] text-slate-600 dark:text-slate-500 hover:border-[var(--border-hover)] hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <span>{meta.icon}</span>
                  {meta.label}
                  {isSelected && (
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</span>
            <textarea
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none transition-all focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] resize-none"
              rows={3}
              placeholder="Brief description of when to use this group..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        {/* Preview slug */}
        {name.trim() && (
          <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border)] p-3">
            <div className="text-[10px] text-slate-600 dark:text-slate-500 mb-1">Share link preview</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              relaysapp.com/u/lisahartwell/
              <span className="text-blue-400">
                {name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!name.trim() || selectedTags.length === 0}
            onClick={handleCreate}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Create Group
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function ProGroupsPage() {
  const [showCreate, setShowCreate] = React.useState(false);
  const proId = "pro_9"; // Lisa Hartwell for demo
  const groups = getGroupsForPro(proId);

  // Sort: default first, then by creation date
  const sortedGroups = [...groups].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/pro/dashboard"
            className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-3"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Curated Groups</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Organize your referral partners by lead source, language, or scenario.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
            <path d="M12 4v16m8-8H4" />
          </svg>
          New Group
        </Button>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-300">Internal routing only</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Groups are backstage tools. Clients never see group names — they just see your curated Top 3 per category. 
              Each group gets a unique share link for different lead sources.
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Card padding="md">
          <div className="text-2xl font-bold text-blue-400">{groups.length}</div>
          <div className="text-xs text-slate-600 dark:text-slate-500 mt-1">Groups</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-emerald-400">
            {groups.reduce((sum, g) => sum + getGroupPartnerCount(g), 0)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-500 mt-1">Total Partners</div>
        </Card>
        <Card padding="md">
          <div className="text-2xl font-bold text-amber-400">{groups.length}</div>
          <div className="text-xs text-slate-600 dark:text-slate-500 mt-1">Share Links</div>
        </Card>
      </div>

      {/* Group cards grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sortedGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}

        {/* Create new card (ghost) */}
        <button
          onClick={() => setShowCreate(true)}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-black/[0.01] dark:bg-white/[0.01] p-8 hover:border-[var(--border-hover)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300 cursor-pointer group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border)] group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-300 mb-3">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
              <path d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Create a new group</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">Add partners by lead source, language, or scenario</span>
        </button>
      </div>

      <CreateGroupModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
