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
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold">
                Client Portal
              </Button>
            </Link>
            <Link href="#contact">
              <Button className="button-primary">Schedule a consult</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="site-section">
          <div className="container mx-auto grid gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <p className="eyebrow">Full-service property management</p>
              <h2 className="text-5xl font-heading leading-tight text-foreground">
                We look after every detail so your properties feel like home and perform like assets.
              </h2>
              <p>
                Happy Everyday partners with owners, associations, and investors across the United States to deliver grounded, human-first
                property management. From board meetings to resident move-ins, we handle every touchpoint with hospitality, precision, and an eye
                toward long-term value.
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
                <h3 className="text-xl font-semibold text-foreground">A concierge approach for every community</h3>
                <p className="text-[color:rgba(37,33,30,0.78)]">
                  From high-rise condominiums to single-family associations, our onsite teams coordinate maintenance, governance, hospitality, and
                  communications with care and transparency.
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
                <p>hello@happyeveryday.co</p>
                <p>+1 (800) 555-0194</p>
                <p>Offices in New York, Chicago, Austin, Seattle</p>
              </div>
            </div>
            <form className="surface-card space-y-6 p-8">
              <div>
                <label className="block text-sm font-semibold text-foreground/80">Name</label>
                <input className="mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Jordan Mitchell" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground/80">Email</label>
                <input className="mt-2 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground/80">How can we help?</label>
                <textarea
                  className="mt-2 h-32 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your properties, goals, or upcoming initiatives."
                />
              </div>
              <Button className="button-primary w-full justify-center">Submit inquiry</Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">© {new Date().getFullYear()} Happy Everyday Property Management. All rights reserved.</p>
          <div className="text-sm text-[color:rgba(37,33,30,0.65)]">Version {process.env.NEXT_PUBLIC_VERSION || "0.0.1"}</div>
        </div>
      </footer>
    </div>
  );
}


