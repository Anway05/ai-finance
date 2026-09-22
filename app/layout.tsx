import type { Metadata } from "next";
import * as React from "react";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const ClerkProviderWrapper = ClerkProvider as any;

export const metadata: Metadata = {
  title: "MyWallet - AI Powered Financial Cockpit",
  description: "Adaptive finance cockpit and budget tracker for modern individuals and teams.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body
          className={`${grotesk.variable} bg-canvas text-foreground antialiased selection:bg-primary/20 selection:text-primary`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <div className="page-shell">
              <div className="page-noise" aria-hidden="true" />
              <Header />
              <main className="min-h-screen pt-12 lg:pt-16">{children}</main>
              <Toaster richColors />
              <footer className="footer-bar">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">Built for clarity, speed, and financial control.</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Privacy-first</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    <span>Realtime guardrails</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    <span>AI Insights</span>
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
