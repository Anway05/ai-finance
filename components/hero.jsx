"use client"
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const imageRef = useRef(null);

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
    <section className="pt-16 lg:pt-20 pb-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      </div>
      <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center relative">
        <div className="space-y-6">
          <div className="pill bg-teal-400/20 text-teal-100 border border-teal-300/40">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            Real-time finance cockpit
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-semibold text-white">
            A calmer way to run money decisions
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Northwind Finance aligns cashflow, accounts, and approvals in one adaptive workspace. Less spreadsheets. More signal.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground shadow-lg shadow-cyan-900/30">
                Launch console
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-border/60 bg-card/70">
                Explore playbook
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6">
            {[{
              label: "Spend under control",
              value: "-18%",
              hint: "Avg. variance month over month",
            }, {
              label: "Automation coverage",
              value: "72%",
              hint: "Of recurring approvals and syncs",
            }].map((item) => (
              <div key={item.label} className="card-surface rounded-2xl p-4 border border-border/70">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-semibold text-white mt-1">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hero-image-wrapper">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-cyan-300/10 to-amber-200/10 rounded-3xl blur-3xl" />
          <div ref={imageRef} className="relative hero-image card-surface rounded-3xl p-4 border border-border/70 shadow-2xl shadow-cyan-900/30">
            <div className="flex items-center justify-between mb-4">
              <div className="pill bg-secondary/80 text-secondary-foreground">Live cash</div>
              <span className="text-xs text-muted-foreground">Synced 34s ago</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ title: "Operating runway", value: "14.2 months", tone: "text-teal-200" }, { title: "Net flow", value: "+$42,380", tone: "text-amber-200" }, { title: "Vendors", value: "68 active", tone: "text-cyan-200" }, { title: "Alerts", value: "0 blockers", tone: "text-lime-200" }].map((stat) => (
                <div key={stat.title} className="rounded-2xl bg-secondary/60 border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className={`text-lg font-semibold ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-teal-500/20 via-cyan-400/20 to-amber-300/20 border border-border/60 p-4">
              <p className="text-sm text-white font-medium">Playbooks</p>
              <p className="text-xs text-muted-foreground mt-1">Close faster with automated approvals, budgets, and anomaly sweeps.</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-teal-100">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                AI sweeps nightly across accounts and vendors
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection