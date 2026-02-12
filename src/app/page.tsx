import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { HeroSearchBar } from "@/components/home/HeroSearchBar";
import { AnimatedSection } from "@/components/home/AnimatedSection";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";

/* ── How it works ────────────────────────────────────────────── */

const steps = [
  {
    num: "1",
    title: "Find Your Pros",
    desc: "Browse verified professionals or get referred by your agent. Already working with someone? Find them here and add them to your team.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "Build Your Team",
    desc: "Select the best realtor, lender, attorney, inspector, and insurance agent for your buying or selling journey.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "Stay on Track",
    desc: "Get guided through each step. Relays reminds you what\u2019s next so nothing falls through the cracks.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

/* ── 3 User Paths ────────────────────────────────────────────── */

const userPaths = [
  {
    title: "Search & Build",
    desc: "Browse our marketplace of verified pros. Find the perfect team for your buying or selling journey.",
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
    accent: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    borderGlow: "hover:border-blue-500/30",
  },
  {
    title: "Add Your Pro",
    desc: "Already working with a professional? Search for them on Relays and add them to your team.",
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M20 8v6M23 11h-6" />
      </svg>
    ),
    accent: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
    borderGlow: "hover:border-indigo-500/30",
  },
  {
    title: "Get Referred",
    desc: "Your real estate agent sent you a link? Join their team and see their hand-picked referrals for every service you need.",
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    accent: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
    borderGlow: "hover:border-emerald-500/30",
  },
];

/* ── Stats ────────────────────────────────────────────────────── */

const stats = [
  { value: "2,400+", label: "Verified Pros" },
  { value: "15,000+", label: "Teams Built" },
  { value: "4.8", label: "Avg Pro Rating" },
  { value: "< 2hrs", label: "Avg Response" },
];

/* ── Testimonials ─────────────────────────────────────────────── */

const testimonials = [
  {
    quote: "I had no idea what I needed after my offer was accepted. Relays walked me through each step — find an inspector, get insurance, hire an attorney. I built my entire team in one afternoon.",
    name: "Jamie R.",
    role: "First-time Buyer, Oak Park",
  },
  {
    quote: "Since joining Relays, I\u2019ve received a steady stream of quality referrals from agents in my area. These are clients who are ready to move — no cold calls, no chasing.",
    name: "Jordan L.",
    role: "Mortgage Lender, Sunrise Mortgage",
  },
  {
    quote: "I send my clients a single Relays link with my curated team — my preferred lender, inspector, and attorney. They join, see my referrals, and everyone stays on the same page.",
    name: "Lisa H.",
    role: "Realtor, Hartwell Realty",
  },
];

/* ── Pro section features ─────────────────────────────────────── */

const proFeatures = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    text: "List your business for free — forever",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    text: "Already listed? Claim and link your profile",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    text: "Get found by buyers and sellers in your area",
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    text: "Receive referrals from other pros on the platform",
  },
];

export default function HomePage() {
  return (
    <>
      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Subtle hero glow orb */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.08),transparent_70%)] animate-float-breathe" />

          <div className="relative mx-auto max-w-3xl text-center">
            <AnimatedSection delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-slate-400 shadow-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Now in Chicago Metro
              </div>
            </AnimatedSection>

            <AnimatedSection delay={80}>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Build your dream team
                <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent animate-shimmer">
                  for your home journey
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={160}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
                Buying or selling a home? Find verified pros, build your team, and get guided through every step — so nothing falls through the cracks.
              </p>
            </AnimatedSection>

            {/* Search Bar */}
            <AnimatedSection delay={260} className="mt-8">
              <HeroSearchBar />
            </AnimatedSection>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, i) => (
                <AnimatedSection key={stat.label} delay={i * 100}>
                  <AnimatedCounter value={stat.value} label={stat.label} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 User Paths ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">Three Ways to Get Started</h2>
              <p className="mt-3 text-slate-400">However you got here, Relays meets you where you are</p>
            </div>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            {userPaths.map((path, i) => (
              <AnimatedSection key={path.title} delay={i * 120}>
                <div className={`group relative rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] ${path.borderGlow} hover-lift h-full overflow-hidden`}>
                  {/* Gradient accent bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-3xl`} />

                  <div className="relative">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] ${path.iconColor}`}>
                      {path.icon}
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-100">{path.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{path.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">How Relays Works</h2>
                <p className="mt-3 text-slate-400">Three steps to your perfect team</p>
              </div>
            </AnimatedSection>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 120}>
                  <div className="group rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--border-hover)] glow-hover hover-lift h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] border border-blue-500/10">
                      {step.icon}
                    </div>
                    <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Step {step.num}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-slate-100">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">Trusted by Buyers, Sellers & Pros</h2>
              <p className="mt-3 text-slate-400">Real people, real experiences</p>
            </div>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 120}>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover-lift h-full">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-blue-400 opacity-40 mb-3">
                    <path fill="currentColor" d="M11 7H7a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H6a1 1 0 1 0 0 2h1a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H6a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h4a1 1 0 1 0 0-2zm10 0h-4a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a1 1 0 1 0 0 2h1a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4h-1a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h4a1 1 0 1 0 0-2z" />
                  </svg>
                  <p className="text-sm text-slate-300 leading-relaxed">{t.quote}</p>
                  <div className="mt-4 border-t border-[var(--border)] pt-3">
                    <div className="text-sm font-semibold text-slate-200">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ── For Professionals ────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden glow-emerald transition-all duration-500">
              {/* Emerald gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-emerald-500/5 to-teal-600/10 rounded-3xl" />
              <div className="absolute inset-0 border border-emerald-500/15 rounded-3xl" />
              <div className="absolute inset-0 bg-[var(--bg-card)]/60 backdrop-blur-sm rounded-3xl" />

              {/* Emerald glow orb */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_70%)]" />

              <div className="relative p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                  {/* Copy */}
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                      Free Forever
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">
                      Are you a real estate professional?
                    </h2>
                    <p className="mt-3 text-slate-400 leading-relaxed">
                      List your business on Relays and get discovered by buyers and sellers in your area. If your business is already here via Google Places, claim your profile and start receiving referrals.
                    </p>
                    <Link
                      href="/signup"
                      className="hover-scale inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 mt-6 text-base font-medium text-white shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-600 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)]"
                    >
                      Claim Your Profile — It&apos;s Free
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-4">
                    {proFeatures.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                          {f.icon}
                        </div>
                        <span className="text-sm text-slate-300 leading-relaxed pt-1.5">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl" />
              <div className="absolute inset-0 bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to build your dream team?</h2>
                <p className="mt-3 text-blue-200/70 max-w-lg mx-auto">
                  Whether you&apos;re buying your first home or selling your forever home, Relays guides you to the right professionals every step of the way.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/marketplace"
                    className="hover-scale inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-base font-medium text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-slate-100 transition-all"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/signup"
                    className="hover-scale inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition-all"
                  >
                    List Your Business
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
