"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Search, MapPin, ArrowLeft, Loader2, BarChart3, Shield, DollarSign, TrendingUp } from "lucide-react";

// Chart.js types
declare global {
  interface Window {
    Chart: any;
  }
}

export default function TestGeminiPage() {
  const [apiKey, setApiKey] = useState("");
  const [address, setAddress] = useState("6737 Arbor Dr, Miramar, FL 33023");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState<any>(null);
  
  const crimeChartRef = useRef<HTMLCanvasElement>(null);
  const marketChartRef = useRef<HTMLCanvasElement>(null);
  const crimeChart = useRef<any>(null);
  const marketChart = useRef<any>(null);

  // Load Chart.js from CDN
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleAnalysis = async () => {
    if (!apiKey.trim() || !address.trim()) {
      setError("Please enter both API key and property address");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");
    setChartData(null);

    // Destroy existing charts
    if (crimeChart.current) crimeChart.current.destroy();
    if (marketChart.current) marketChart.current.destroy();

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
                text: `Analyze the property at ${address}. Provide data in the following JSON format ONLY:

{
  "crime_data": {
    "summary": "Brief crime summary",
    "total_crime_rate": number,
    "violent_crime_rate": number,
    "property_crime_rate": number,
    "comparison": [
      {"category": "Total Crime", "subject": number, "national_avg": number, "state_avg": number},
      {"category": "Violent Crime", "subject": number, "national_avg": number, "state_avg": number},
      {"category": "Property Crime", "subject": number, "national_avg": number, "state_avg": number}
    ],
    "trend": [
      {"year": 2020, "rate": number},
      {"year": 2021, "rate": number},
      {"year": 2022, "rate": number},
      {"year": 2023, "rate": number},
      {"year": 2024, "rate": number}
    ]
  },
  "market_data": {
    "summary": "Brief market summary",
    "median_price": number,
    "rent_estimate": number,
    "price_per_sqft": number,
    "rental_rates": [
      {"type": "Studio", "rent": number},
      {"type": "1BR", "rent": number},
      {"type": "2BR", "rent": number},
      {"type": "3BR", "rent": number}
    ],
    "price_trend": [
      {"year": 2020, "price": number},
      {"year": 2021, "price": number},
      {"year": 2022, "price": number},
      {"year": 2023, "price": number},
      {"year": 2024, "price": number}
    ]
  },
  "amenities": {
    "restaurants": number,
    "shopping_centers": number,
    "schools": number,
    "hospitals": number,
    "parks": number
  },
  "investment": {
    "rating": number,
    "roi_potential": string,
    "key_strengths": [string],
    "key_risks": [string]
  }
}

Return ONLY valid JSON, no markdown formatting.`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 4000,
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
      
      // Parse and visualize the JSON data
      try {
        let jsonContent = content;
        if (content.includes('```json')) {
          jsonContent = content.substring(content.indexOf('```json') + 7, content.lastIndexOf('```'));
        } else if (content.includes('```')) {
          jsonContent = content.substring(content.indexOf('```') + 3, content.lastIndexOf('```'));
        }
        
        const parsedData = JSON.parse(jsonContent.trim());
        setChartData(parsedData);
        
        // Wait for next render cycle to create charts
        setTimeout(() => createCharts(parsedData), 100);
      } catch (parseError) {
        console.error("Could not parse JSON:", parseError);
        setError("Received data but couldn't parse it into charts. Check raw results below.");
      }
    } catch (error: any) {
      setError(error.message || 'Failed to analyze property with Gemini API');
    } finally {
      setIsLoading(false);
    }
  };

  const createCharts = (data: any) => {
    if (!window.Chart || !data) return;

    // Crime Comparison Chart
    if (crimeChartRef.current && data.crime_data?.comparison) {
      const ctx = crimeChartRef.current.getContext('2d');
      if (ctx) {
        crimeChart.current = new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.crime_data.comparison.map((d: any) => d.category),
            datasets: [
              {
                label: 'Property',
                data: data.crime_data.comparison.map((d: any) => d.subject),
                backgroundColor: 'rgba(200, 100, 60, 0.8)',
                borderColor: 'rgba(200, 100, 60, 1)',
                borderWidth: 2
              },
              {
                label: 'National Avg',
                data: data.crime_data.comparison.map((d: any) => d.national_avg),
                backgroundColor: 'rgba(123, 123, 123, 0.8)',
                borderColor: 'rgba(123, 123, 123, 1)',
                borderWidth: 2
              },
              {
                label: 'State Avg',
                data: data.crime_data.comparison.map((d: any) => d.state_avg),
                backgroundColor: 'rgba(168, 168, 168, 0.8)',
                borderColor: 'rgba(168, 168, 168, 1)',
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              },
              title: {
                display: true,
                text: 'Crime Rate Comparison (per 1,000 residents)',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Rate per 1,000'
                }
              }
            }
          }
        });
      }
    }

    // Market Rental Rates Chart
    if (marketChartRef.current && data.market_data?.rental_rates) {
      const ctx = marketChartRef.current.getContext('2d');
      if (ctx) {
        marketChart.current = new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.market_data.rental_rates.map((d: any) => d.type),
            datasets: [{
              label: 'Monthly Rent ($)',
              data: data.market_data.rental_rates.map((d: any) => d.rent),
              backgroundColor: 'rgba(15, 61, 53, 0.8)',
              borderColor: 'rgba(15, 61, 53, 1)',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Rental Rates by Unit Type',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Monthly Rent ($)'
                }
              }
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (crimeChart.current) crimeChart.current.destroy();
      if (marketChart.current) marketChart.current.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <p className="eyebrow mb-1">Gemini AI Property Analysis</p>
              <h1 className="text-xl font-heading text-foreground">Test with Charts & Graphs</h1>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/technology">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Technology
              </Button>
            </Link>
            <Link href="/analyze">
              <Button className="button-primary">Full Analysis</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-semibold text-foreground mb-4">
            Gemini AI Property Analysis with Visualizations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Enter your API key and property address to get instant analysis with interactive charts and graphs.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="surface-card">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter property address"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Try: "1015 Walnut Street, Yankton, SD" or "6737 Arbor Dr, Miramar, FL 33023"
                  </p>
                </div>
                
                <Button 
                  onClick={handleAnalysis}
                  disabled={isLoading || !apiKey.trim() || !address.trim()}
                  className="w-full py-4 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Property...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze Property with Gemini AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Charts Display */}
        {chartData && (
          <div className="max-w-6xl mx-auto mb-12">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">Analysis Results</h3>
            
            {/* Key Metrics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {chartData.crime_data && (
                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Crime Rate</h4>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{chartData.crime_data.total_crime_rate}</p>
                    <p className="text-sm text-muted-foreground">per 1,000 residents</p>
                  </CardContent>
                </Card>
              )}

              {chartData.market_data && (
                <>
                  <Card className="surface-card">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Median Price</h4>
                      </div>
                      <p className="text-3xl font-bold text-foreground">${chartData.market_data.median_price?.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">${chartData.market_data.price_per_sqft}/sqft</p>
                    </CardContent>
                  </Card>

                  <Card className="surface-card">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Rent Estimate</h4>
                      </div>
                      <p className="text-3xl font-bold text-foreground">${chartData.market_data.rent_estimate}</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {chartData.investment && (
                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Investment Rating</h4>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{chartData.investment.rating}/10</p>
                    <p className="text-sm text-muted-foreground">{chartData.investment.roi_potential}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Charts */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <Card className="surface-card">
                <CardContent className="p-6">
                  <div style={{ height: '400px' }}>
                    <canvas ref={crimeChartRef}></canvas>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardContent className="p-6">
                  <div style={{ height: '400px' }}>
                    <canvas ref={marketChartRef}></canvas>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investment Summary */}
            {chartData.investment && (
              <Card className="surface-card">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-foreground mb-4">Investment Analysis</h4>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Key Strengths</h5>
                      <ul className="space-y-2">
                        {chartData.investment.key_strengths.map((strength: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Key Risks</h5>
                      <ul className="space-y-2">
                        {chartData.investment.key_risks.map((risk: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-red-600">⚠</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Raw Data */}
            <Card className="surface-card mt-8">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Raw Analysis Data</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 max-h-96 overflow-y-auto">{JSON.stringify(chartData, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Preview */}
        {!isLoading && !chartData && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16">
            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-primary/10 p-4 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Crime Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive charts showing crime rates, trends, and comparisons
                </p>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-secondary/10 p-4 w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Market Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize rental rates, property values, and market trends
                </p>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-primary/10 p-4 w-fit mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Local Amenities</h3>
                <p className="text-sm text-muted-foreground">
                  Data on dining, shopping, schools, and quality of life
                </p>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-secondary/10 p-4 w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Investment Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  ROI projections, ratings, and AI-powered recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-background/80 mt-20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">
            © 2026 Happy Everyday Property Management. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Google Gemini AI with Chart.js v0.0.4
          </p>
        </div>
      </footer>
    </div>
  );
}