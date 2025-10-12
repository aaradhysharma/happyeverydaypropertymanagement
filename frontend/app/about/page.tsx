import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LinkedinIcon, Twitter, Mail } from "lucide-react";

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Operations at Greystar. 15+ years in large-scale property management. Built AI-first workflows to manage 800+ units with 40% fewer staff.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    linkedin: "#",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google AI Research. PhD in Machine Learning from Stanford. Specializes in predictive models and autonomous agent systems for real-world applications.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    linkedin: "#",
  },
  {
    name: "Dr. Aisha Patel",
    role: "Head of AI Systems",
    bio: "Former OpenAI researcher. Built computer vision systems processing 10M+ property images. Expert in GPT-4V integration and multi-modal AI.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    linkedin: "#",
  },
  {
    name: "James Thompson",
    role: "VP of Property Operations",
    bio: "25 years managing HOA and multifamily portfolios. National expert on Fair Housing compliance. Bridges AI capabilities with real-world property challenges.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    linkedin: "#",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div>
            <p className="eyebrow mb-2">Happy Everyday</p>
            <h1 className="text-2xl font-heading text-foreground">About Us</h1>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold">
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="button-primary">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Story */}
        <section className="site-section">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-center">
              <div className="space-y-6">
                <p className="eyebrow">Our story</p>
                <h2 className="text-5xl font-heading text-foreground">
                  Reinventing property management from the ground up.
                </h2>
                <p className="text-lg text-[color:rgba(37,33,30,0.78)]">
                  Founded in 2023, Happy Everyday emerged from a simple frustration: traditional property management was drowning in manual work while AI sat unused. We believed technology could eliminate 80% of routine tasks—freeing professionals to focus on relationships, strategy, and genuine hospitality.
                </p>
                <p className="text-[color:rgba(37,33,30,0.78)]">
                  Today, we manage 212 communities across six states with a lean team of 45 people and eight autonomous AI systems. Our occupancy rates average 94.2%, our response times are 75% faster than industry standard, and our residents report the highest satisfaction scores in every market we serve.
                </p>
              </div>
              <div className="surface-card overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="site-section bg-[rgba(15,61,53,0.05)]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="eyebrow mb-4">Mission & values</p>
                <h2 className="text-4xl font-heading text-foreground">What drives us every day.</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="surface-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Excellence at Scale</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Boutique-quality service across hundreds of properties. AI handles volume; humans ensure excellence.
                    </p>
                  </CardContent>
                </Card>
                <Card className="surface-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Human-First Technology</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Every AI decision serves people—residents, owners, and our team. Technology is a tool, not a replacement.
                    </p>
                  </CardContent>
                </Card>
                <Card className="surface-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Radical Transparency</h3>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Real-time dashboards, automated reporting, and open communication. You always know what's happening.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="site-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Leadership team</p>
              <h2 className="text-4xl font-heading text-foreground mb-4">
                Property experts. AI builders. Problem solvers.
              </h2>
              <p className="text-lg text-[color:rgba(37,33,30,0.78)] max-w-2xl mx-auto">
                Our leadership brings together decades of property management experience with cutting-edge AI research.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <Card key={member.name} className="surface-card">
                  <CardContent className="p-6">
                    <div className="mb-4 overflow-hidden rounded-2xl">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={400}
                        height={400}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-3">{member.role}</p>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)] mb-4">{member.bio}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="rounded-full p-2 h-auto">
                        <LinkedinIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full p-2 h-auto">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* By the Numbers */}
        <section className="site-section bg-[rgba(15,61,53,0.08)]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">By the numbers</p>
              <h2 className="text-4xl font-heading text-foreground">Results that speak for themselves.</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="surface-card">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-heading font-semibold text-primary mb-2">212</div>
                  <p className="text-foreground font-semibold mb-1">Communities Managed</p>
                  <p className="text-sm text-muted-foreground">Across 6 states</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-heading font-semibold text-secondary mb-2">94.2%</div>
                  <p className="text-foreground font-semibold mb-1">Avg Occupancy</p>
                  <p className="text-sm text-muted-foreground">vs 85% industry avg</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-heading font-semibold text-primary mb-2">1.8hr</div>
                  <p className="text-foreground font-semibold mb-1">Median Response Time</p>
                  <p className="text-sm text-muted-foreground">vs 24hr industry avg</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-heading font-semibold text-secondary mb-2">87%</div>
                  <p className="text-foreground font-semibold mb-1">Tenant Retention</p>
                  <p className="text-sm text-muted-foreground">vs 65% industry avg</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="site-section">
          <div className="container mx-auto px-6">
            <Card className="surface-card">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-heading text-foreground mb-4">
                  Ready to elevate your portfolio?
                </h2>
                <p className="text-lg text-[color:rgba(37,33,30,0.78)] mb-8 max-w-2xl mx-auto">
                  Schedule a portfolio review to see how AI-enhanced stewardship can transform your properties.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/#contact">
                    <Button className="button-primary">Schedule consultation</Button>
                  </Link>
                  <Link href="/technology">
                    <Button variant="outline" className="rounded-full">
                      Explore our technology
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">© {new Date().getFullYear()} Happy Everyday Property Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

