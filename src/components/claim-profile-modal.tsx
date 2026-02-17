"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type UnclaimedProfessional, type ProfessionalIdType, type ProServiceCategory } from "@/lib/types";
import { getProfessionalIdFieldForCategory } from "@/lib/verification-service";

type ClaimStep = "license" | "identity" | "account" | "success";

interface ClaimProfileModalProps {
  professional: UnclaimedProfessional;
  open: boolean;
  onClose: () => void;
}

export function ClaimProfileModal({ professional, open, onClose }: ClaimProfileModalProps) {
  const [step, setStep] = React.useState<ClaimStep>("license");
  const [licenseNumber, setLicenseNumber] = React.useState("");
  const [licenseError, setLicenseError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [professionalId, setProfessionalId] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);

  const idField = getProfessionalIdFieldForCategory(professional.category);

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("license");
        setLicenseNumber("");
        setLicenseError("");
        setEmail("");
        setProfessionalId("");
        setIsVerifying(false);
        setAttempts(0);
      }, 300);
    }
  }, [open]);

  // Prevent body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLicenseSubmit = async () => {
    if (!licenseNumber.trim()) {
      setLicenseError("Please enter your license number");
      return;
    }
    if (attempts >= 3) {
      setLicenseError("Too many attempts. Please contact support.");
      return;
    }

    setIsVerifying(true);
    setLicenseError("");

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock: match if they enter something with 6+ chars
    const isMatch = licenseNumber.trim().length >= 6;
    setAttempts((a) => a + 1);

    if (isMatch) {
      setStep("identity");
    } else {
      setLicenseError(
        `This license number doesn't match this profile. ${3 - attempts - 1} attempt${3 - attempts - 1 !== 1 ? "s" : ""} remaining.`
      );
    }
    setIsVerifying(false);
  };

  const handleIdentitySubmit = async () => {
    if (!email.trim()) return;
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsVerifying(false);
    setStep("account");
  };

  const handleAccountSubmit = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsVerifying(false);
    setStep("success");
  };

  if (!open) return null;

  const steps: { key: ClaimStep; label: string }[] = [
    { key: "license", label: "License" },
    { key: "identity", label: "Verify" },
    { key: "account", label: "Account" },
    { key: "success", label: "Done" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:pt-[10vh]">
      {/* Backdrop */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-0 sm:mx-4 w-full max-w-lg animate-in">
        <div className="rounded-t-3xl sm:rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-modal)] backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Claim Your Profile
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verify your identity to take control of your listing
            </p>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-5">
              {steps.map((s, i) => (
                <React.Fragment key={s.key}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`
                        h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500
                        ${i < currentIndex
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : i === currentIndex
                            ? "bg-[var(--accent-light)] text-blue-500 dark:text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                            : "bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-[var(--border)]"
                        }
                      `}
                    >
                      {i < currentIndex ? (
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className={`text-xs hidden sm:block ${i <= currentIndex ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px transition-colors duration-500 ${i < currentIndex ? "bg-emerald-500/30" : "bg-[var(--border)]"}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Step 1: License Number */}
            {step === "license" && (
              <div className="animate-in">
                <div className="liquid-glass rounded-2xl p-5 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Enter your license number</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        This is the number on your IDFPR license. Only the real license holder would know this.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="IDFPR License Number"
                    placeholder="e.g., 471.012345"
                    value={licenseNumber}
                    onChange={(e) => { setLicenseNumber(e.target.value); setLicenseError(""); }}
                    error={licenseError}
                    className="font-mono"
                  />

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleLicenseSubmit}
                    disabled={isVerifying || !licenseNumber.trim()}
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifying…
                      </span>
                    ) : (
                      "Verify License Number"
                    )}
                  </Button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 text-center">
                  Your license number is verified against state records and is never shared publicly.
                </p>
              </div>
            )}

            {/* Step 2: Identity Verification */}
            {step === "identity" && (
              <div className="animate-in">
                <div className="liquid-glass rounded-2xl p-5 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-400 font-medium">License number matched!</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Now confirm your identity with your email
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    placeholder="your.email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {idField && (
                    <Input
                      label={`${idField.label} (optional)`}
                      placeholder={idField.placeholder}
                      value={professionalId}
                      onChange={(e) => setProfessionalId(e.target.value)}
                    />
                  )}

                  {idField && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {idField.description}. This is optional and stored as an additional trust signal.
                    </p>
                  )}

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleIdentitySubmit}
                    disabled={isVerifying || !email.trim()}
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Confirming…
                      </span>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Account Creation */}
            {step === "account" && (
              <div className="animate-in">
                <div className="liquid-glass rounded-2xl p-5 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Create your password</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Set a password to secure your account. You&apos;ll be able to edit your profile after claiming.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={professional.name}
                    disabled
                    className="opacity-60"
                  />
                  <Input
                    label="Email"
                    value={email}
                    disabled
                    className="opacity-60"
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a secure password"
                  />

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAccountSubmit}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Claiming profile…
                      </span>
                    ) : (
                      "Claim Profile"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="animate-in text-center py-4">
                {/* Celebration animation */}
                <div className="relative mx-auto mb-6">
                  <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-emerald-400">
                      <path
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {/* Sparkle particles */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-2 h-2 rounded-full bg-emerald-400/60 animate-ping" />
                  <div className="absolute top-2 right-1/4 w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-ping" style={{ animationDelay: "0.3s" }} />
                  <div className="absolute bottom-0 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-400/40 animate-ping" style={{ animationDelay: "0.6s" }} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Profile Claimed! 🎉
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Welcome to Relays, <span className="text-slate-800 dark:text-slate-200 font-medium">{professional.name}</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                  Your verified badge is now live. Complete your profile to attract more clients.
                </p>

                {/* Badge preview */}
                <div className="liquid-glass rounded-2xl p-4 mb-6 inline-flex items-center gap-3 mx-auto">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-[var(--border)] flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
                    {professional.name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{professional.name}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]">
                        <path
                          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{professional.category}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="lg" className="w-full">
                    Complete Your Profile
                  </Button>
                  <Button size="lg" variant="ghost" className="w-full" onClick={onClose}>
                    I&apos;ll do this later
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
