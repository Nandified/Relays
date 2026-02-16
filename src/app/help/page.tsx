"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockFAQItems, type FAQItem } from "@/lib/mock-data-extended";

/* ── FAQ Category tabs ─────────────────────────────────────────── */

const categories = [
  { id: "all", label: "All", icon: "📋" },
  { id: "consumers", label: "Consumers", icon: "👥" },
  { id: "pros", label: "Professionals", icon: "🏠" },
  { id: "brokerages", label: "Brokerages", icon: "🏢" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "technical", label: "Technical", icon: "⚙️" },
] as const;

/* ── How it works steps ────────────────────────────────────────── */

const howItWorks = [
  {
    step: "1",
    title: "Sign Up",
    description: "Create a free account as a consumer or professional. Takes 60 seconds.",
    icon: "✨",
  },
  {
    step: "2",
    title: "Build Your Team",
    description: "Browse verified pros, accept referrals from your agent, or search for someone specific.",
    icon: "👥",
  },
  {
    step: "3",
    title: "Track Your Journey",
    description: "Follow your progress from pre-approval through closing. See what's next at every step.",
    icon: "📋",
  },
  {
    step: "4",
    title: "Close with Confidence",
    description: "With the right team in place, every milestone is handled. Nothing falls through the cracks.",
    icon: "🏠",
  },
];

/* ── Getting Started Guides ────────────────────────────────────── */

const guides = [
  {
    title: "For Buyers & Sellers",
    description: "How to find professionals, build your team, and navigate your home journey.",
    icon: "🏠",
    accent: "border-blue-500/15 bg-blue-500/[0.04]",
    steps: [
      "Create your free Relays account",
      "Tell us what you're looking for (buying, selling, or both)",
      "Browse the marketplace or join via a referral link",
      "Build your team and track your journey",
    ],
  },
  {
    title: "For Professionals",
    description: "How to list your business, curate referral groups, and manage journeys.",
    icon: "💼",
    accent: "border-emerald-500/15 bg-emerald-500/[0.04]",
    steps: [
      "Sign up and select your service category",
      "Complete your profile with photos and social links",
      "Create curated groups with your trusted partners",
      "Share your link and start receiving referrals",
    ],
  },
  {
    title: "For Brokerages",
    description: "How to set up your organization, invite agents, and access oversight tools.",
    icon: "🏢",
    accent: "border-purple-500/15 bg-purple-500/[0.04]",
    steps: [
      "Contact our team for Brokerage plan setup",
      "Invite your agents and configure roles (RBAC)",
      "Set partner policies and compliance requirements",
      "Access oversight dashboards and audit reports",
    ],
  },
];

/* ── FAQ Accordion ─────────────────────────────────────────────── */

function FAQAccordion({ faq }: { faq: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-4 text-left cursor-pointer group">
        <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors pr-4">
          {faq.question}
        </span>
        <svg
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`flex-shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 animate-in">
          <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────── */

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFAQs = mockFAQItems.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = search === "" ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-[radial-gradient(ellipse,rgba(59,130,246,0.06),transparent_70%)]" />
          <div className="relative text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              How can we help?
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Find answers, get started, or reach out to our team
            </p>

            {/* Search */}
            <div className="mt-8 max-w-md mx-auto relative">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search for answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-10">How Relays Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {howItWorks.map((item) => (
                <div key={item.step} className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 p-6 text-center">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="mt-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-400">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 mt-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started Guides */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-2xl font-bold text-slate-100 text-center mb-3">Getting Started</h2>
          <p className="text-slate-400 text-center mb-10 max-w-md mx-auto">
            Quick-start guides for every type of user
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <div key={guide.title} className={`rounded-3xl border ${guide.accent} p-6 h-full`}>
                <span className="text-2xl">{guide.icon}</span>
                <h3 className="text-lg font-semibold text-slate-100 mt-3">{guide.title}</h3>
                <p className="text-xs text-slate-400 mt-2 mb-4">{guide.description}</p>
                <ol className="space-y-2">
                  {guide.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-slate-500 flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto max-w-3xl px-4 py-16 md:py-20">
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-8">Frequently Asked Questions</h2>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                      : "bg-[var(--bg-card)] border border-[var(--border)] text-slate-400 hover:text-slate-300 hover:border-[var(--border-hover)]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ list */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6 sm:p-8">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => <FAQAccordion key={faq.id} faq={faq} />)
              ) : (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-sm text-slate-400">No results found. Try a different search or category.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mx-auto max-w-2xl px-4 py-16 md:py-20">
          <h2 className="text-2xl font-bold text-slate-100 text-center mb-3">Still Need Help?</h2>
          <p className="text-slate-400 text-center mb-8">
            Send us a message and we&apos;ll get back to you within 24 hours
          </p>

          {submitted ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] p-8 text-center animate-in">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Message Sent!</h3>
              <p className="text-sm text-slate-400">We&apos;ll get back to you within 24 hours. Check your email for updates.</p>
              <Button variant="ghost" className="mt-4" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6 sm:p-8">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Your Name"
                    placeholder="Jamie Rodriguez"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <Input
                    label="Email"
                    placeholder="jamie@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    placeholder="How can we help?"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--accent)]/40 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all resize-none"
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setSubmitted(true)}
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: "💬", title: "Community Forum", desc: "Connect with other Relays users", link: "#" },
              { icon: "📚", title: "API Documentation", desc: "For developers and integrations", link: "#" },
              { icon: "🎓", title: "Video Tutorials", desc: "Watch step-by-step walkthroughs", link: "#" },
            ].map((item) => (
              <Link key={item.title} href={item.link} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 p-5 hover:border-[var(--border-hover)] transition-all hover-lift group">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-sm font-semibold text-slate-200 mt-3 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
