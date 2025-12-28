import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata = {
  title: "Northwind Finance",
  description: "Adaptive finance cockpit for modern teams",
};

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body
          className={`${grotesk.variable} bg-canvas text-foreground antialiased`}
          suppressHydrationWarning
        >
          <div className="page-shell">
            <div className="page-noise" aria-hidden="true" />
            <Header />
            <main className="min-h-screen pt-12 lg:pt-16">{children}</main>
            <Toaster richColors />
            <footer className="footer-bar">
              <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">Built for clarity and control.</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Privacy-first</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                  <span>Realtime guardrails</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                  <span>Human-friendly design</span>
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}