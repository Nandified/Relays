"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Org Navigation Groups ────────────────────────────────────── */

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        href: "/org",
        label: "Dashboard",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        href: "/org/members",
        label: "Members",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        badge: 1, // invited
      },
      {
        href: "/org/journeys",
        label: "Journeys",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        href: "/org/reports/referrals",
        label: "Referral Routing",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        ),
      },
      {
        href: "/org/reports/compliance",
        label: "Compliance & Audit",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        href: "/org/settings",
        label: "Org Settings",
        icon: (
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/org") return pathname === "/org";
    return pathname.startsWith(href);
  };

  return (
    <div className="org-layout flex min-h-[calc(100vh-57px)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] border-r border-[var(--border)] bg-[var(--bg-subtle)]/95 backdrop-blur-xl
          transition-transform duration-200 ease-out
          lg:relative lg:translate-x-0 lg:top-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
            <Link href="/org" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-shadow group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                L
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">Luxury Realty</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Chicago</span>
              </div>
              <span className="rounded-md bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-500 dark:text-blue-400 border border-blue-500/15 ml-1">
                ORG
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl p-1.5 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 lg:hidden"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-1.5 px-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group/nav flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200
                        ${isActive(item.href)
                          ? "bg-blue-500/12 text-blue-700 dark:text-blue-300 border border-blue-500/15 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-slate-200 border border-transparent"
                        }
                      `}
                    >
                      <span className={`transition-colors ${isActive(item.href) ? "text-blue-400" : "text-slate-600 dark:text-slate-400 group-hover/nav:text-slate-700 dark:group-hover/nav:text-slate-200"}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && item.badge !== undefined && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[10px] font-semibold text-amber-400 tabular-nums border border-amber-500/15">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-[var(--border)] px-3 py-3 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to site
            </Link>
            <div className="flex items-center gap-2.5 px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-[10px] font-bold text-purple-400 border border-purple-500/10">
                V
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-700 dark:text-slate-300 truncate">Victoria Langford</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Admin</div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              L
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Luxury Realty</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
