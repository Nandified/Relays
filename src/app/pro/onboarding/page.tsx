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

  React.useEffect(() => {
    if (state.status !== "authed" || state.user.role !== "pro") {
      router.push("/signup");
    }
  }, [state, router]);

  if (state.status !== "authed") return null;

  const canProceed = () => {
    switch (step) {
      case 1: return selectedCategory !== null;
      case 2: return companyName.trim() !== "" && fullName.trim() !== "";
      case 3: return serviceArea.trim() !== "";
      case 4: return true;
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

    if (step < 4) {
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
        <h1 className="text-2xl font-bold text-slate-100">Set up your profile</h1>
        <p className="mt-2 text-sm text-slate-400">Let&apos;s get your business listed on Relays</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 px-4">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className={`
              flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
              ${step === s
                ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : s < step
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-slate-600 border border-[var(--border)]"
              }
            `}>
              {s < step ? (
                <svg width="14" height="14" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : s}
            </div>
            {s < 4 && (
              <div className={`flex-1 h-px ${s < step ? "bg-emerald-500/50" : "bg-[var(--border)]"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Category */}
      {step === 1 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-100 mb-2">What type of service do you provide?</h2>
          <p className="text-sm text-slate-400 mb-6">Select your primary service category</p>

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
                <span className={`text-sm font-medium ${selectedCategory === cat.value ? "text-blue-400" : "text-slate-300"}`}>
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
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Tell us about your business</h2>
          <p className="text-sm text-slate-400 mb-6">This will appear on your public profile</p>

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
            <p className="text-sm text-slate-400">We found businesses matching your category. Is one of these yours?</p>
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
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Where do you serve?</h2>
          <p className="text-sm text-slate-400 mb-6">Enter your primary service area</p>

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
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Upload your photos</h2>
          <p className="text-sm text-slate-400 mb-6">These help clients recognize you</p>

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
                <div className="h-16 w-16 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
              )}
              <div className="text-center">
                <div className={`text-sm font-medium ${headshotUploaded ? "text-emerald-400" : "text-slate-300"}`}>
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
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-[var(--border)] flex items-center justify-center">
                  <svg width="24" height="24" fill="none" stroke="#64748b" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
              )}
              <div className="text-center">
                <div className={`text-sm font-medium ${logoUploaded ? "text-emerald-400" : "text-slate-300"}`}>
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
          {step === 4 ? "Complete Setup" : "Continue"}
          {step < 4 && (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
    </main>
  );
}
