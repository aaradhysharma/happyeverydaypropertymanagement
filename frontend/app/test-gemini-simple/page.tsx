"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";

// Chart.js types
declare global {
  interface Window {
    Chart: any;
  }
}

export default function TestGeminiSimplePage() {
  const [address, setAddress] = useState("1015 Walnut Street, Yankton, SD");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // Load Chart.js from CDN
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleAnalysis = async () => {
    if (!address.trim()) {
      setError("Please enter a property address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setChartData(null);

    // Destroy previous chart instance before new analysis
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    try {
      const response = await fetch("/api/analyze-property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to analyze property");
      }

      if (!payload?.content) {
        throw new Error("No analysis content returned");
      }

      if (payload.content.includes("DATA_NOT_FOUND")) {
        setError("We couldn't find enough reliable data for this address. Try another property or verify the address.");
        return;
      }

      setResult(payload.content);

      try {
        let jsonContent = payload.content;
        if (jsonContent.includes("```json")) {
          jsonContent = jsonContent.substring(jsonContent.indexOf("```json") + 7, jsonContent.lastIndexOf("```"));
        } else if (jsonContent.includes("```")) {
          jsonContent = jsonContent.substring(jsonContent.indexOf("```") + 3, jsonContent.lastIndexOf("```"));
        }

        const parsedData = JSON.parse(jsonContent.trim());

        if (parsedData?.error === "DATA_NOT_FOUND") {
          setError("Gemini could not verify enough data for this property. Please try a different address.");
          return;
        }

        setChartData(parsedData);
        requestAnimationFrame(() => createCharts(parsedData));
      } catch (parseError) {
        console.error("JSON parse error", parseError);
        setError("Received analysis but couldn't parse data for charts. Check raw output below.");
      }
    } catch (err: any) {
      console.error("Analysis error", err);
      setError(err?.message || "Failed to analyze property");
    } finally {
      setIsLoading(false);
    }
  };

  const createCharts = (data: any) => {
    if (typeof window === "undefined" || !window.Chart || !chartRef.current) {
      return;
    }

    const comparisonData = data?.crime_data?.comparison;

    if (!Array.isArray(comparisonData) || comparisonData.length === 0) {
      return;
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) {
      return;
    }

    chartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: comparisonData.map((entry: any) => entry.category),
        datasets: [
          {
            label: "Property",
            data: comparisonData.map((entry: any) => entry.subject ?? 0),
            backgroundColor: "rgba(200, 100, 60, 0.8)",
            borderColor: "rgba(200, 100, 60, 1)",
            borderWidth: 2,
          },
          {
            label: "National Avg",
            data: comparisonData.map((entry: any) => entry.national_avg ?? 0),
            backgroundColor: "rgba(123, 123, 123, 0.8)",
            borderColor: "rgba(123, 123, 123, 1)",
            borderWidth: 2,
          },
          {
            label: "State Avg",
            data: comparisonData.map((entry: any) => entry.state_avg ?? 0),
            backgroundColor: "rgba(168, 168, 168, 0.8)",
            borderColor: "rgba(168, 168, 168, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 400,
        },
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Crime Rate Comparison (per 1,000 residents)",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Rate per 1,000" },
          },
        },
      },
    });
  };

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
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
              <p className="eyebrow mb-1">Gemini AI Test</p>
              <h1 className="text-xl font-heading text-foreground">Simple Chart Test</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-semibold text-foreground mb-4">
            Gemini AI Property Analysis with Charts
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Test the Gemini integration with a simple property analysis and see interactive charts.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="surface-card">
            <CardContent className="p-8">
              <div className="space-y-6">
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
                  disabled={isLoading || !address.trim()}
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

        {/* Chart Display */}
        {chartData && (
          <div className="max-w-6xl mx-auto mb-12">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">Analysis Results</h3>
            
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="surface-card">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Crime Rate</h4>
                  <p className="text-3xl font-bold text-foreground">{chartData.crime_data?.total_crime_rate}</p>
                  <p className="text-sm text-muted-foreground">per 1,000 residents</p>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Median Price</h4>
                  <p className="text-3xl font-bold text-foreground">${chartData.market_data?.median_price?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">${chartData.market_data?.price_per_sqft}/sqft</p>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Rent Estimate</h4>
                  <p className="text-3xl font-bold text-foreground">${chartData.market_data?.rent_estimate}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="surface-card">
              <CardContent className="p-6">
                <div style={{ height: '400px' }}>
                  <canvas ref={chartRef}></canvas>
                </div>
              </CardContent>
            </Card>

            {/* Raw Data */}
            <Card className="surface-card mt-8">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Raw Analysis Data</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 max-h-96 overflow-y-auto">
                    {chartData ? JSON.stringify(chartData, null, 2) : result}
                  </pre>
                </div>
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
            Powered by Google Gemini AI with Chart.js v0.0.5
          </p>
        </div>
      </footer>
    </div>
  );
}
