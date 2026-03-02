"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { MessageBadge } from "@/components/notifications/MessageBadge";
import { useAuth } from "@/lib/auth/provider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function SiteHeader() {
  const { state, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [marketplaceHref, setMarketplaceHref] = React.useState("/marketplace");

  React.useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("relays:marketplace:lastUrl");
      if (saved && saved.startsWith("/marketplace")) setMarketplaceHref(saved);
    } catch {
      // ignore
    }
  }, []);

  const isAuthed = state.status === "authed";
  const role = isAuthed ? state.user.role : null;
  const isPro = role === "pro";
  const isAdmin = role === "admin";

  const [accountOpen, setAccountOpen] = React.useState(false);
  const accountRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [accountOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-shadow group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            R
          </div>
          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">Relays</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {!isAuthed ? (
            // Public/marketing nav
            <>
              <Link href={marketplaceHref} className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" scroll={false}>
                Marketplace
              </Link>
              <Link href="/real-estate-pro" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Real Estate Pro
              </Link>
              <Link href="/pricing" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Pricing
              </Link>
            </>
          ) : isAdmin ? (
            // Admin app nav
            <>
              <Link href="/admin" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Admin
              </Link>
            </>
          ) : isPro ? (
            // Pro app nav
            <>
              <Link href="/pro/dashboard" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/pro/journeys" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Journeys
              </Link>
              <Link href="/pro/requests" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Requests
              </Link>
              <Link href="/pro/groups" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Groups
              </Link>
            </>
          ) : (
            // Consumer app nav (until /app exists, use current surfaces)
            <>
              <Link href="/dashboard" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/requests" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Requests
              </Link>
              <Link href="/team" className="rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Team
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {isAuthed && (
            <>
              <MessageBadge />
              <NotificationBell />
            </>
          )}

          {isAuthed ? (
            <div className="relative hidden md:flex items-center ml-2" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Account menu"
              >
                <span className="max-w-[220px] truncate">{state.user.email}</span>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={accountOpen ? "rotate-180 transition-transform" : "transition-transform"}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/95 backdrop-blur-xl shadow-[var(--shadow-elevated)] z-50">
                  <div className="px-3 py-2 border-b border-[var(--border)]">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Signed in as</div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{state.user.email}</div>
                  </div>

                  <div className="p-1">
                    <AccountLink href={isPro ? "/pro/profile" : "/settings"} onClick={() => setAccountOpen(false)}>
                      {isPro ? "Profile" : "Settings"}
                    </AccountLink>
                    <AccountLink href="/settings" onClick={() => setAccountOpen(false)}>
                      Appearance & Settings
                    </AccountLink>
                    <AccountLink href="/pricing" onClick={() => setAccountOpen(false)}>
                      Plan & Billing
                    </AccountLink>
                    <AccountLink href="/help" onClick={() => setAccountOpen(false)}>
                      Help
                    </AccountLink>
                  </div>

                  <div className="border-t border-[var(--border)] p-1">
                    <button
                      onClick={() => { setAccountOpen(false); logout(); }}
                      className="w-full rounded-xl px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-500/10"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
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
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 md:hidden"
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
            {!isAuthed ? (
              <>
                <MobileLink href={marketplaceHref} onClick={() => setMobileOpen(false)}>Marketplace</MobileLink>
                <MobileLink href="/real-estate-pro" onClick={() => setMobileOpen(false)}>Real Estate Pro</MobileLink>
                <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</MobileLink>
              </>
            ) : isAdmin ? (
              <>
                <MobileLink href="/admin" onClick={() => setMobileOpen(false)}>Admin</MobileLink>
                <MobileLink href="/messages" onClick={() => setMobileOpen(false)}>Messages</MobileLink>
                <MobileLink href="/notifications" onClick={() => setMobileOpen(false)}>Notifications</MobileLink>
              </>
            ) : isPro ? (
              <>
                <MobileLink href="/pro/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <MobileLink href="/pro/journeys" onClick={() => setMobileOpen(false)}>Journeys</MobileLink>
                <MobileLink href="/pro/requests" onClick={() => setMobileOpen(false)}>Requests</MobileLink>
                <MobileLink href="/pro/groups" onClick={() => setMobileOpen(false)}>Groups</MobileLink>
                <MobileLink href="/messages" onClick={() => setMobileOpen(false)}>Messages</MobileLink>
                <MobileLink href="/notifications" onClick={() => setMobileOpen(false)}>Notifications</MobileLink>
              </>
            ) : (
              <>
                <MobileLink href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <MobileLink href="/requests" onClick={() => setMobileOpen(false)}>Requests</MobileLink>
                <MobileLink href="/team" onClick={() => setMobileOpen(false)}>Team</MobileLink>
                <MobileLink href="/messages" onClick={() => setMobileOpen(false)}>Messages</MobileLink>
                <MobileLink href="/notifications" onClick={() => setMobileOpen(false)}>Notifications</MobileLink>
              </>
            )}

            <div className="mt-2 border-t border-[var(--border)] pt-2 space-y-2">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle />
              </div>

              {isAuthed && (
                <>
                  <MobileLink href={isPro ? "/pro/profile" : "/settings"} onClick={() => setMobileOpen(false)}>
                    {isPro ? "Profile" : "Settings"}
                  </MobileLink>
                  <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>
                    Plan & Billing
                  </MobileLink>
                  <MobileLink href="/help" onClick={() => setMobileOpen(false)}>
                    Help
                  </MobileLink>

                  <div className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400">{state.user.email}</div>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10">
                    Log out
                  </button>
                </>
              )}

              {!isAuthed && (
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
    <Link href={href} onClick={onClick} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5">
      {children}
    </Link>
  );
}

function AccountLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
    >
      {children}
    </Link>
  );
}

