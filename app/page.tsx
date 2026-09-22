import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                className="glass-card rounded-2xl border border-border/80 transition-transform duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-5 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Capabilities */}
      <section id="features" className="py-16 relative">
        <div className="container mx-auto px-4 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="pill mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Operator Workflows</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Ship decisions faster with built-in AI guardrails
              </h2>
              <p className="text-muted-foreground max-w-2xl mt-3 text-base">
                Curated workflows for budgets, intelligent receipt scanning, and anomaly sweeps keep your finances aligned without spreadsheet overhead.
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-border/80 bg-card/80 font-semibold rounded-xl hover:bg-accent/20">
                Open Console <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="glass-card rounded-2xl border border-border/80 p-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="pt-5 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center border border-violet-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="pill">3-Step Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              From raw transactions to effortless control
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksData.map((step, index) => (
              <Card key={index} className="glass-card rounded-2xl border border-border/80">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="pill mb-3">Community Signals</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                Loved by modern teams & creators
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="glass-card rounded-2xl border border-border/80">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-primary/30"
                    />
                    <div>
                      <p className="text-sm text-foreground font-bold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl border border-border/80 p-10 md:p-14 text-center relative overflow-hidden bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-fuchsia-600/10 dark:from-violet-950/40 dark:via-indigo-950/30 dark:to-purple-950/40">
            <div className="relative space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                Keep every account, budget, & alert in one calm view.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                No more hunting across multiple bank apps or spreadsheets. Experience intelligent cashflow tracking with automated Gemini AI receipt parsing.
              </p>
              <div className="pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/25 rounded-xl px-8">
                    Enter Cockpit Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
