"use client";

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Menu, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

const HeaderClient = () => {
  const pathname = usePathname();

  const navClass = (href: string) =>
    `pill hover:brightness-110 transition px-4 py-2 group ${
      pathname?.startsWith(href) ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-semibold" : ""
    }`;

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="mx-auto container px-4 pt-4">
        <nav className="card-surface rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between border border-border/70 shadow-xl shadow-indigo-950/10 dark:shadow-purple-950/30 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_10%_0%,rgba(139,92,246,0.1),transparent_35%),radial-gradient(circle_at_95%_20%,rgba(99,102,241,0.1),transparent_40%)]" />
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-11 w-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="MyWallet Logo"
                  width={44}
                  height={44}
                  className="object-contain drop-shadow-[0_4px_14px_rgba(168,85,247,0.45)] brightness-105"
                  priority
                />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 dark:from-violet-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                  MyWallet
                </span>
                <p className="text-xs text-muted-foreground/90 font-medium hidden sm:block tracking-wide">
                  Smart Money Manager
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <SignedOut>
              <a href="#features" className="pill hover:bg-primary/10 transition-all">Features</a>
              <a href="#testimonials" className="pill hover:bg-primary/10 transition-all">Voices</a>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className={navClass("/dashboard")}>
                <span className="relative flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </span>
              </Link>
              <Link href="/transaction/create" className={navClass("/transaction")}>
                <span className="relative flex items-center gap-1.5">
                  <PenBox className="w-4 h-4" />
                  Add Transaction
                </span>
              </Link>
            </SignedIn>
          </div>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline" className="border-border bg-card/70 font-semibold hover:border-primary/50">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/transaction/create">
                <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20">
                  <PenBox size={16} />
                  <span className="hidden sm:inline">New transaction</span>
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-primary/30 hover:scale-105 transition-transform",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile menu dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-border bg-card/80 h-9 w-9">
                    <Menu size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[14rem] rounded-2xl p-2 shadow-2xl backdrop-blur-md card-surface border border-border/70">
                  <DropdownMenuLabel className="text-foreground">Navigate</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <SignedOut>
                    <DropdownMenuItem asChild>
                      <a href="#features" className="flex items-center gap-2">
                        <LayoutDashboard size={16} /> Features
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#testimonials" className="flex items-center gap-2">
                        <PenBox size={16} /> Voices
                      </a>
                    </DropdownMenuItem>
                  </SignedOut>
                  <SignedIn>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/transaction/create" className="flex items-center gap-2">
                        <PenBox size={16} /> Add Transaction
                      </Link>
                    </DropdownMenuItem>
                  </SignedIn>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderClient;
