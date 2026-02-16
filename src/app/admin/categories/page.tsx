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

  const editing = editingId ? categories.find(c => c.id === editingId) : null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newCat: ServiceCategoryConfig = {
      id: `cat_${Date.now()}`,
      name: newName.trim() as ServiceCategoryConfig["name"],
      icon: newIcon || "📋",
      description: newDescription,
      requiredCredentials: [],
      proCount: 0,
      enabled: true,
      order: categories.length + 1,
    };
    setCategories(prev => [...prev, newCat]);
    setNewName("");
    setNewIcon("");
    setNewDescription("");
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
      c.id === editingId ? { ...c, name: newName.trim() as ServiceCategoryConfig["name"], icon: newIcon || c.icon, description: newDescription || c.description } : c
    ));
    setEditingId(null);
    setNewName("");
    setNewIcon("");
    setNewDescription("");
  };

  const openEdit = (cat: ServiceCategoryConfig) => {
    setEditingId(cat.id);
    setNewName(cat.name);
    setNewIcon(cat.icon);
    setNewDescription(cat.description);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Service Categories</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage the professional categories available on Relays.
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
      <div className="space-y-3">
        {categories
          .sort((a, b) => a.order - b.order)
          .map((cat, index) => (
            <Card key={cat.id} padding="none" className="glow-violet">
              <div className="flex items-center gap-4 px-4 py-3.5">
                {/* Order indicator */}
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-xs font-medium text-slate-500 border border-[var(--border)]">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/10 text-lg">
                  {cat.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{cat.name}</span>
                    {cat.enabled ? (
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px]">Disabled</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{cat.description}</p>
                </div>

                {/* Pro count */}
                <div className="text-center hidden sm:block">
                  <div className="text-sm font-medium text-slate-200">{cat.proCount}</div>
                  <div className="text-[10px] text-slate-500">pros</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(cat)}
                    className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-colors"
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
                        : "text-slate-600 hover:bg-white/5"
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
          ))}
      </div>

      {/* Add modal */}
      <Modal open={addModalOpen} title="Add Service Category" onClose={() => setAddModalOpen(false)}>
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
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Category</Button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editingId !== null}
        title={`Edit: ${editing?.name ?? ""}`}
        onClose={() => { setEditingId(null); setNewName(""); setNewIcon(""); setNewDescription(""); }}
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
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setEditingId(null); setNewName(""); setNewIcon(""); setNewDescription(""); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
