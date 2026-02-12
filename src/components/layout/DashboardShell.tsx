"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export function DashboardShell({ children, navItems, title }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-6">{title}</h1>
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <nav className="sticky top-20 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors
                    ${active
                      ? "bg-[var(--accent-light)] text-[var(--accent)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav (horizontal scroll) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-white/90 backdrop-blur-xl px-2 py-2">
          <nav className="flex justify-around">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
                    active ? "text-[var(--accent)]" : "text-slate-500"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
