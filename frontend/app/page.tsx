import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, BarChart3, ImageIcon, Users, Shield, Zap, Brain, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-card/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Building2 className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text">Happy Everyday</span>
              <p className="text-xs text-muted-foreground">AI Property Intelligence</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 glow-effect">
                <Zap className="mr-2 h-4 w-4" />
                Launch Platform
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-sm text-primary font-medium">🚀 Next-Gen Property Management</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            AI-Powered Property
            <br />Intelligence Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your property operations with cutting-edge AI automation, 
            predictive analytics, and real-time intelligence. Built for modern property managers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 glow-effect">
                <Brain className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-primary/30 hover:bg-primary/10">
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-primary">60%</div>
              <div className="text-sm text-muted-foreground">Vacancy Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">75%</div>
              <div className="text-sm text-muted-foreground">Faster Response</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">20%</div>
              <div className="text-sm text-muted-foreground">Revenue Increase</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <Card className="card-hover gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">CORE</span>
              </div>
              <CardTitle className="text-xl">Intelligent Analytics</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Real-time business intelligence with predictive insights and automated reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Live occupancy tracking</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Cash flow forecasting</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Cost optimization</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Retention analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <ImageIcon className="h-8 w-8 text-secondary" />
                </div>
                <span className="text-xs px-3 py-1 bg-secondary/20 text-secondary rounded-full">AI</span>
              </div>
              <CardTitle className="text-xl">Vision Inspection</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                GPT-4V powered automated property analysis and damage assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><Brain className="h-4 w-4 text-secondary" /> Auto damage detection</li>
                <li className="flex items-center gap-2"><Brain className="h-4 w-4 text-secondary" /> Roof analysis</li>
                <li className="flex items-center gap-2"><Brain className="h-4 w-4 text-secondary" /> Severity scoring</li>
                <li className="flex items-center gap-2"><Brain className="h-4 w-4 text-secondary" /> Cost estimates</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">AUTO</span>
              </div>
              <CardTitle className="text-xl">Smart Dispatch</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                AI-powered provider matching with route optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Auto-assignment</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Route planning</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Live tracking</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Performance metrics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <span className="text-xs px-3 py-1 bg-secondary/20 text-secondary rounded-full">SECURE</span>
              </div>
              <CardTitle className="text-xl">Enterprise Security</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                SOC 2, ISO 27001, GDPR, CCPA certified platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-secondary" /> End-to-end encryption</li>
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-secondary" /> Audit logging</li>
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-secondary" /> Compliance tools</li>
                <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-secondary" /> Data privacy</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">AI</span>
              </div>
              <CardTitle className="text-xl">Market Intelligence</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Claude-powered competitive analysis and strategic insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Competitor tracking</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Market trends</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Pricing strategy</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Gap analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <span className="text-xs px-3 py-1 bg-secondary/20 text-secondary rounded-full">PROVEN</span>
              </div>
              <CardTitle className="text-xl">ROI Impact</CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Measurable results backed by industry research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-secondary" /> 60% vacancy drop</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-secondary" /> 75% faster ops</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-secondary" /> 20% revenue up</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-secondary" /> 40% cost savings</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AI Technology Section */}
        <div className="gradient-border rounded-2xl p-10 mb-20 bg-card/30 backdrop-blur-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-muted-foreground">Industry-leading AI models for property intelligence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">GPT-4V</div>
              <div className="text-muted-foreground">Vision Analysis</div>
              <div className="text-sm text-muted-foreground/60 mt-2">Property Inspection</div>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-secondary/10 rounded-2xl mb-4">
                <Zap className="h-10 w-10 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary mb-2">Claude 3.5</div>
              <div className="text-muted-foreground">Intelligence Engine</div>
              <div className="text-sm text-muted-foreground/60 mt-2">Market Analysis</div>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">FastAPI</div>
              <div className="text-muted-foreground">Performance</div>
              <div className="text-sm text-muted-foreground/60 mt-2">Real-time Processing</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-16 border border-primary/20">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join property managers who are already saving time and increasing revenue with AI
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 glow-effect">
                Start Your Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-10 py-7">
              Schedule Demo
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <span className="font-bold gradient-text">Happy Everyday</span>
                <p className="text-xs text-muted-foreground">AI Property Intelligence Platform</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Happy Everyday. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Version {process.env.NEXT_PUBLIC_VERSION || '0.0.1'}</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

