import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white">
                R
              </div>
              <span className="text-base font-semibold text-slate-900">Relays</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              The referral OS for real estate professionals. Build your dream team, book with confidence.
            </p>
          </div>

          {/* For Buyers */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">For Buyers</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/marketplace" className="text-sm text-slate-500 hover:text-slate-700">Browse Marketplace</Link>
              <Link href="/signup" className="text-sm text-slate-500 hover:text-slate-700">Create Account</Link>
              <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">My Dashboard</Link>
            </nav>
          </div>

          {/* For Pros */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">For Professionals</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link href="/signup" className="text-sm text-slate-500 hover:text-slate-700">List Your Business</Link>
              <Link href="/pro/dashboard" className="text-sm text-slate-500 hover:text-slate-700">Pro Dashboard</Link>
              <Link href="/pro/profile" className="text-sm text-slate-500 hover:text-slate-700">Edit Profile</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Company</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <span className="text-sm text-slate-500">About</span>
              <span className="text-sm text-slate-500">Contact</span>
              <span className="text-sm text-slate-500">Privacy</span>
              <span className="text-sm text-slate-500">Terms</span>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-slate-400">
          © 2026 Relays. All rights reserved. RelaysApp.com
        </div>
      </div>
    </footer>
  );
}
