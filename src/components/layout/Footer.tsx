import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)] mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                R
              </div>
              <span className="text-base font-semibold text-slate-900 dark:text-slate-100">Relays</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-500">
              The referral operating system for real estate. Find verified pros, build your team, and stay on track — buying or selling.
            </p>
          </div>

          {/* For Buyers & Sellers */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">For Buyers & Sellers</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/marketplace" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Browse Marketplace</Link>
              <Link href="/onboarding" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Get Started</Link>
              <Link href="/dashboard" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">My Dashboard</Link>
              <Link href="/help" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Help Center</Link>
            </nav>
          </div>

          {/* For Pros */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">For Professionals</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/signup" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">List Your Business</Link>
              <Link href="/pricing" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Pricing</Link>
              <Link href="/pro/dashboard" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Pro Dashboard</Link>
              <Link href="/pro/profile" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Edit Profile</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/about" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">About</Link>
              <Link href="/help" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Support</Link>
              <Link href="/pricing" className="text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Pricing</Link>
              <span className="text-sm text-slate-600 dark:text-slate-500">Privacy</span>
              <span className="text-sm text-slate-600 dark:text-slate-500">Terms</span>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          © 2026 Relays. All rights reserved. RelaysApp.com
        </div>
      </div>
    </footer>
  );
}
