export const metadata = {
  title: "Contact | Relays",
};

import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <>
      <main>
        <section className="mx-auto max-w-3xl px-4 pt-16 pb-14 md:pt-24 md:pb-20">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Talk to Relays
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Need an Office rollout, Enterprise pricing, or help choosing a plan? We’ll get you to the right setup.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:hello@relaysapp.com?subject=Relays%20Sales%20Question"
              className="liquid-glass rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6 hover-lift"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">hello@relaysapp.com</div>
              <div className="mt-4">
                <Button variant="secondary">Send email</Button>
              </div>
            </a>

            <div className="liquid-glass rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm p-6">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Prefer self-serve?</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                View pricing and start your 30‑day full access trial (no credit card).
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/pricing">
                  <Button variant="secondary">View pricing</Button>
                </Link>
                <Link href="/signup">
                  <Button>Start trial</Button>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-500 dark:text-slate-400">
            Note: Relays provides software and workflow tools. We don’t provide legal advice.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
