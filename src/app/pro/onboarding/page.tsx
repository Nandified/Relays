"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/provider";
import { type ProServiceCategory } from "@/lib/types";
import { getAllPlaces, claimPlace, type PlacesResult } from "@/lib/google-places";
import { ClaimProfileBanner } from "@/components/marketplace/ClaimProfileBanner";

const categories: { value: ProServiceCategory; label: string; icon: string }[] = [
  { value: "Realtor", label: "Realtor", icon: "🏠" },
  { value: "Mortgage Lender", label: "Mortgage Lender", icon: "🏦" },
  { value: "Attorney", label: "Attorney", icon: "⚖️" },
  { value: "Home Inspector", label: "Home Inspector", icon: "🔍" },
  { value: "Insurance Agent", label: "Insurance Agent", icon: "🛡️" },
];

export default function ProOnboardingPage() {
  const router = useRouter();
  const { state, updateProOnboarding } = useAuth();

  const [step, setStep] = React.useState(1);
  const [selectedCategory, setSelectedCategory] = React.useState<ProServiceCategory | null>(null);
  const [companyName, setCompanyName] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [serviceArea, setServiceArea] = React.useState("");
  const [headshotUploaded, setHeadshotUploaded] = React.useState(false);
  const [logoUploaded, setLogoUploaded] = React.useState(false);
  const [matchingPlaces, setMatchingPlaces] = React.useState<PlacesResult[]>([]);
  const [claimedPlace, setClaimedPlace] = React.useState<PlacesResult | null>(null);
  const [showClaimStep, setShowClaimStep] = React.useState(false);

  // New enhancement fields
  const [socialLinks, setSocialLinks] = React.useState({ linkedin: "", instagram: "", facebook: "" });
  const [additionalAreas, setAdditionalAreas] = React.useState("");
  const [introVideoUploaded, setIntroVideoUploaded] = React.useState(false);
  const [googleImported, setGoogleImported] = React.useState(false);

  React.useEffect(() => {
    if (state.status !== "authed" || state.user.role !== "pro") {
      router.push("/signup");
    }
  }, [state, router]);

  if (state.status !== "authed") return null;

  const totalSteps = 7;

  const canProceed = () => {
    switch (step) {
      case 1: return selectedCategory !== null;
      case 2: return companyName.trim() !== "" && fullName.trim() !== "";
      case 3: return serviceArea.trim() !== "";
      case 4: return true; // photos optional
      case 5: return true; // social links optional
      case 6: return true; // video optional
      case 7: return true; // preview
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 2 && !showClaimStep) {
      // After entering company name, check for matching Google Places
      const allPlaces = getAllPlaces();
      const matches = allPlaces.filter(p =>
        p.categories.includes(selectedCategory!) && !p.claimed
      );
      if (matches.length > 0) {
        setMatchingPlaces(matches);
        setShowClaimStep(true);
        return;
      }
    }

    if (showClaimStep) {
      setShowClaimStep(false);
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      updateProOnboarding({
        category: selectedCategory,
        companyName,
        fullName,
        serviceArea,
        headshotUploaded,
        logoUploaded,
        onboardingComplete: true,
      });
      router.push("/pro/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-lg mb-4">
          🚀
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Set up your profile</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Let&apos;s get your business listed on Relays</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 px-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-emerald-400">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Category */}
      {step === 1 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">What type of service do you provide?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select your primary service category</p>

          <div className="grid gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`
                  flex items-center gap-4 rounded-2xl border p-4 text-left transition-all
                  ${selectedCategory === cat.value
                    ? "border-[var(--accent)]/40 bg-[var(--accent-light)] shadow-[var(--glow-accent)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
                  }
                `}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-sm font-medium ${selectedCategory === cat.value ? "text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                  {cat.label}
                </span>
                {selectedCategory === cat.value && (
                  <div className="ml-auto h-5 w-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 2: Company & Name */}
      {step === 2 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Tell us about your business</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will appear on your public profile</p>

          <div className="space-y-4">
            <Input
              label="Your Full Name"
              placeholder="e.g., Jordan Lee"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Company / Business Name"
              placeholder="e.g., Sunrise Mortgage"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* Claim step (appears after step 2 if matching places found) */}
      {step === 2 && showClaimStep && matchingPlaces.length > 0 && (
        <div className="animate-in space-y-3 mt-4">
          <div className="text-center mb-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">We found businesses matching your category. Is one of these yours?</p>
          </div>
          {matchingPlaces.slice(0, 3).map((place) => (
            <ClaimProfileBanner
              key={place.placeId}
              place={place}
              onClaim={() => {
                setClaimedPlace(place);
                setCompanyName(place.name);
                setShowClaimStep(false);
                setStep(3);
              }}
              onSkip={() => {
                setShowClaimStep(false);
                setStep(3);
              }}
            />
          ))}
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => { setShowClaimStep(false); setStep(3); }}
          >
            None of these — continue manually
          </Button>
        </div>
      )}

      {/* Step 3: Service Area */}
      {step === 3 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Where do you serve?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enter your primary service area</p>

          <div className="space-y-4">
            <Input
              label="City, ZIP, or Area"
              placeholder="e.g., Chicago, IL or 60614"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              You can add more service areas after completing setup.
            </p>
          </div>
        </Card>
      )}

      {/* Step 4: Photos */}
      {step === 4 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Upload your photos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">These help clients recognize you</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Headshot */}
            <button
              onClick={() => setHeadshotUploaded(true)}
              className={`
                flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all
                ${headshotUploaded
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                }
              `}
            >
              {headshotUploaded ? (
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border)] flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
              )}
              <div className="text-center">
                <div className={`text-sm font-medium ${headshotUploaded ? "text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                  {headshotUploaded ? "Headshot uploaded" : "Upload headshot"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {headshotUploaded ? "Click to change" : "Professional photo"}
                </div>
              </div>
            </button>

            {/* Logo */}
            <button
              onClick={() => setLogoUploaded(true)}
              className={`
                flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all
                ${logoUploaded
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                }
              `}
            >
              {logoUploaded ? (
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border)] flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
              )}
              <div className="text-center">
                <div className={`text-sm font-medium ${logoUploaded ? "text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                  {logoUploaded ? "Logo uploaded" : "Upload company logo"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {logoUploaded ? "Click to change" : "Square format preferred"}
                </div>
              </div>
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            You can skip this step and upload photos later from your profile settings.
          </p>
        </Card>
      )}

      {/* Step 5: Social Links */}
      {step === 5 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Add your social links</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Help clients find and verify you online</p>
          <div className="space-y-4">
            <Input
              label="LinkedIn"
              placeholder="linkedin.com/in/yourname"
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
            />
            <Input
              label="Instagram"
              placeholder="@yourhandle"
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
            />
            <Input
              label="Facebook"
              placeholder="facebook.com/yourbusiness"
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
            />

            {/* Import from Google */}
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center">
              <button
                onClick={() => {
                  setGoogleImported(true);
                  setSocialLinks({ linkedin: "linkedin.com/in/yourname", instagram: "@yourbusiness", facebook: "facebook.com/yourbusiness" });
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  googleImported
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-black/5 dark:bg-white/5 border border-[var(--border)] text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {googleImported ? (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Imported from Google
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Import from Google Business
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-600 mt-2">
                Auto-fill from your Google Business Profile
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            All social links are optional. You can add or edit them later.
          </p>
        </Card>
      )}

      {/* Step 6: Service Areas & Intro Video */}
      {step === 6 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Expand your reach</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add more service areas and an intro video</p>
          <div className="space-y-6">
            <div>
              <Input
                label="Additional Service Areas"
                placeholder="e.g., Naperville, Schaumburg, 60540"
                value={additionalAreas}
                onChange={(e) => setAdditionalAreas(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Separate with commas. Currently serving: {serviceArea || "Not set"}</p>
            </div>

            {/* Intro Video Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Intro Video (optional)</label>
              <button
                onClick={() => setIntroVideoUploaded(!introVideoUploaded)}
                className={`w-full flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer ${
                  introVideoUploaded
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                }`}
              >
                {introVideoUploaded ? (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-emerald-400">Video uploaded!</div>
                      <div className="text-xs text-slate-500">Click to replace</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-14 w-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border)] flex items-center justify-center">
                      <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload an intro video</div>
                      <div className="text-xs text-slate-500 mt-0.5">30-60 seconds — let clients see the real you</div>
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 7: Profile Preview */}
      {step === 7 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Preview your profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This is how clients will see you on Relays</p>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            {/* Preview Card */}
            <div className="flex items-start gap-4">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold ${
                headshotUploaded ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-blue-500/10 border border-blue-500/20"
              }`}>
                {headshotUploaded ? "📷" : fullName.charAt(0) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{fullName || "Your Name"}</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400">
                    {selectedCategory || "Category"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{companyName || "Your Company"}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {serviceArea || "Your Area"}{additionalAreas ? `, ${additionalAreas}` : ""}
                  </span>
                </div>
                {(socialLinks.linkedin || socialLinks.instagram) && (
                  <div className="flex items-center gap-2 mt-2">
                    {socialLinks.linkedin && (
                      <span className="text-[10px] text-slate-500 bg-black/5 dark:bg-white/5 rounded-md px-2 py-0.5">LinkedIn</span>
                    )}
                    {socialLinks.instagram && (
                      <span className="text-[10px] text-slate-500 bg-black/5 dark:bg-white/5 rounded-md px-2 py-0.5">Instagram</span>
                    )}
                  </div>
                )}
                {introVideoUploaded && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
                    <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 5a1 1 0 011.5-.87l4 2.5a1 1 0 010 1.74l-4 2.5A1 1 0 017 13V8z" />
                    </svg>
                    Intro video attached
                  </div>
                )}
              </div>
            </div>

            {/* Stats preview */}
            <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">New</div>
                <div className="text-[10px] text-slate-500">Rating</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">0</div>
                <div className="text-[10px] text-slate-500">Reviews</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-400">✓</div>
                <div className="text-[10px] text-slate-500">Accepting</div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center">
            Looks good? Complete your setup and start receiving referrals!
          </p>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={handleBack}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={handleNext} disabled={!canProceed()}>
          {step === totalSteps ? "Complete Setup" : "Continue"}
          {step < totalSteps && (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
    </main>
  );
}
