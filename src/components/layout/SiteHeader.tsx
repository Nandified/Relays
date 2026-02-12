"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/provider";

export function SiteHeader() {
  const { state, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold text-slate-900">
          Relays
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/marketplace" className="text-sm text-slate-700 hover:text-slate-900">
            Marketplace
          </Link>
          {state.status === "authed" ? (
            <>
              <span className="hidden text-xs text-slate-500 sm:inline">{state.user.email}</span>
              <Button variant="secondary" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary">Log in</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
