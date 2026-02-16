"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/provider";

export function SiteHeader() {
  const { state, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isAuthed = state.status === "authed";
  const isPro = isAuthed && state.user.role === "pro";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-shadow group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            R
          </div>
          <span className="text-base font-semibold text-slate-100">Relays</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/marketplace" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
            Marketplace
          </Link>
          {isAuthed && !isPro && (
            <>
              <Link href="/dashboard" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/team" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                My Team
              </Link>
              <Link href="/requests" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                Requests
              </Link>
            </>
          )}
          {isPro && (
            <>
              <Link href="/pro/dashboard" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/pro/journeys" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                Journeys
              </Link>
              <Link href="/pro/requests" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                Requests
              </Link>
              <Link href="/pro/profile" className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthed ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs text-slate-500">{state.user.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 md:hidden"
          >
            {mobileOpen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)] p-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <MobileLink href="/marketplace" onClick={() => setMobileOpen(false)}>Marketplace</MobileLink>
            {isAuthed && !isPro && (
              <>
                <MobileLink href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <MobileLink href="/team" onClick={() => setMobileOpen(false)}>My Team</MobileLink>
                <MobileLink href="/requests" onClick={() => setMobileOpen(false)}>Requests</MobileLink>
              </>
            )}
            {isPro && (
              <>
                <MobileLink href="/pro/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <MobileLink href="/pro/journeys" onClick={() => setMobileOpen(false)}>Journeys</MobileLink>
                <MobileLink href="/pro/requests" onClick={() => setMobileOpen(false)}>Requests</MobileLink>
                <MobileLink href="/pro/profile" onClick={() => setMobileOpen(false)}>Profile</MobileLink>
              </>
            )}
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              {isAuthed ? (
                <>
                  <div className="px-3 py-1.5 text-xs text-slate-500">{state.user.email}</div>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10">
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5">
      {children}
    </Link>
  );
}
