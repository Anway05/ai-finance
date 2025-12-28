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

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats / Proof */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <Card key={index} className="card-surface rounded-2xl border border-border/70">
                <CardContent className="pt-4 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Playbooks */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="pill bg-amber-200/20 text-amber-100 border border-amber-200/40">Operator playbooks</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">Ship decisions faster, with guardrails</h2>
              <p className="text-muted-foreground max-w-2xl mt-3">Curated workflows for budgets, approvals, and anomaly sweeps keep teams aligned without drowning in spreadsheets.</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-border/60 bg-card/70">Open the console</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index) => (
              <Card key={index} className="card-surface rounded-2xl border border-border/70">
                <CardContent className="pt-5 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/70 text-secondary-foreground flex items-center justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex items-center gap-3">
            <span className="pill bg-secondary/70 text-secondary-foreground">Timeline</span>
            <p className="text-muted-foreground">From ingest to action</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorksData.map((step, index) => (
              <Card key={index} className="card-surface rounded-2xl border border-border/70">
                <CardContent className="pt-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">{step.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="pill bg-primary/15 text-primary">Signals</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3">Teams that already simplified finance</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="card-surface rounded-2xl border border-border/70">
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={44}
                      height={44}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-sm text-white font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="card-surface rounded-3xl border border-border/70 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-cyan-300/10 to-amber-200/10" />
            <div className="relative space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-white">Keep every account, transaction, and alert in one calm view.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">No more hunting across tools. Northwind Finance keeps teams aligned with live budgets, clean approvals, and anomaly sweeps.</p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90">Enter the cockpit</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;