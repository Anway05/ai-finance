"use client";
import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

  const navClass = (href) =>
    `pill hover:brightness-110 transition px-4 py-2 group ${
      pathname?.startsWith(href) ? "bg-primary/15 text-primary ring-1 ring-primary/30" : ""
    }`;

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="mx-auto container px-4 pt-4">
        <nav className="card-surface rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between border border-border/70 shadow-lg shadow-cyan-900/10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.04),transparent_32%),radial-gradient(circle_at_95%_20%,rgba(16,185,129,0.08),transparent_40%)]" />
          <div className="absolute -inset-px rounded-3xl border border-white/5 opacity-50 pointer-events-none" />
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-300 to-amber-200 flex items-center justify-center text-sm font-bold text-slate-900 shadow-inner ring-2 ring-primary/20">
                NF
              </div>
            </Link>
            <div>
              <Link href="/" className="text-lg font-semibold tracking-tight">Northwind Finance</Link>
              <p className="text-xs text-muted-foreground">Clarity over every dollar</p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3 text-base font-medium">
            <SignedOut>
              <a href="#features" className="pill hover:brightness-110 transition">Features</a>
              <a href="#testimonials" className="pill hover:brightness-110 transition">Voices</a>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className={navClass("/dashboard")}>
                <span className="relative">
                  Dashboard
                  <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
              <Link href="/transaction/create" className={navClass("/transaction")}>
                <span className="relative">
                  Add Transaction
                  <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            </SignedIn>
          </div>

          {/* Mobile dropdown menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border bg-card/60 px-3 py-2">
                  <Menu size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[14rem] rounded-2xl p-2 shadow-2xl backdrop-blur-md card-surface border border-border/70">
                <DropdownMenuLabel className="text-white">Navigate</DropdownMenuLabel>
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

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline" className="border-border bg-card/60">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/transaction/create">
                <Button className="gap-2 bg-primary text-primary-foreground hover:opacity-90">
                  <PenBox size={16} />
                  <span className="hidden sm:inline">New transaction</span>
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderClient;
