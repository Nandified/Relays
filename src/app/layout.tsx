import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
        <ThemeProvider>
          <AuthProvider>
            <SiteHeader />
            <div className="min-h-[calc(100vh-57px)]">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
// Wave 4+5 deployed Mon Feb 16 14:55:00 CST 2026
