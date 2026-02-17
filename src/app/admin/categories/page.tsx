"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { mockServiceCategories, type ServiceCategoryConfig } from "@/lib/mock-admin-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState(mockServiceCategories);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newName, setNewName] = React.useState("");
  const [newIcon, setNewIcon] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newCredentials, setNewCredentials] = React.useState("");
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const editing = editingId ? categories.find(c => c.id === editingId) : null;
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newCat: ServiceCategoryConfig = {
      id: `cat_${Date.now()}`,
      name: newName.trim() as ServiceCategoryConfig["name"],
      icon: newIcon || "📋",
      description: newDescription,
      requiredCredentials: newCredentials.split(",").map(c => c.trim()).filter(Boolean),
      proCount: 0,
      enabled: true,
      order: categories.length + 1,
    };
    setCategories(prev => [...prev, newCat]);
    resetForm();
    setAddModalOpen(false);
  };

  const handleToggle = (id: string) => {
    setCategories(prev => prev.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const handleEdit = () => {
    if (!editingId || !newName.trim()) return;
    setCategories(prev => prev.map(c =>
      c.id === editingId ? {
        ...c,
        name: newName.trim() as ServiceCategoryConfig["name"],
        icon: newIcon || c.icon,
        description: newDescription || c.description,
        requiredCredentials: newCredentials ? newCredentials.split(",").map(cr => cr.trim()).filter(Boolean) : c.requiredCredentials,
      } : c
    ));
    setEditingId(null);
    resetForm();
  };

  const openEdit = (cat: ServiceCategoryConfig) => {
    setEditingId(cat.id);
    setNewName(cat.name);
    setNewIcon(cat.icon);
    setNewDescription(cat.description);
    setNewCredentials(cat.requiredCredentials.join(", "));
  };

  const resetForm = () => {
    setNewName("");
    setNewIcon("");
    setNewDescription("");
    setNewCredentials("");
  };

  // Drag & drop reorder
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...sorted];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update order values
    const updated = reordered.map((cat, i) => ({ ...cat, order: i + 1 }));
    setCategories(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const reordered = [...sorted];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    setCategories(reordered.map((cat, i) => ({ ...cat, order: i + 1 })));
  };

  const moveDown = (index: number) => {
    if (index >= sorted.length - 1) return;
    const reordered = [...sorted];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    setCategories(reordered.map((cat, i) => ({ ...cat, order: i + 1 })));
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Service Categories</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage professional categories. Drag to reorder display priority.
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Button>
      </div>

      {/* Categories list */}
      <div className="space-y-2">
        {sorted.map((cat, index) => (
          <div
            key={cat.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
            className={`transition-all duration-200 ${
              dragOverIndex === index && dragIndex !== index ? "translate-y-1 opacity-70" : ""
            }`}
          >
            <Card padding="none" className={`glow-violet ${dragIndex === index ? "opacity-50 scale-[0.98]" : ""}`}>
              <div className="flex items-center gap-4 px-4 py-3.5">
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 transition-colors">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="8" cy="6" r="1.5" />
                    <circle cx="16" cy="6" r="1.5" />
                    <circle cx="8" cy="12" r="1.5" />
                    <circle cx="16" cy="12" r="1.5" />
                    <circle cx="8" cy="18" r="1.5" />
                    <circle cx="16" cy="18" r="1.5" />
                  </svg>
                </div>

                {/* Order indicator */}
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-xs font-medium text-slate-600 dark:text-slate-500 border border-[var(--border)] tabular-nums">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/10 text-lg">
                  {cat.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{cat.name}</span>
                    {cat.enabled ? (
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px]">Disabled</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5 truncate">{cat.description}</p>
                  {/* Credentials */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {cat.requiredCredentials.map((cred) => (
                      <span key={cred} className="inline-flex rounded-md bg-black/5 dark:bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-500 border border-[var(--border)]">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pro count */}
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 tabular-nums">{cat.proCount}</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-500">pros</div>
                </div>

                {/* Move buttons */}
                <div className="flex flex-col gap-0.5 hidden sm:flex">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="rounded-lg p-1 text-slate-500 dark:text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-400 transition-colors disabled:opacity-30"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sorted.length - 1}
                    className="rounded-lg p-1 text-slate-500 dark:text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-400 transition-colors disabled:opacity-30"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(cat)}
                    className="rounded-xl p-2 text-slate-600 dark:text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    title="Edit"
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggle(cat.id)}
                    className={`rounded-xl p-2 transition-colors ${
                      cat.enabled
                        ? "text-emerald-500 hover:bg-emerald-500/10"
                        : "text-slate-500 dark:text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    title={cat.enabled ? "Disable" : "Enable"}
                  >
                    {cat.enabled ? (
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Add modal */}
      <Modal open={addModalOpen} title="Add Service Category" onClose={() => { setAddModalOpen(false); resetForm(); }}>
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g., Title Company"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Icon (emoji)"
            placeholder="e.g., 📄"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
          />
          <Input
            label="Description"
            placeholder="Short description of this service category"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Input
            label="Required Credentials (comma-separated)"
            placeholder="e.g., State License, Certification"
            value={newCredentials}
            onChange={(e) => setNewCredentials(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setAddModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAdd}>Add Category</Button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editingId !== null}
        title={`Edit: ${editing?.name ?? ""}`}
        onClose={() => { setEditingId(null); resetForm(); }}
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Icon (emoji)"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
          />
          <Input
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Input
            label="Required Credentials (comma-separated)"
            value={newCredentials}
            onChange={(e) => setNewCredentials(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setEditingId(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
