"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth/provider";
import { type UserRole } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const { loginFake, state } = useAuth();
  const [step, setStep] = React.useState<"role" | "auth">("role");
  const [role, setRole] = React.useState<UserRole>("consumer");
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    if (state.status === "authed") {
      if (state.user.role === "pro" && !state.user.proOnboarding?.onboardingComplete) {
        router.push("/pro/onboarding");
      } else {
        router.push(state.user.role === "pro" ? "/pro/dashboard" : "/dashboard");
      }
    }
  }, [state, router]);

  const handleSignup = () => {
    if (!email.trim()) return;
    loginFake({ email: email.trim(), role });
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.3)] mb-4">
          R
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">Join Relays and build your dream team</p>
      </div>

      {step === "role" ? (
        <div className="space-y-4">
          <button
            onClick={() => { setRole("consumer"); setStep("auth"); }}
            className="w-full"
          >
            <Card hover padding="lg" className="text-left transition-all hover:border-[var(--accent)]/30 glow-hover">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/10">
                  <svg width="24" height="24" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">I&apos;m buying a home</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Browse marketplace, build your dream team, and book with confidence.
                  </p>
                </div>
              </div>
            </Card>
          </button>

          <button
            onClick={() => { setRole("pro"); setStep("auth"); }}
            className="w-full"
          >
            <Card hover padding="lg" className="text-left transition-all hover:border-emerald-500/30 glow-hover">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/10">
                  <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">I&apos;m a real estate pro</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    List your business, receive leads, and manage bookings. Free to start.
                  </p>
                </div>
              </div>
            </Card>
          </button>
        </div>
      ) : (
        <Card padding="lg" className="shadow-[var(--shadow-elevated)]">
          <button
            onClick={() => setStep("role")}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-4"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Change role
          </button>

          <div className="mb-4 rounded-xl bg-white/5 border border-[var(--border)] px-3 py-2 text-sm text-slate-400">
            Signing up as: <span className="font-semibold text-slate-200">{role === "consumer" ? "Home Buyer" : "Professional"}</span>
          </div>

          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />

            <Button className="w-full" onClick={handleSignup}>
              Create Account
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--bg-card)] px-3 text-xs text-slate-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => loginFake({ email: "user@google.com", role })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" className="mr-1.5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => loginFake({ email: "user@icloud.com", role })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" className="mr-1.5" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:underline font-medium">
          Log in
        </Link>
      </p>
    </main>
  );
}
