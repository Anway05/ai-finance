"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-16 lg:pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-24 -top-10 h-80 w-80 rounded-full bg-violet-500/15 dark:bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-fuchsia-400/15 dark:bg-purple-600/20 blur-3xl" />
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column: Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>AI-Driven Financial Cockpit</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.15] font-extrabold tracking-tight text-foreground">
            A calmer, smarter way to run{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-500 dark:from-violet-400 dark:via-indigo-300 dark:to-fuchsia-400 bg-clip-text text-transparent">
              your money
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            MyWallet unifies your accounts, cashflow tracking, intelligent receipt scanning, and automated budget insights into a single adaptive workspace.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/25 dark:shadow-purple-900/40 rounded-xl px-6">
                Launch Console
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-border/80 bg-card/80 font-semibold rounded-xl px-6 hover:bg-accent/20">
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="card-surface rounded-2xl p-4 border border-border/80 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Spend Variance</p>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">-18%</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. reduction MoM</p>
            </div>

            <div className="card-surface rounded-2xl p-4 border border-border/80 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Automation</p>
                <Zap className="w-4 h-4 text-violet-500" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">72%</p>
              <p className="text-xs text-muted-foreground mt-1">Receipt & budget sync</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Hero Interactive Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hero-image-wrapper"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-fuchsia-500/15 rounded-3xl blur-2xl" />
          <div
            ref={imageRef}
            className="relative hero-image glass-card rounded-3xl p-6 border border-border/80 shadow-2xl shadow-violet-950/15 dark:shadow-purple-950/40"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Cashflow</span>
              </div>
              <span className="text-xs text-muted-foreground">Synced 34s ago</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Operating runway", value: "14.2 months", tone: "text-violet-600 dark:text-violet-400" },
                { title: "Net flow", value: "+₹42,380", tone: "text-emerald-600 dark:text-emerald-400" },
                { title: "Active Vendors", value: "68 verified", tone: "text-indigo-600 dark:text-indigo-400" },
                { title: "Budget Status", value: "Optimal", tone: "text-fuchsia-600 dark:text-fuchsia-400" },
              ].map((stat) => (
                <div key={stat.title} className="rounded-2xl bg-card/70 border border-border/70 p-3.5 backdrop-blur">
                  <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                  <p className={`text-lg font-bold ${stat.tone} mt-1`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-fuchsia-500/10 border border-border/80 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <p className="text-sm font-semibold text-foreground">Smart Automated Guardrails</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Close monthly books faster with automated receipt processing and real-time category detection.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                AI active across linked bank accounts
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
