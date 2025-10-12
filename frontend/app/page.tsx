"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const quickFacts = [
  { label: "Occupancy across our national portfolio", value: "97%" },
  { label: "Communities under daily stewardship", value: "212" },
  { label: "Median response time for residents", value: "under 2 hrs" },
];

const servicePillars = [
  {
    title: "Portfolio Stewardship",
    description:
      "Full-spectrum management that protects asset value while elevating day-to-day resident experience across multifamily, mixed-use, and HOA communities.",
  },
  {
    title: "Owner Advisory",
    description:
      "Strategic financial planning, capital project oversight, and market intelligence so ownership teams can make confident decisions with clear data.",
  },
  {
    title: "Resident Experience",
    description:
      "Concierge-level service, onsite staff training, and hospitality-driven communications that sustain trust and retain residents year after year.",
  },
];

const testimonials = [
  {
    quote:
      "Happy Everyday turned around a struggling 400-unit community in under six months. They speak resident, investor, and contractor fluently.",
    name: "Jordan Mitchell",
    role: "Managing Director, Lakeview Capital Partners",
  },
  {
    quote:
      "Their stewardship is unmatched. Our portfolio NOI improved 18% while resident satisfaction hit an all-time high.",
    name: "Priya Desai",
    role: "Principal, Horizon Communities Group",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div>
            <p className="eyebrow mb-2">Happy Everyday</p>
            <h1 className="text-2xl font-heading text-foreground">Property stewardship, beautifully managed.</h1>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                About
              </Button>
            </Link>
            <Link href="/technology">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Technology
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Properties
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Map
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="button-primary">Client Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="site-section">
          <div className="container mx-auto grid gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <p className="eyebrow">AI-Enhanced property management</p>
              <h2 className="text-5xl font-heading leading-tight text-foreground">
                Where intelligent automation meets genuine hospitality.
              </h2>
              <p>
                Happy Everyday combines proprietary AI agents with seasoned property professionals to deliver exceptional stewardship at scale. Our autonomous systems handle routine operations—maintenance triage, vendor dispatch, rent collection, compliance monitoring—freeing our onsite teams to focus entirely on resident relationships and strategic asset management.
              </p>
              <p>
                The result? Portfolios that operate 75% faster with 60% lower vacancy rates, all while maintaining the white-glove service owners expect. Technology that elevates, not replaces.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="#services" className="button-primary">
                  Explore our services
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-base font-semibold text-[color:rgba(37,33,30,0.78)] transition-colors hover:bg-accent">
                  Client access
                </Link>
              </div>
            </div>
            <div className="surface-card overflow-hidden">
              <div className="relative h-80 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80"
                  alt="Concierge greeting residents in an elegant lobby"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="space-y-4 p-8">
                <h3 className="text-xl font-semibold text-foreground">AI agents + human expertise</h3>
                <p className="text-[color:rgba(37,33,30,0.78)]">
                  Our autonomous AI agents monitor property conditions 24/7, predict maintenance needs, and coordinate vendor dispatch. Meanwhile, our onsite professionals build resident relationships, handle complex negotiations, and make judgment calls technology can't. The perfect partnership for modern property stewardship.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section bg-[rgba(15,61,53,0.05)]">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {quickFacts.map((item) => (
                <Card key={item.label} className="surface-card">
                  <CardContent className="space-y-3 p-8">
                    <p className="eyebrow">{item.label}</p>
                    <p className="text-3xl font-heading text-foreground">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="site-section">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl space-y-6">
              <p className="eyebrow">Services</p>
              <h2 className="text-4xl font-heading text-foreground">Boutique service at institutional scale.</h2>
              <p>
                Every engagement begins with a deep understanding of your properties, residents, and ownership objectives. We craft solutions,
                assemble the right onsite team, and pair hospitality with thoughtfully applied technology.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {servicePillars.map((pillar) => (
                <Card key={pillar.title} className="surface-card">
                  <CardContent className="space-y-4 p-8">
                    <h3 className="text-2xl font-heading text-foreground">{pillar.title}</h3>
                    <p>{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="site-section bg-[rgba(15,61,53,0.08)]">
          <div className="container mx-auto grid gap-12 px-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card space-y-6 p-10">
              <p className="eyebrow">Measured performance</p>
              <h2 className="text-4xl font-heading text-foreground">Data-guided decisions. Human execution.</h2>
              <p>
                Our internal analytics studio brings together on-the-ground insights, financial reporting, and predictive forecasting. Owners
                receive quarterly stewardship briefings with a clear line of sight from resident sentiment to NOI.
              </p>
              <ul className="space-y-3 text-[color:rgba(37,33,30,0.78)]">
                <li>• Live dashboards covering collections, maintenance, compliance, and staffing</li>
                <li>• Annual portfolio roadmap aligned to your capital and operational goals</li>
                <li>• Benchmarks drawn from comparable communities across our national network</li>
              </ul>
            </div>
            <div className="surface-card space-y-4 p-10">
              <p className="eyebrow">Our toolkit includes</p>
              <p className="text-[color:rgba(37,33,30,0.78)]">
                Custom-built resident portal • Maintenance triage center • Vendor network spanning 15 states • Compliance support team • Board
                education and facilitation • Hospitality and training studio
              </p>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container mx-auto px-6">
            <div className="surface-card p-10">
              <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-6">
                  <p className="eyebrow">Intelligence layer</p>
                  <h2 className="text-3xl font-heading text-foreground">Technology that elevates, not replaces.</h2>
                  <p className="text-[color:rgba(37,33,30,0.78)]">
                    We pair onsite expertise with proprietary AI agents and automation to accelerate routine work—maintenance triage, vendor
                    dispatch, occupancy forecasting, and compliance monitoring—so your teams stay focused on residents and strategic priorities.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="inline-flex rounded-xl bg-primary/10 p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">Predictive analytics</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Revenue optimization, maintenance scheduling, and tenant retention modeling powered by machine learning.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex rounded-xl bg-secondary/10 p-3">
                      <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">Computer vision</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Automated property inspections analyze roof condition, structural integrity, and maintenance priorities from photos.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex rounded-xl bg-primary/10 p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">Intelligent dispatch</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      AI-powered vendor matching and route optimization reduce response times by 75% while cutting operational costs.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex rounded-xl bg-secondary/10 p-3">
                      <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground">Compliance automation</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Real-time monitoring for Fair Housing, GDPR, CCPA, and safety regulations with automated audit trails.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="container mx-auto grid gap-10 px-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <Card key={item.name} className="surface-card">
                <CardContent className="space-y-6 p-8">
                  <p className="text-xl leading-relaxed text-[color:rgba(37,33,30,0.85)]">
                    “{item.quote}”
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-[color:rgba(37,33,30,0.65)]">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="site-section bg-[rgba(15,61,53,0.05)]">
          <div className="container mx-auto grid gap-10 px-6 md:grid-cols-[1fr_1fr]">
            <div className="space-y-6">
              <p className="eyebrow">Connect</p>
              <h2 className="text-4xl font-heading text-foreground">How can we steward your next chapter?</h2>
              <p>
                Share your community goals, and we’ll design a stewardship proposal that fits—onsite support, association governance, resident
                experience, and financial management under one roof.
              </p>
              <div className="space-y-2 text-[color:rgba(37,33,30,0.78)]">
                <p><strong>Director:</strong> Dr. Efthemia P.</p>
                <p><a href="mailto:drmiap923@gmail.com" className="text-primary hover:underline">drmiap923@gmail.com</a></p>
                <p>+1 (949) 385-2399</p>
                <p><a href="https://thehappyeveryday.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">thehappyeveryday.org</a></p>
              </div>
            </div>
            <form 
              className="surface-card space-y-6 p-8"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                
                const subject = encodeURIComponent(`Property Management Inquiry from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                
                window.location.href = `mailto:drmiap923@gmail.com?subject=${subject}&body=${body}`;
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-foreground/80">Name</label>
                <input 
                  name="name"
                  required
                  className="mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Jordan Mitchell" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground/80">Email</label>
                <input 
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="you@company.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground/80">How can we help?</label>
                <textarea
                  name="message"
                  required
                  className="mt-2 h-32 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your properties, goals, or upcoming initiatives."
                />
              </div>
              <Button type="submit" className="button-primary w-full justify-center">Submit inquiry</Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">© 2026 Happy Everyday Property Management. All rights reserved.</p>
          <div className="text-sm text-[color:rgba(37,33,30,0.65)]">Version {process.env.NEXT_PUBLIC_VERSION || "2.0.0"}</div>
        </div>
      </footer>
    </div>
  );
}


