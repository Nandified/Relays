import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/provider";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Relays",
  description: "Referral OS for real estate pros — marketplace + journey tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SiteHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
