"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
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
  const isFree = price === 0;

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
        <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">{tier.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
            {isFree ? "Free" : `$${price}`}
          </span>
          {!isFree && (
            <span className="text-sm text-slate-600 dark:text-slate-500">/mo</span>
          )}
        </div>
        {!isFree && annual && (
          <p className="text-[11px] text-emerald-400 mt-1">
            Save ${(tier.monthlyPrice - tier.annualPrice) * 12}/year
          </p>
        )}
        {!isFree && !annual && (
          <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">
            or ${tier.annualPrice}/mo billed annually
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
            <span className={`text-sm ${feat.included ? (feat.highlight ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-700 dark:text-slate-300") : "text-slate-500 dark:text-slate-500"}`}>
              {feat.text}
            </span>
          </div>
        ))}
      </div>

      <Link href={tier.id === "brokerage" ? "/contact" : "/signup"}>
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
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-600 dark:group-hover:text-white transition-colors pr-4">{question}</span>
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className={`flex-shrink-0 text-slate-600 dark:text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
              Free forever for consumers. For professionals, choose the plan that fits your business.
            </p>

            {/* Annual / Monthly toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  !annual
                    ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                  annual
                    ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Annual
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockPricingTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} annual={annual} />
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 backdrop-blur-sm p-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Need something custom? We work with large brokerages and franchise groups.{" "}
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium">
                Let&apos;s talk →
              </Link>
            </p>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-10">Compare Plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3 pr-4 text-slate-600 dark:text-slate-400 font-medium w-[200px]">Feature</th>
                    {mockPricingTiers.map((t) => (
                      <th key={t.id} className="text-center py-3 px-3 text-slate-700 dark:text-slate-300 font-semibold">
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feat: "Marketplace profile", vals: ["✓", "✓", "✓", "✓"] },
                    { feat: "Request-to-connect leads", vals: ["✓", "✓", "✓", "✓"] },
                    { feat: "Claim Google listing", vals: ["✓", "✓", "✓", "✓"] },
                    { feat: "Journey management", vals: ["—", "✓", "✓", "✓"] },
                    { feat: "Curated share links", vals: ["—", "3", "30", "Unlimited"] },
                    { feat: "Calendar integration", vals: ["—", "✓", "✓", "✓"] },
                    { feat: "Analytics & insights", vals: ["—", "✓", "✓", "✓"] },
                    { feat: "Document workflow", vals: ["—", "✓", "✓", "✓"] },
                    { feat: "Team seats", vals: ["—", "1", "Up to 10", "Unlimited"] },
                    { feat: "Team dashboard", vals: ["—", "—", "✓", "✓"] },
                    { feat: "RBAC & roles", vals: ["—", "—", "—", "✓"] },
                    { feat: "Compliance reports", vals: ["—", "—", "—", "✓"] },
                    { feat: "API access", vals: ["—", "—", "—", "✓"] },
                    { feat: "Dedicated account manager", vals: ["—", "—", "—", "✓"] },
                    { feat: "Support", vals: ["Community", "Priority", "Priority", "Dedicated"] },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{row.feat}</td>
                      {row.vals.map((v, j) => (
                        <td key={j} className="text-center py-3 px-3">
                          {v === "✓" ? (
                            <svg width="16" height="16" fill="#10b981" viewBox="0 0 20 20" className="inline-block">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : v === "—" ? (
                            <span className="text-slate-500 dark:text-slate-500">—</span>
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <p className="mt-3 text-slate-600 dark:text-blue-200/70 max-w-lg mx-auto">
                Start free and upgrade when you&apos;re ready. No credit card required.
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
