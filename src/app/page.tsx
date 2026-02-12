import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { HeroSearchBar } from "@/components/home/HeroSearchBar";
import { AnimatedSection } from "@/components/home/AnimatedSection";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";

const steps = [
  {
    num: "1",
    title: "Search",
    desc: "Browse verified professionals in our marketplace. Find inspectors, lenders, attorneys, and more.",
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
    desc: "Add pros to your dream team. Mix and match the best inspector, lender, attorney, and more.",
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
    title: "Book & Track",
    desc: "Request bookings, track progress, and never lose sight of what's next in your journey.",
    icon: (
      <svg width="28" height="28" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
];

const stats = [
  { value: "2,400+", label: "Verified Pros" },
  { value: "15,000+", label: "Bookings Made" },
  { value: "4.8", label: "Avg Pro Rating" },
  { value: "< 2hrs", label: "Avg Response" },
];

const testimonials = [
  {
    quote: "Relays made finding a home inspector so easy. I had three options within minutes and booked the same day.",
    name: "Jamie R.",
    role: "First-time Buyer, Oak Park",
  },
  {
    quote: "As a lender, Relays sends me qualified leads that are ready to move. The booking flow is seamless.",
    name: "Jordan L.",
    role: "Mortgage Lender, Sunrise Mortgage",
  },
  {
    quote: "My clients love it. I send them my curated team and they can book directly. No more phone tag.",
    name: "Lisa H.",
    role: "Realtor, Hartwell Realty",
  },
];

export default function HomePage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Subtle hero glow orb — with breathing animation */}
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
                Browse verified inspectors, lenders, attorneys, and more. Build your team, book with confidence, and track every step — all in one place.
              </p>
            </AnimatedSection>

            {/* Search Bar */}
            <AnimatedSection delay={260} className="mt-8">
              <HeroSearchBar />
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={360}>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/marketplace"
                  className="hover-scale inline-flex items-center justify-center rounded-2xl bg-[var(--accent)] px-6 py-3 text-base font-medium text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_35px_rgba(59,130,246,0.35)]"
                >
                  Browse Marketplace
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/signup"
                  className="hover-scale inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm px-6 py-3 text-base font-medium text-slate-300 transition-all hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]"
                >
                  I&apos;m a Real Estate Pro
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Stats */}
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

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
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
        </section>

        {/* Testimonials */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">Trusted by Buyers & Pros</h2>
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
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl" />
              <div className="absolute inset-0 bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to build your dream team?</h2>
                <p className="mt-3 text-blue-200/70 max-w-md mx-auto">
                  Join thousands of buyers who found their perfect inspector, lender, and attorney on Relays.
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
