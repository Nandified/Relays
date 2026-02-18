"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { VerifiedBadge } from "@/components/verified-badge";
import { Button } from "@/components/ui/Button";
import { mockPricingTiers, mockFAQItems, type PricingTier } from "@/lib/mock-data-extended";

/* ── Pricing Card ─────────────────────────────────────────────── */

function PricingCard({
  tier,
  annual,
}: {
  tier: PricingTier;
  annual: boolean;
}) {
  const price = annual ? tier.annualPrice : tier.monthlyPrice;
  const isEnterprise = tier.id === "enterprise";
  const isFree = tier.id === "free";

  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 transition-all duration-300 h-full ${
        tier.recommended
          ? "border-blue-500/30 bg-gradient-to-b from-blue-500/[0.06] to-transparent shadow-[0_0_40px_rgba(59,130,246,0.1)]"
          : "border-[var(--border)] bg-[var(--bg-card)]/80 hover:border-[var(--border-hover)]"
      } backdrop-blur-sm`}
    >
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-[10px] font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {tier.badge}
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tier.name}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{tier.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
            {isEnterprise ? "Custom" : isFree ? "Free" : `$${price}`}
          </span>
          {!isFree && !isEnterprise && (
            <span className="text-sm text-slate-600 dark:text-slate-400">/mo</span>
          )}
        </div>
        {!isFree && !isEnterprise && annual && (
          <p className="text-[11px] text-emerald-400 mt-1">
            Billed annually
          </p>
        )}
        {!isFree && !isEnterprise && !annual && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            or ${tier.annualPrice}/mo billed annually
          </p>
        )}
        {isEnterprise && (
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Let’s scope seats, rollout, and integrations.
          </p>
        )}
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {tier.features.map((feat, i) => (
          <div key={i} className="flex items-start gap-2.5">
            {feat.included ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mt-0.5 flex-shrink-0">
                <path
                  fill={feat.highlight ? "#3b82f6" : "#10b981"}
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="mt-0.5 flex-shrink-0">
                <path stroke="rgba(100,116,139,0.3)" strokeWidth="2" d="M5 10h10" />
              </svg>
            )}
            <span
              className={`text-sm ${
                feat.included
                  ? feat.highlight
                    ? "text-slate-900 dark:text-slate-100 font-medium"
                    : "text-slate-700 dark:text-slate-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {feat.text === "Verification checkmark" ? (
                <span className="inline-flex items-center gap-2">
                  <span>Verification checkmark</span>
                  <VerifiedBadge status="verified" size="sm" />
                </span>
              ) : (
                feat.text
              )}
            </span>
          </div>
        ))}
      </div>

      <Link href={tier.id === "enterprise" || tier.id === "office" ? "/contact" : "/signup"}>
        <Button
          variant={tier.recommended ? "primary" : "secondary"}
          className={`w-full ${tier.recommended ? "shadow-[0_0_25px_rgba(59,130,246,0.25)]" : ""}`}
          size="lg"
        >
          {tier.cta}
        </Button>
      </Link>
    </div>
  );
}

/* ── FAQ Accordion ─────────────────────────────────────────────── */

function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left cursor-pointer group"
      >
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors pr-4">{question}</span>
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`flex-shrink-0 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 animate-in">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────── */

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const faqGeneral = mockFAQItems.filter((f) => f.category === "billing" || f.category === "technical");
  const faqPros = mockFAQItems.filter((f) => f.category === "pros");

  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.06),transparent_70%)]" />

          <div className="relative text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Free forever to get started. Upgrade when you want deeper referrals, journey visibility, and team controls.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Pro starts at <span className="font-semibold text-slate-800 dark:text-slate-200">$10/mo</span> billed annually and includes a <span className="font-semibold text-slate-800 dark:text-slate-200">14-day full access trial</span> (no credit card).
            </p>

            {/* Annual / Monthly toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  !annual
                    ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                  annual
                    ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Annual
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Best value
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPricingTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} annual={annual} />
            ))}
          </div>

          <div className="mt-8">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Enterprise rollout</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Brokerages & franchises: we can scope onboarding, permissions, reporting, and integrations.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href="mailto:sales@relays.com?subject=Enterprise%20rollout%20-%20Relays"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  sales@relays.com
                </a>
                <a href="mailto:sales@relays.com?subject=Enterprise%20rollout%20-%20Relays" className="w-full sm:w-auto">
                  <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                    Email sales
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* What you'll use every day */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                Built for real-world referrals
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Plans scale from solo agents to enterprise rollouts. Features and availability can vary by region, brokerage policy, and product updates.
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Relays is not legal, financial, or tax advice.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Look premium",
                  items: ["Shareable Pro Page", "Verified marketplace presence", "Clear calls-to-action"],
                },
                {
                  title: "Run cleaner handoffs",
                  items: ["Curated partner groups", "Journey visibility", "Docs + reminders"],
                },
                {
                  title: "Measure what’s working",
                  items: ["Lead & referral signals", "Analytics (plan-based)", "Team reporting (plan-based)"],
                },
              ].map((col) => (
                <div key={col.title} className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/70 p-6 backdrop-blur-sm">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{col.title}</div>
                  <div className="mt-4 space-y-2">
                    {col.items.map((t) => (
                      <div key={t} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500/70" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 md:py-24">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-10">Frequently Asked Questions</h2>
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6 sm:p-8">
            {[...faqPros, ...faqGeneral].map((faq) => (
              <FAQAccordion key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl" />
            <div className="absolute inset-0 bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Ready to grow your referral business?</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                Start free and upgrade when you&apos;re ready. Pro and higher include a 14-day full access trial — no credit card required.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button size="lg" className="shadow-[0_0_25px_rgba(59,130,246,0.25)]">
                    Start Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="secondary">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
