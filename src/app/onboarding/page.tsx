"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { consumerOnboardingGoals, consumerServiceNeeds } from "@/lib/mock-data-extended";

const totalSteps = 5;

export default function ConsumerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [hasRealtor, setHasRealtor] = useState<boolean | null>(null);
  const [realtorSearch, setRealtorSearch] = useState("");
  const [propertyInfo, setPropertyInfo] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<Set<string>>(new Set());

  const canProceed = () => {
    switch (step) {
      case 1: return goal !== null;
      case 2: return hasRealtor !== null;
      case 3: return true; // optional
      case 4: return true; // optional
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const toggleNeed = (id: string) => {
    setSelectedNeeds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((step / totalSteps) * 100);

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/10 text-lg mb-4">
          🏠
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to Relays</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Let&apos;s personalize your experience — this takes about 60 seconds</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-500 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <button onClick={handleSkip} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer">
            Skip — I&apos;ll explore on my own
          </button>
        </div>
        <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1: What brings you here? */}
      {step === 1 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">What brings you to Relays?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">This helps us tailor your experience</p>
          <div className="grid gap-3">
            {consumerOnboardingGoals.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  goal === g.id
                    ? "border-blue-500/40 bg-blue-500/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                }`}
              >
                <span className="text-2xl">{g.icon}</span>
                <div>
                  <span className={`text-sm font-medium ${goal === g.id ? "text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                    {g.label}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">{g.description}</p>
                </div>
                {goal === g.id && (
                  <div className="ml-auto h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
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

      {/* Step 2: Do you have a realtor? */}
      {step === 2 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Do you already have a Realtor?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">We can help you find one or connect with yours</p>
          <div className="grid gap-3 sm:grid-cols-2 mb-4">
            <button
              onClick={() => setHasRealtor(true)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all cursor-pointer ${
                hasRealtor === true
                  ? "border-blue-500/40 bg-blue-500/[0.08]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
              }`}
            >
              <span className="text-3xl">🤝</span>
              <span className={`text-sm font-medium ${hasRealtor === true ? "text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                Yes, I have one
              </span>
            </button>
            <button
              onClick={() => setHasRealtor(false)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all cursor-pointer ${
                hasRealtor === false
                  ? "border-blue-500/40 bg-blue-500/[0.08]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
              }`}
            >
              <span className="text-3xl">🔍</span>
              <span className={`text-sm font-medium ${hasRealtor === false ? "text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                No, help me find one
              </span>
            </button>
          </div>
          {hasRealtor === true && (
            <div className="animate-in">
              <Input
                label="Search for your Realtor"
                placeholder="Type their name or company..."
                value={realtorSearch}
                onChange={(e) => setRealtorSearch(e.target.value)}
              />
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-2">
                You can also find them later in the marketplace
              </p>
            </div>
          )}
          {hasRealtor === false && (
            <p className="text-xs text-slate-600 dark:text-slate-500 animate-in">
              No worries! After setup, we&apos;ll take you to the marketplace to browse top-rated Realtors in your area.
            </p>
          )}
        </Card>
      )}

      {/* Step 3: Property info */}
      {step === 3 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Where are you looking?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Optional — helps us show relevant professionals</p>
          <Input
            label="City, ZIP, or neighborhood"
            placeholder="e.g., Oak Park, IL or 60302"
            value={propertyInfo}
            onChange={(e) => setPropertyInfo(e.target.value)}
          />
          <p className="text-xs text-slate-600 dark:text-slate-500 mt-3">
            Don&apos;t know yet? That&apos;s totally fine — skip this step.
          </p>
        </Card>
      )}

      {/* Step 4: What do you need? */}
      {step === 4 && (
        <Card padding="lg" className="animate-in">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">What professionals do you need?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Select all that apply — we&apos;ll help you find them</p>
          <div className="grid gap-3">
            {consumerServiceNeeds.map((need) => (
              <button
                key={need.id}
                onClick={() => toggleNeed(need.id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  selectedNeeds.has(need.id)
                    ? "border-blue-500/40 bg-blue-500/[0.08]"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                }`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all flex-shrink-0 ${
                  selectedNeeds.has(need.id) ? "bg-blue-500 border-blue-500" : "border-[var(--border)]"
                }`}>
                  {selectedNeeds.has(need.id) && (
                    <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-lg">{need.icon}</span>
                <span className={`text-sm font-medium ${selectedNeeds.has(need.id) ? "text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                  {need.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-500 mt-4">
            Not sure? No worries — you can add professionals at any time.
          </p>
        </Card>
      )}

      {/* Step 5: Welcome */}
      {step === 5 && (
        <Card padding="lg" className="animate-in text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">You&apos;re all set!</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-xs mx-auto">
            Your personalized dashboard is ready. Here&apos;s what happens next:
          </p>
          <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
            {[
              { icon: "🔍", text: "Browse verified professionals in your area" },
              { icon: "👥", text: "Build your dream team of trusted pros" },
              { icon: "📋", text: "Track your journey from start to close" },
              { icon: "🔔", text: "Get notified when it's time for your next step" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3 bg-[var(--bg-elevated)] border border-[var(--border)]">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navigation */}
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
          {step === totalSteps ? "Go to Dashboard" : step === 3 || step === 4 ? "Continue" : "Next"}
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
