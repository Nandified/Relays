"use client";

import type * as React from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/home/AnimatedSection";
import { AuroraBackground } from "@/components/marketing/AuroraBackground";

const valueProps = [
  {
    title: "Referrals that feel effortless",
    desc: "Package your go-to lender, inspector, attorney, and insurance partner into a single link — so clients never ask “who do I use?” again.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="text-blue-500 dark:text-blue-400">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: "Discovery leads — without cold outreach",
    desc: "Get found by buyers, sellers, and other pros looking for someone verified. Turn request-to-connect into warm introductions.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="text-indigo-500 dark:text-indigo-400">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    title: "Risk-reduction through clarity",
    desc: "Keep the journey visible: who’s on the team, what’s next, and what’s waiting — so fewer surprises and cleaner handoffs.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="text-emerald-500 dark:text-emerald-400">
        <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

function GlassCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-7 hover-lift">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function RealEstateProPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative">
          <AuroraBackground className="-z-10" />

          <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:pt-24 md:pb-16">
            <AnimatedSection className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/70 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 liquid-glass">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Real Estate Pro
                <span className="text-slate-400 dark:text-slate-500">•</span>
                14-day full access trial (no credit card)
              </div>

              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
                A referral page your clients actually use.
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-lg text-slate-600 dark:text-slate-300">
                Build a beautiful, shareable page for your business — then connect clients to your trusted partner network and keep the journey moving.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup">
                  <Button size="lg" className="shadow-[0_0_28px_rgba(59,130,246,0.25)]">
                    Claim your page
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="secondary">
                    View pricing
                  </Button>
                </Link>
                <div className="text-xs text-slate-600 dark:text-slate-400 sm:ml-2">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Free forever</span> • Pro starts at{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-200">$10/mo</span> billed annually
                </div>
              </div>

              {/* Preview card */}
              <div className="mt-10 grid gap-6 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/70 liquid-glass">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(800px_300px_at_10%_0%,rgba(59,130,246,0.16),transparent_60%),radial-gradient(700px_320px_at_90%_10%,rgba(99,102,241,0.12),transparent_55%)]" />
                    <div className="relative p-6 sm:p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/10 border border-[var(--border)]" />
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your Name, REALTOR®</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Chicago, IL • Relays Pro Page</div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="rounded-full border border-[var(--border)] bg-black/5 dark:bg-white/5 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300">Verified</span>
                          <span className="rounded-full border border-[var(--border)] bg-black/5 dark:bg-white/5 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300">Fast response</span>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "Preferred Lender", dot: "bg-blue-500" },
                          { label: "Home Inspector", dot: "bg-indigo-500" },
                          { label: "Attorney", dot: "bg-emerald-500" },
                          { label: "Insurance", dot: "bg-blue-400" },
                        ].map((row) => (
                          <div key={row.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-4">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${row.dot}`} />
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{row.label}</span>
                            </div>
                            <div className="mt-2 h-2 w-3/5 rounded-full bg-black/5 dark:bg-white/5" />
                            <div className="mt-2 h-2 w-2/5 rounded-full bg-black/5 dark:bg-white/5" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/55 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Active journeys</span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">Last 7 days</span>
                        </div>
                        <div className="mt-3 grid gap-2">
                          {["Offer accepted", "Inspection", "Appraisal"].map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-emerald-500" : "bg-blue-500/70"}`} />
                              <div className="h-2 flex-1 rounded-full bg-black/5 dark:bg-white/5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/70 p-6 sm:p-7 liquid-glass">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Everything you need to look premium</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      A clean, modern page with your partner network, reviews, and a clear call-to-action — designed to feel trustworthy on day one.
                    </p>
                    <div className="mt-5 space-y-3 text-sm">
                      {[
                        "Your shareable Pro Page",
                        "Curated referral groups",
                        "Request-to-connect leads",
                        "Journey visibility & handoffs",
                      ].map((t) => (
                        <div key={t} className="flex items-start gap-2">
                          <svg width="16" height="16" viewBox="0 0 20 20" className="mt-0.5 flex-shrink-0" fill="#10b981">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-slate-700 dark:text-slate-300">{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-2xl border border-[var(--border)] bg-black/5 dark:bg-white/5 p-4">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">14-day full access trial</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        Start Pro or above, explore everything, and decide later — no credit card required.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Value props */}
        <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <AnimatedSection>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Grow the business you already have</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Relays helps you present your network, keep momentum, and stay organized — without changing how you work.
              </p>
            </div>
          </AnimatedSection>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {valueProps.map((p, idx) => (
              <AnimatedSection key={p.title} delay={80 * idx}>
                <GlassCard title={p.title} desc={p.desc} icon={p.icon} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-8" delay={240}>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/70 p-6 sm:p-7 liquid-glass">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Clear messaging, careful framing</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Relays is an organization and communication tool. It doesn’t replace your broker’s policies or provide legal, financial, or tax advice.
                  </p>
                </div>
                <Link href="/pricing" className="shrink-0">
                  <Button variant="secondary">See plans</Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12">
              <AuroraBackground className="opacity-70" />
              <div className="absolute inset-0 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/40 liquid-glass" />
              <div className="relative text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Claim your page. Share one link. Move faster.</h2>
                <p className="mt-3 max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
                  Start with Free and upgrade when you’re ready. Pro includes a 14-day full access trial — no credit card.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="shadow-[0_0_28px_rgba(59,130,246,0.25)]">Claim your page</Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="secondary">View pricing</Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
