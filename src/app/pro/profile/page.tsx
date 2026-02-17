"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { mockPros, serviceCategories } from "@/lib/mock-data";

const SPECIALTIES = [
  "First-time Buyers",
  "Luxury Homes",
  "Investment Properties",
  "Condos & Townhomes",
  "New Construction",
  "Older Construction",
  "Foreclosures",
  "Commercial",
  "Relocation",
  "Downsizing",
  "FHA Loans",
  "VA Loans",
  "Conventional",
  "Refinancing",
  "Radon Testing",
  "Mold Inspection",
  "Structural",
  "Contract Review",
  "Bilingual (Spanish)",
];

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", prefix: "instagram.com/", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  )},
  { key: "linkedin", label: "LinkedIn", prefix: "linkedin.com/in/", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )},
  { key: "facebook", label: "Facebook", prefix: "facebook.com/", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { key: "tiktok", label: "TikTok", prefix: "tiktok.com/@", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  )},
  { key: "youtube", label: "YouTube", prefix: "youtube.com/@", icon: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  )},
] as const;

export default function ProProfileEditPage() {
  const pro = mockPros[0];

  const [name, setName] = React.useState(pro.name);
  const [company, setCompany] = React.useState(pro.companyName);
  const [bio, setBio] = React.useState(pro.bio);
  const [blurb, setBlurb] = React.useState(pro.blurb);
  const [areas, setAreas] = React.useState(pro.serviceAreas.join(", "));
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([...pro.categories]);
  const [saved, setSaved] = React.useState(false);

  // NEW: Social links
  const [socialLinks, setSocialLinks] = React.useState<Record<string, string>>({
    instagram: pro.socialLinks?.instagram ?? "",
    linkedin: pro.socialLinks?.linkedin ?? "",
    facebook: pro.socialLinks?.facebook ?? "",
    tiktok: pro.socialLinks?.tiktok ?? "",
    youtube: pro.socialLinks?.youtube ?? "",
  });

  // NEW: Specialties
  const [selectedSpecialties, setSelectedSpecialties] = React.useState<string[]>(pro.specialties ?? []);

  // NEW: Video upload state
  const [videoUploaded, setVideoUploaded] = React.useState(!!pro.introVideoUrl);
  const [videoFileName, setVideoFileName] = React.useState(pro.introVideoUrl ? "intro-video.mp4" : "");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleVideoUpload = () => {
    // Mock upload — in real app this would open file picker
    setVideoUploaded(true);
    setVideoFileName("intro-video.mp4");
  };

  const handleVideoRemove = () => {
    setVideoUploaded(false);
    setVideoFileName("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Profile</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Update your public profile information</p>
        </div>
        <Button onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Verification CTA for unverified */}
      {!pro.verified && (
        <Card padding="lg" className="mb-6 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/10 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-400">Get verified — submit your license</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Verified pros earn more trust. Upload your license or enter your license number.</p>
              <Button size="sm" className="mt-3">Submit Credentials</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Photos — headshot + company logo */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Photos</h2>
        <div className="flex items-start gap-6">
          <div className="text-center">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)] mx-auto mb-2">
              <Image src={pro.headshotUrl} alt={pro.name} width={96} height={96} />
            </div>
            <Button size="sm" variant="secondary">Change Headshot</Button>
          </div>
          <div className="text-center">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-elevated)] mx-auto mb-2">
              <Image src={pro.companyLogoUrl} alt={pro.companyName} width={96} height={96} />
            </div>
            <Button size="sm" variant="secondary">Change Logo</Button>
          </div>
        </div>
      </Card>

      {/* Basic info */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Short Blurb</label>
            <textarea
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] min-h-[60px] resize-y"
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="One-liner about your services..."
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{blurb.length}/200 characters</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Bio</label>
            <textarea
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] min-h-[120px] resize-y"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential clients about your experience, specialties, and what makes you different..."
            />
          </div>
        </div>
      </Card>

      {/* ── Intro Video (Enhanced) ── */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Intro Video</h2>
        <p className="text-xs text-slate-600 dark:text-slate-500 mb-4">Upload a 15–30 second intro video. Shown on your profile above your bio.</p>

        {videoUploaded ? (
          /* Video preview + controls */
          <div>
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-hover)] liquid-glass">
              <div className="aspect-video bg-gradient-to-br from-[#0e0e18] to-[#141420] flex items-center justify-center relative">
                {/* Ambient glow */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-500/15 rounded-full blur-3xl" />
                </div>
                {/* Play button */}
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24" className="ml-1">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10">
                  0:24
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-500">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{videoFileName}</span>
                <Badge variant="success">Uploaded</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleVideoUpload}>Replace</Button>
                <Button size="sm" variant="ghost" onClick={handleVideoRemove}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Upload zone */
          <div className="rounded-2xl bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
            onClick={handleVideoUpload}
          >
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border)] shadow-sm flex items-center justify-center mb-3">
                  <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Drop a video here or click to upload</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">MP4 or MOV · Max 30 seconds · 16:9 or 9:16</p>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleVideoUpload(); }}>
                    Upload Video
                  </Button>
                  <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Record New
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Services */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Services</h2>
        <div className="flex flex-wrap gap-2">
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`
                rounded-full px-3.5 py-1.5 text-sm font-medium transition-all border
                ${selectedCategories.includes(cat)
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : "bg-[var(--bg-card)] text-slate-600 dark:text-slate-400 border-[var(--border)] hover:border-[var(--border-hover)]"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Specialties / Tags (NEW) ── */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Specialties</h2>
        <p className="text-xs text-slate-600 dark:text-slate-500 mb-4">Select tags that describe your expertise. Shown on your profile and used for matching.</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => toggleSpecialty(spec)}
              className={`
                rounded-full px-3 py-1.5 text-xs font-medium transition-all border
                ${selectedSpecialties.includes(spec)
                  ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  : "bg-[var(--bg-card)] text-slate-600 dark:text-slate-500 border-[var(--border)] hover:border-[var(--border-hover)] hover:text-slate-700 dark:hover:text-slate-300"
                }
              `}
            >
              {selectedSpecialties.includes(spec) && "✓ "}
              {spec}
            </button>
          ))}
        </div>
        {selectedSpecialties.length > 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">{selectedSpecialties.length} selected</p>
        )}
      </Card>

      {/* Service areas (enhanced with city chips) */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Service Areas</h2>
        <p className="text-xs text-slate-600 dark:text-slate-500 mb-4">Cities and neighborhoods you serve</p>
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
        {/* Map placeholder */}
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] h-32 flex items-center justify-center">
          <div className="text-center">
            <svg width="24" height="24" fill="none" stroke="#475569" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-1">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-500">Map visualization coming soon</p>
          </div>
        </div>
      </Card>

      {/* ── Social Links (NEW) ── */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Social Links</h2>
        <p className="text-xs text-slate-600 dark:text-slate-500 mb-4">Connect your social profiles. Displayed on your public profile.</p>
        <div className="space-y-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.key} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border)] flex items-center justify-center text-slate-600 dark:text-slate-500 flex-shrink-0">
                {platform.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden focus-within:border-[var(--accent)]/50 focus-within:ring-2 focus-within:ring-[var(--accent-light)]">
                  <span className="text-xs text-slate-500 dark:text-slate-500 pl-3 pr-1 whitespace-nowrap">{platform.prefix}</span>
                  <input
                    type="text"
                    value={socialLinks[platform.key] ?? ""}
                    onChange={(e) => setSocialLinks((prev) => ({ ...prev, [platform.key]: e.target.value }))}
                    className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-500 dark:placeholder:text-slate-500"
                    placeholder={`your-${platform.key}`}
                  />
                </div>
              </div>
            </div>
          ))}
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
