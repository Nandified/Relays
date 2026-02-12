"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { mockPros, serviceCategories } from "@/lib/mock-data";

export default function ProProfilePage() {
  // Use first pro as "current user" for demo
  const pro = mockPros[0];

  const [name, setName] = React.useState(pro.name);
  const [company, setCompany] = React.useState(pro.companyName);
  const [bio, setBio] = React.useState(pro.bio);
  const [blurb, setBlurb] = React.useState(pro.blurb);
  const [areas, setAreas] = React.useState(pro.serviceAreas.join(", "));
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([...pro.categories]);
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-slate-600">Update your public profile information</p>
        </div>
        <Button onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Photos */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Photos</h2>
        <div className="flex items-start gap-6">
          <div className="text-center">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-2 border-dashed border-[var(--border)] bg-slate-50 mx-auto mb-2">
              <Image src={pro.headshotUrl} alt={pro.name} width={96} height={96} />
            </div>
            <Button size="sm" variant="secondary">Change Headshot</Button>
          </div>
          <div className="text-center">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border)] bg-slate-50 mx-auto mb-2">
              <Image src={pro.companyLogoUrl} alt={pro.companyName} width={96} height={96} />
            </div>
            <Button size="sm" variant="secondary">Change Logo</Button>
          </div>
        </div>
      </Card>

      {/* Basic info */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Short Blurb</label>
            <textarea
              className="w-full rounded-2xl border border-[var(--border)] bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] min-h-[60px] resize-y"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="One-liner about your services..."
            />
            <p className="mt-1 text-xs text-slate-400">{blurb.length}/200 characters</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Bio</label>
            <textarea
              className="w-full rounded-2xl border border-[var(--border)] bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] min-h-[120px] resize-y"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential clients about your experience, specialties, and what makes you different..."
            />
          </div>
        </div>
      </Card>

      {/* Services */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Services</h2>
        <div className="flex flex-wrap gap-2">
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`
                rounded-full px-3.5 py-1.5 text-sm font-medium transition-all border
                ${selectedCategories.includes(cat)
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-white text-slate-600 border-[var(--border)] hover:border-slate-300"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* Service areas */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Service Areas</h2>
        <Input
          label="Areas (comma-separated)"
          value={areas}
          onChange={(e) => setAreas(e.target.value)}
          placeholder="Chicago, Evanston, Oak Park..."
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {areas.split(",").map((area) => area.trim()).filter(Boolean).map((area) => (
            <Badge key={area} variant="outline">{area}</Badge>
          ))}
        </div>
      </Card>

      {/* Intro video */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Intro Video</h2>
        <div className="aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-[var(--border)] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
              <svg width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 mb-2">Upload a 15–30 second intro video</p>
            <Button size="sm" variant="secondary">Upload Video</Button>
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary">Preview Profile</Button>
        <Button onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
