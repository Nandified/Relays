import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { AnimatedSection } from "@/components/home/AnimatedSection";

/* ── Team ──────────────────────────────────────────────────────── */

const team = [
  { initials: "RW", name: "Team Member", role: "Founder & CEO", color: "from-blue-500/20 to-indigo-500/20" },
  { initials: "KB", name: "Team Member", role: "CTO", color: "from-emerald-500/20 to-teal-500/20" },
  { initials: "MP", name: "Team Member", role: "Head of Product", color: "from-purple-500/20 to-pink-500/20" },
  { initials: "AC", name: "Team Member", role: "Head of Growth", color: "from-amber-500/20 to-orange-500/20" },
];

/* ── Value Props ───────────────────────────────────────────────── */

const valueProps = [
  {
    audience: "For Real Estate Pros",
    icon: "🏠",
    accent: "border-blue-500/15 from-blue-500/[0.04] to-transparent",
    items: [
      "Curate referral groups based on each client (share the right link every time)",
      "Send clients a single link with your hand-picked team",
      "Keep the journey visible from pre-approval to close",
      "Build trust with verification and reviews",
    ],
  },
  {
    audience: "For Consumers",
    icon: "👥",
    accent: "border-emerald-500/15 from-emerald-500/[0.04] to-transparent",
    items: [
      "Find verified professionals for every step of your home journey",
      "Get referred by agents you trust — or search on your own",
      "Track your progress and never miss a deadline",
      "Compare ratings, reviews, and response times",
    ],
  },
  {
    audience: "For Brokerages",
    icon: "🏢",
    accent: "border-purple-500/15 from-purple-500/[0.04] to-transparent",
    items: [
      "Oversight dashboards for referral routing and compliance",
      "RBAC and role management across your entire organization",
      "Audit logs and compliance reports for every transaction",
      "Custom onboarding and enterprise API access",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.06),transparent_70%)]" />
          <div className="relative text-center max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                About Relays
              </div>
            </AnimatedSection>
            <AnimatedSection delay={80}>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                The referral operating system
                <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  for real estate
                </span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={160}>
              <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Every home transaction involves 5+ professionals who have never worked together before.
                Relays is the platform that connects them — creating trusted teams that guide buyers
                and sellers through every step of the journey.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <AnimatedSection>
            <div className="relative rounded-3xl border border-[var(--border)] liquid-glass p-8 md:p-12">
              <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08),transparent_70%)]" />
              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Our Mission</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Buying or selling a home is one of the most significant financial decisions people make. Yet the process
                    of finding and coordinating the right professionals — realtors, lenders, inspectors, attorneys, and insurance
                    agents — is broken. It&apos;s fragmented, opaque, and stressful.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Relays was built to fix that. We&apos;re creating a world where every home transaction is guided by a
                    curated team of verified professionals, where referrals are transparent and trusted, and where no step
                    in the journey is missed.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: "1M+", label: "Professionals listed" },
                    { num: "13", label: "States covered" },
                    { num: "9,800+", label: "Verified profiles" },
                    { num: "4.8★", label: "Average rating" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-4 text-center">
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.num}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Value Props */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-12">Built for Everyone in the Transaction</h2>
            </AnimatedSection>
            <div className="grid gap-6 md:grid-cols-3">
              {valueProps.map((vp, i) => (
                <AnimatedSection key={vp.audience} delay={i * 120}>
                  <div className={`rounded-3xl border bg-gradient-to-b ${vp.accent} p-6 h-full`}>
                    <span className="text-2xl">{vp.icon}</span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-3 mb-4">{vp.audience}</h3>
                    <ul className="space-y-3">
                      {vp.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <svg width="14" height="14" fill="#10b981" viewBox="0 0 20 20" className="mt-0.5 flex-shrink-0">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-3">Meet the Team</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-md mx-auto">
              We&apos;re a small team obsessed with making real estate transactions better for everyone.
            </p>
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {team.map((member, i) => (
              <AnimatedSection key={member.initials} delay={i * 100}>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 p-6 text-center hover:border-[var(--border-hover)] transition-all">
                  <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-lg font-bold text-white/80 mb-4`}>
                    {member.initials}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{member.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{member.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Press */}
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <AnimatedSection>
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 text-center mb-8">In the Press</h2>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {["TechCrunch", "Inman News", "HousingWire", "RealTrends"].map((pub) => (
                  <span key={pub} className="text-lg font-semibold text-slate-500 dark:text-slate-400/60">{pub}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">Coming soon</p>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl" />
              <div className="absolute inset-0 bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Get in Touch</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                  Questions about Relays? Want to partner with us? We&apos;d love to hear from you.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <a href="mailto:hello@relaysapp.com" className="hover-scale inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] dark:bg-white px-6 py-3 text-base font-medium text-white dark:text-slate-900 shadow-[var(--shadow-card)] hover:opacity-90 transition-all">
                    hello@relaysapp.com
                  </a>
                  <Link href="/help" className="hover-scale inline-flex items-center justify-center rounded-2xl border border-slate-300 dark:border-white/30 bg-white/80 dark:bg-white/10 px-6 py-3 text-base font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 transition-all">
                    Help Center
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
