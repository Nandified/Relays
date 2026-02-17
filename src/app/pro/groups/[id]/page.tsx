"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  getGroupById,
  getProById,
  getGroupPartnersByCategory,
  mockPros,
  mockCuratedGroups,
} from "@/lib/mock-data";
import type { CuratedGroupTag, CuratedGroup, ProServiceCategory } from "@/lib/types";

const TAG_META: Record<CuratedGroupTag, { label: string; color: string; bgColor: string; icon: string }> = {
  lead_source: { label: "Lead Source", color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", icon: "📡" },
  language: { label: "Language", color: "text-violet-400", bgColor: "bg-violet-500/10 border-violet-500/20", icon: "🌐" },
  scenario: { label: "Scenario", color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/20", icon: "🎯" },
};

const ROLE_META: Record<string, { icon: string; colorBg: string }> = {
  "Mortgage Lender": { icon: "💰", colorBg: "bg-emerald-500/10 border-emerald-500/20" },
  Attorney: { icon: "⚖️", colorBg: "bg-purple-500/10 border-purple-500/20" },
  "Home Inspector": { icon: "🔍", colorBg: "bg-amber-500/10 border-amber-500/20" },
  "Insurance Agent": { icon: "🛡️", colorBg: "bg-cyan-500/10 border-cyan-500/20" },
};

const PARTNER_CATEGORIES: ProServiceCategory[] = ["Mortgage Lender", "Attorney", "Home Inspector", "Insurance Agent"];
const POSITION_LABELS = ["1st", "2nd", "3rd"];
const POSITION_GLOW = ["shadow-[0_0_12px_rgba(245,158,11,0.25)]", "shadow-[0_0_10px_rgba(148,163,184,0.15)]", "shadow-[0_0_8px_rgba(168,113,72,0.15)]"];
const POSITION_BORDER = ["border-amber-400/40", "border-slate-300 dark:border-slate-400/30", "border-amber-700/30"];
const POSITION_TEXT = ["text-amber-400", "text-slate-500 dark:text-slate-400", "text-amber-700"];

function AddPartnerModal({ open, onClose, category, existingProIds, onAdd }: {
  open: boolean; onClose: () => void; category: ProServiceCategory; existingProIds: string[]; onAdd: (proId: string) => void;
}) {
  const [search, setSearch] = React.useState("");
  const availablePros = mockPros
    .filter((p) => p.categories.includes(category))
    .filter((p) => !existingProIds.includes(p.id))
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.companyName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal open={open} title={`Add ${category}`} onClose={onClose}>
      <div className="space-y-3">
        <Input placeholder={`Search ${category.toLowerCase()}s...`} value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {availablePros.map((pro) => (
            <button key={pro.id} onClick={() => { onAdd(pro.id); onClose(); }}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left border border-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:border-[var(--border)] transition-all duration-200">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0">
                <Image src={pro.headshotUrl} alt={pro.name} width={40} height={40} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{pro.name}</span>
                  {pro.verified && <Badge variant="accent" className="text-[9px] py-0">✓</Badge>}
                </div>
                <div className="text-xs text-slate-500">{pro.companyName}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                <svg width="10" height="10" fill="#f59e0b" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" /></svg>
                {pro.rating.toFixed(1)}
              </div>
            </button>
          ))}
          {availablePros.length === 0 && <div className="py-6 text-center text-sm text-slate-500">No {category.toLowerCase()}s available to add.</div>}
        </div>
      </div>
    </Modal>
  );
}

function PartnerCard({ proId, position, onMoveUp, onMoveDown, onRemove, isFirst, isLast }: {
  proId: string; position: number; onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void; isFirst: boolean; isLast: boolean;
}) {
  const pro = getProById(proId);
  if (!pro) return null;
  const posIdx = position - 1;
  const label = POSITION_LABELS[posIdx] || `${position}th`;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 p-3.5 group hover:border-[var(--border-hover)] transition-all duration-200">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border font-bold text-xs ${POSITION_BORDER[posIdx] || "border-[var(--border)]"} ${POSITION_GLOW[posIdx] || ""} bg-black/5 dark:bg-white/5`}>
        <span className={POSITION_TEXT[posIdx] || "text-slate-500"}>{label}</span>
      </div>
      <div className="h-10 w-10 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0">
        <Image src={pro.headshotUrl} alt={pro.name} width={40} height={40} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{pro.name}</span>
          {pro.verified && <Badge variant="accent" className="text-[9px] py-0">✓</Badge>}
        </div>
        <div className="text-xs text-slate-500">{pro.companyName}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="flex items-center gap-0.5 text-[11px] text-amber-400">
            <svg width="9" height="9" fill="currentColor" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" /></svg>
            {pro.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-600">{pro.reviewCount} reviews</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
        <button onClick={onMoveUp} disabled={isFirst} className="rounded-lg p-1.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move up">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" /></svg>
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="rounded-lg p-1.5 text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Move down">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button onClick={onRemove} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Remove partner">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

function ShareLinkPreview({ group }: { group: CuratedGroup }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 mt-4">
      <div className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-wider mb-3">Client preview</div>
      <div className="space-y-2">
        {PARTNER_CATEGORIES.map((cat) => {
          const partners = getGroupPartnersByCategory(group, cat);
          if (partners.length === 0) return null;
          return (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 w-24 flex-shrink-0 truncate">{cat}</span>
              <div className="flex -space-x-1">
                {partners.slice(0, 3).map((p) => {
                  const pro = getProById(p.proId);
                  if (!pro) return null;
                  return <div key={p.proId} className="h-5 w-5 overflow-hidden rounded-full border border-[var(--bg-elevated)] bg-[var(--bg-card)]"><Image src={pro.headshotUrl} alt={pro.name} width={20} height={20} /></div>;
                })}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-600">{partners.slice(0, 3).map((p) => getProById(p.proId)?.name.split(" ")[0]).filter(Boolean).join(", ")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [group, setGroup] = React.useState<CuratedGroup | null>(null);
  const [editingName, setEditingName] = React.useState(false);
  const [editingDesc, setEditingDesc] = React.useState(false);
  const [nameValue, setNameValue] = React.useState("");
  const [descValue, setDescValue] = React.useState("");
  const [addingCategory, setAddingCategory] = React.useState<ProServiceCategory | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const g = getGroupById(id);
    if (g) { setGroup({ ...g, partners: [...g.partners] }); setNameValue(g.name); setDescValue(g.description || ""); }
  }, [id]);

  if (!group) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">📋</div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Group not found</h1>
          <p className="text-sm text-slate-500">This group may have been removed.</p>
          <Link href="/pro/groups"><Button className="mt-4">Back to Groups</Button></Link>
        </div>
      </div>
    );
  }

  const owner = getProById(group.proId);
  const shareUrl = `relaysapp.com/u/${owner?.username || "..."}/${group.slug}`;

  function handleSaveName() { setGroup((prev) => prev ? { ...prev, name: nameValue } : prev); setEditingName(false); }
  function handleSaveDesc() { setGroup((prev) => prev ? { ...prev, description: descValue || undefined } : prev); setEditingDesc(false); }

  function handleToggleDefault() {
    if (!group) return;
    const newDefault = !group.isDefault;
    if (newDefault) { mockCuratedGroups.forEach((g) => { if (g.proId === group.proId) g.isDefault = false; }); }
    const real = mockCuratedGroups.find((g) => g.id === group.id);
    if (real) real.isDefault = newDefault;
    setGroup((prev) => prev ? { ...prev, isDefault: newDefault } : prev);
  }

  function handleAddPartner(category: ProServiceCategory, proId: string) {
    setGroup((prev) => {
      if (!prev) return prev;
      const existing = prev.partners.filter((p) => p.category === category);
      if (existing.length >= 3) return prev;
      return { ...prev, partners: [...prev.partners, { proId, category, position: existing.length + 1, addedAt: new Date().toISOString() }] };
    });
  }

  function handleRemovePartner(category: ProServiceCategory, proId: string) {
    setGroup((prev) => {
      if (!prev) return prev;
      const updated = prev.partners.filter((p) => !(p.category === category && p.proId === proId));
      let pos = 0;
      return { ...prev, partners: updated.map((p) => { if (p.category === category) { pos++; return { ...p, position: pos }; } return p; }) };
    });
  }

  function handleMovePartner(category: ProServiceCategory, proId: string, direction: "up" | "down") {
    setGroup((prev) => {
      if (!prev) return prev;
      const catPartners = prev.partners.filter((p) => p.category === category).sort((a, b) => a.position - b.position);
      const idx = catPartners.findIndex((p) => p.proId === proId);
      if (idx < 0) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= catPartners.length) return prev;
      const tempPos = catPartners[idx].position;
      catPartners[idx] = { ...catPartners[idx], position: catPartners[swapIdx].position };
      catPartners[swapIdx] = { ...catPartners[swapIdx], position: tempPos };
      return { ...prev, partners: [...prev.partners.filter((p) => p.category !== category), ...catPartners] };
    });
  }

  function handleCopyLink() {
    navigator.clipboard?.writeText(`https://${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-20">
      <div className="mb-6">
        <Link href="/pro/groups" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          All Groups
        </Link>
      </div>

      {/* Group Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-[var(--border)] liquid-glass">
        <div className="absolute inset-0 pointer-events-none">
          {group.tags.includes("lead_source") && <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/8 blur-3xl" />}
          {group.tags.includes("language") && <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-500/8 blur-3xl" />}
          {group.tags.includes("scenario") && <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-500/8 blur-3xl" />}
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />
        </div>
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {group.tags.map((tag) => (
              <span key={tag} className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-medium border ${TAG_META[tag].bgColor} ${TAG_META[tag].color}`}>
                {TAG_META[tag].icon} {TAG_META[tag].label}
              </span>
            ))}
            {group.isDefault && (
              <Badge variant="warning" className="text-[10px]">
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" className="mr-0.5"><path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" /></svg>
                Default
              </Badge>
            )}
          </div>

          {editingName ? (
            <div className="flex items-center gap-2 mb-2">
              <input autoFocus className="bg-transparent text-2xl font-bold text-slate-900 dark:text-white outline-none border-b border-blue-500/40 pb-0.5" value={nameValue}
                onChange={(e) => setNameValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveName()} onBlur={handleSaveName} />
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="group/name flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{group.name}</h1>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500 dark:text-slate-600 opacity-0 group-hover/name:opacity-100 transition-opacity"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
          )}

          {editingDesc ? (
            <div className="mb-4">
              <textarea autoFocus className="w-full bg-transparent text-sm text-slate-500 dark:text-slate-400 outline-none border border-[var(--border)] rounded-xl p-2 resize-none" value={descValue} rows={2}
                onChange={(e) => setDescValue(e.target.value)} onBlur={handleSaveDesc} />
            </div>
          ) : (
            <button onClick={() => setEditingDesc(true)} className="group/desc flex items-center gap-2 mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-left">{group.description || "Add a description..."}</p>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500 dark:text-slate-600 opacity-0 group-hover/desc:opacity-100 transition-opacity flex-shrink-0"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
            <button onClick={handleToggleDefault} className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${group.isDefault ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "border-[var(--border)] text-slate-500 hover:border-amber-500/20 hover:text-amber-400"}`}>
              <svg width="12" height="12" fill={group.isDefault ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              {group.isDefault ? "Default Group" : "Set as Default"}
            </button>
            <span className="text-xs text-slate-500">{group.partners.length} partner{group.partners.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Share Link */}
      <Card padding="md" className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">Share Link</h3>
            <p className="text-[11px] text-slate-500">Clients who visit this link see your curated partners</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2 text-xs text-blue-400 font-mono">https://{shareUrl}</code>
          <Button size="sm" variant="secondary" onClick={handleCopyLink}>
            {copied ? <><svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" className="mr-1 text-emerald-400"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>Copied</> : "Copy"}
          </Button>
        </div>
        <ShareLinkPreview group={group} />
      </Card>

      {/* Partner Categories */}
      <div className="space-y-6 stagger-children">
        {PARTNER_CATEGORIES.map((category) => {
          const meta = ROLE_META[category];
          const partners = getGroupPartnersByCategory(group, category);
          return (
            <div key={category} className="rounded-3xl border border-[var(--border)] overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${meta.colorBg} text-lg`}>{meta.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{category}</h3>
                    <p className="text-[11px] text-slate-500">{partners.length}/3 partner{partners.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                {partners.length < 3 && (
                  <Button size="sm" variant="secondary" onClick={() => setAddingCategory(category)}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><path d="M12 4v16m8-8H4" /></svg>
                    Add
                  </Button>
                )}
              </div>
              <div className="px-5 pb-5 space-y-2">
                {partners.map((partner, idx) => (
                  <PartnerCard
                    key={partner.proId}
                    proId={partner.proId}
                    position={partner.position}
                    isFirst={idx === 0}
                    isLast={idx === partners.length - 1}
                    onMoveUp={() => handleMovePartner(category, partner.proId, "up")}
                    onMoveDown={() => handleMovePartner(category, partner.proId, "down")}
                    onRemove={() => handleRemovePartner(category, partner.proId)}
                  />
                ))}
                {partners.length === 0 && (
                  <button onClick={() => setAddingCategory(category)} className="flex w-full items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-black/[0.01] dark:bg-white/[0.01] p-6 hover:border-[var(--border-hover)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all">
                    <div className="text-center">
                      <svg width="18" height="18" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-1"><path d="M12 4v16m8-8H4" /></svg>
                      <span className="text-xs text-slate-500">Add a {category.toLowerCase()}</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {addingCategory && (
        <AddPartnerModal
          open={!!addingCategory}
          onClose={() => setAddingCategory(null)}
          category={addingCategory}
          existingProIds={group.partners.filter((p) => p.category === addingCategory).map((p) => p.proId)}
          onAdd={(proId) => handleAddPartner(addingCategory, proId)}
        />
      )}
    </div>
  );
}
