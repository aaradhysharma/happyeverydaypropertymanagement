"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Eye, Zap, Shield, BarChart3, Bot, Network, Cpu, Sparkles, Search, MapPin } from "lucide-react";
import { useState } from "react";

const aiSystems = [
  {
    name: "Predictive Maintenance AI",
    icon: Brain,
    description: "Machine learning models analyze historical maintenance data, weather patterns, and equipment age to predict failures before they occur.",
    capabilities: [
      "HVAC failure prediction with 89% accuracy",
      "Plumbing issue detection 2-3 weeks in advance",
      "Roof deterioration modeling",
      "Automated preventive maintenance scheduling",
    ],
    tech: "TensorFlow, Prophet time-series forecasting",
  },
  {
    name: "Computer Vision Inspection",
    icon: Eye,
    description: "GPT-4V and custom vision models process property photos to identify maintenance issues, safety hazards, and compliance violations.",
    capabilities: [
      "Roof damage assessment from drone imagery",
      "Structural issue identification",
      "Safety hazard detection (fire exits, ADA compliance)",
      "Automated inspection report generation",
    ],
    tech: "GPT-4 Vision, OpenCV, YOLO object detection",
  },
  {
    name: "Intelligent Dispatch System",
    icon: Zap,
    description: "Autonomous agent coordinates vendor selection, scheduling, and route optimization for maximum efficiency.",
    capabilities: [
      "Real-time vendor matching based on specialty and availability",
      "Dynamic route optimization across portfolio",
      "Automatic work order creation and assignment",
      "75% faster response times than manual coordination",
    ],
    tech: "Claude AI, Google Maps API, custom routing algorithms",
  },
  {
    name: "Compliance Automation",
    icon: Shield,
    description: "Continuous monitoring agent ensures adherence to Fair Housing, GDPR, CCPA, and local regulations across all properties.",
    capabilities: [
      "Real-time Fair Housing Act compliance checking",
      "Automated audit trail generation",
      "GDPR/CCPA data privacy enforcement",
      "Instant alerts for potential violations",
    ],
    tech: "Rule-based AI, NLP for document analysis",
  },
  {
    name: "Revenue Optimization Engine",
    icon: BarChart3,
    description: "Predictive analytics and dynamic pricing algorithms maximize rental income while maintaining high occupancy.",
    capabilities: [
      "Dynamic rent pricing based on market conditions",
      "Occupancy forecasting 3-6 months ahead",
      "Competitor rate monitoring and analysis",
      "15-20% revenue increase on average",
    ],
    tech: "Scikit-learn, XGBoost, custom pricing models",
  },
  {
    name: "Resident Communication Bot",
    icon: Bot,
    description: "24/7 AI assistant handles routine tenant inquiries, maintenance requests, and lease renewals via chat and email.",
    capabilities: [
      "Natural language understanding in 15 languages",
      "Automatic maintenance request categorization",
      "Lease renewal reminders and processing",
      "3-5 minute average response time",
    ],
    tech: "Claude 3.5, custom fine-tuned LLMs",
  },
  {
    name: "Market Intelligence Agent",
    icon: Network,
    description: "Web scraping and analysis bot monitors competitor properties, market trends, and regulatory changes.",
    capabilities: [
      "Automated competitor pricing analysis",
      "Local market trend detection",
      "Regulatory change monitoring",
      "Strategic insights generation",
    ],
    tech: "Claude AI, Firecrawl, custom web scrapers",
  },
  {
    name: "Portfolio Analytics Platform",
    icon: Cpu,
    description: "Real-time data processing pipeline aggregates metrics from all systems into actionable insights.",
    capabilities: [
      "Live dashboard with 50+ KPIs",
      "Automated quarterly reports for owners",
      "Anomaly detection across portfolio",
      "Predictive cash flow modeling",
    ],
    tech: "FastAPI, PostgreSQL, React Query, Recharts",
  },
];

// Gemini Demo Component
function GeminiDemo() {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!apiKey.trim() || !query.trim()) {
      setError("Please enter both API key and query");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${query}\n\nPlease provide the answer in a clear numbered list format with values. For example: "1. Russia - 17,098,242"`
              }]
            }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      setResult(content);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch data from Gemini API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="text-2xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        Gemini AI Demo
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Search Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Top 10 countries by land area in square kilometers"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <p className="text-xs text-muted-foreground mt-1">
            💡 Try: "Top 10 largest cities by population", "Top 5 fastest animals in mph"
          </p>
        </div>
        
        <Button 
          onClick={handleSearch}
          disabled={isLoading || !apiKey.trim() || !query.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search with Gemini
            </>
          )}
        </Button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Results:</h4>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div>
            <p className="eyebrow mb-2">Happy Everyday</p>
            <h1 className="text-2xl font-heading text-foreground">AI Technology Stack</h1>
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
        {/* Hero */}
        <section className="site-section bg-[rgba(15,61,53,0.05)]">
          <div className="container mx-auto px-6 text-center">
            <p className="eyebrow mb-4">Proprietary AI infrastructure</p>
            <h2 className="text-5xl font-heading text-foreground mb-6">
              Eight autonomous systems working in concert.
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-[color:rgba(37,33,30,0.78)] mb-8">
              Our AI agent network operates 24/7, processing thousands of data points per minute to optimize every aspect of property
              stewardship. Each system feeds intelligence to the others, creating a continuously learning ecosystem.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <div className="text-3xl font-heading font-semibold text-primary">8</div>
                <div className="text-muted-foreground">AI Systems</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-semibold text-secondary">24/7</div>
                <div className="text-muted-foreground">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-semibold text-primary">89%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-semibold text-secondary">75%</div>
                <div className="text-muted-foreground">Faster Response</div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Systems Grid */}
        <section className="site-section">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-2">
              {aiSystems.map((system) => (
                <Card key={system.name} className="surface-card">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="rounded-xl bg-primary/10 p-3">
                        <system.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">{system.name}</h3>
                        <p className="text-[color:rgba(37,33,30,0.78)]">{system.description}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-semibold text-foreground">Capabilities:</p>
                      <ul className="space-y-2">
                        {system.capabilities.map((capability, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                            <span className="text-primary">•</span>
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Tech Stack:</span> {system.tech}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gemini AI Demo Section */}
        <section className="site-section bg-[rgba(15,61,53,0.08)]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <p className="eyebrow">Try our AI technology</p>
                <h2 className="text-4xl font-heading text-foreground mb-4">
                  Experience Gemini AI in Action
                </h2>
                <p className="text-lg text-[color:rgba(37,33,30,0.78)] max-w-2xl mx-auto">
                  Test our Gemini AI integration with your own API key. See how our property analysis technology works in real-time.
                </p>
              </div>
              
              <GeminiDemo />
            </div>
          </div>
        </section>

        {/* Human-AI Partnership */}
        <section className="site-section">
          <div className="container mx-auto px-6">
            <div className="surface-card p-12 max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                <p className="eyebrow">The human element</p>
                <h2 className="text-4xl font-heading text-foreground">
                  Technology empowers people. It doesn't replace them.
                </h2>
                <p className="text-lg text-[color:rgba(37,33,30,0.78)] max-w-2xl mx-auto">
                  While our AI handles routine operations at machine speed, our onsite professionals focus exclusively on what humans do best: building relationships, navigating complex negotiations, making judgment calls, and providing genuine hospitality.
                </p>
                <p className="text-[color:rgba(37,33,30,0.78)] max-w-2xl mx-auto">
                  Every AI decision can be reviewed and overridden by our property managers. Technology serves our team and your residents—never the other way around.
                </p>
                <div className="pt-6 flex gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="button-primary">Explore live dashboard</Button>
                  </Link>
                  <Link href="/analyze">
                    <Button variant="outline">Test Property Analysis</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/80 mt-20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">© 2026 Happy Everyday Property Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

