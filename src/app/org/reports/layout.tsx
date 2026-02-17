"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const reportLinks = [
  { href: "/org/reports/operations", label: "Operations", icon: "🔧" },
  { href: "/org/reports/quotas", label: "Quota Tracking", icon: "📊" },
];

export default function OrgReportsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Subnav */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-1 py-2">
            <span className="text-xs text-slate-500 dark:text-slate-500 mr-2 font-medium uppercase tracking-wider">Brokerage Reports</span>
            {reportLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all
                    ${active
                      ? "bg-[var(--bg-card)] text-slate-900 dark:text-slate-100 shadow-sm border border-[var(--border)]"
                      : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                    }
                  `}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
