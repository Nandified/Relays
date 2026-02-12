import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Relays — Build Your Dream Team",
  description: "The referral OS for real estate. Browse verified pros, build your team, book with confidence.",
  openGraph: {
    title: "Relays — Build Your Dream Team",
    description: "The referral OS for real estate. Browse verified pros, build your team, book with confidence.",
    siteName: "Relays",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <AuthProvider>
          <SiteHeader />
          <div className="min-h-[calc(100vh-57px)]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
