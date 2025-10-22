"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import type { PropertyAnalysis } from "@/lib/property-analysis/schema";

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
  const [analysisData, setAnalysisData] = useState<PropertyAnalysis | null>(null);

  const crimeChartRef = useRef<HTMLCanvasElement>(null);
  const crimeChartInstance = useRef<any>(null);
  const typeChartRef = useRef<HTMLCanvasElement>(null);
  const typeChartInstance = useRef<any>(null);

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
    setAnalysisData(null);

    // Destroy previous chart instance before new analysis
    [crimeChartInstance, typeChartInstance].forEach((instance) => {
      if (instance.current) {
        instance.current.destroy();
        instance.current = null;
      }
    });

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

      const data: PropertyAnalysis = payload.data;
      setAnalysisData(data);

      if (payload.warnings?.includes("INVALID_JSON")) {
        setError(
          "Gemini returned a malformed response. Displaying fallback recommendations—manual verification is recommended."
        );
      } else if (payload.warnings?.includes("DATA_NOT_FOUND")) {
        setError(
          "We couldn't find enough reliable public data for this address. Showing guidance on next steps—please consult local sources for detailed insights."
        );
      } else if (payload.warnings?.includes("VALIDATION_FAILED")) {
        setError(
          "Gemini returned data that did not fully validate. Displaying fallback recommendations—manual verification is recommended."
        );
      }

      requestAnimationFrame(() => createCharts(data));
    } catch (err: any) {
      console.error("Analysis error", err);
      setError(err?.message || "Failed to analyze property");
    } finally {
      setIsLoading(false);
    }
  };

  const createCharts = (data: PropertyAnalysis) => {
    if (typeof window === "undefined" || !window.Chart) {
      return;
    }

    const comparisonData = data.crime_analysis;
    const comparisonArray = [
      {
        category: "Total Crime",
        subject: data.crime_analysis.total_crime_rate ?? 0,
        national_avg: data.crime_analysis.national_avg_total ?? 0,
        state_avg: data.crime_analysis.state_avg_total ?? 0,
      },
      {
        category: "Violent Crime",
        subject: data.crime_analysis.violent_crime_rate ?? 0,
        national_avg: data.crime_analysis.national_avg_violent ?? 0,
        state_avg: data.crime_analysis.state_avg_violent ?? 0,
      },
      {
        category: "Property Crime",
        subject: data.crime_analysis.property_crime_rate ?? 0,
        national_avg: data.crime_analysis.national_avg_property ?? 0,
        state_avg: data.crime_analysis.state_avg_property ?? 0,
      },
      {
        category: "Theft",
        subject: data.crime_analysis.theft_rate ?? 0,
        national_avg: data.crime_analysis.national_avg_theft ?? 0,
        state_avg: data.crime_analysis.state_avg_theft ?? 0,
      },
    ];

    if (crimeChartRef.current) {
      const ctx = crimeChartRef.current.getContext("2d");
      if (ctx) {
        crimeChartInstance.current = new window.Chart(ctx, {
          type: "bar",
          data: {
            labels: comparisonArray.map((entry) => entry.category),
            datasets: [
              {
                label: "Property",
                data: comparisonArray.map((entry) => entry.subject),
                backgroundColor: "rgba(200, 100, 60, 0.8)",
                borderColor: "rgba(200, 100, 60, 1)",
                borderWidth: 2,
              },
              {
                label: "National Avg",
                data: comparisonArray.map((entry) => entry.national_avg),
                backgroundColor: "rgba(123, 123, 123, 0.8)",
                borderColor: "rgba(123, 123, 123, 1)",
                borderWidth: 2,
              },
              {
                label: "State Avg",
                data: comparisonArray.map((entry) => entry.state_avg),
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
      }
    }

    const typeDistribution = data.crime_type_distribution;
    if (typeChartRef.current) {
      const ctx = typeChartRef.current.getContext("2d");
      if (ctx) {
        typeChartInstance.current = new window.Chart(ctx, {
          type: "pie",
          data: {
            labels: [
              "Theft/Larceny",
              "Aggravated Assault",
              "Motor Vehicle Theft",
              "Burglary",
              "Rape",
              "Robbery",
              "Murder",
            ],
            datasets: [
              {
                data: [
                  typeDistribution.theft_larceny_percentage ?? 0,
                  typeDistribution.aggravated_assault_percentage ?? 0,
                  typeDistribution.motor_vehicle_theft_percentage ?? 0,
                  typeDistribution.burglary_percentage ?? 0,
                  typeDistribution.rape_percentage ?? 0,
                  typeDistribution.robbery_percentage ?? 0,
                  typeDistribution.murder_percentage ?? 0,
                ],
                backgroundColor: [
                  "#c8643c",
                  "#0f3d35",
                  "#7b7b7b",
                  "#a8a8a8",
                  "#c85050",
                  "#f4a261",
                  "#8b0000",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Crime Type Distribution",
                font: { size: 16, weight: "bold" },
              },
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      [crimeChartInstance, typeChartInstance].forEach((instance) => {
        if (instance.current) {
          instance.current.destroy();
          instance.current = null;
        }
      });
    };
  }, []);

  const formatCurrency = (value: number | null | undefined) => {
    if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
    return `$${Math.round(value).toLocaleString()}`;
  };

  const formatPercentage = (value: number | null | undefined, suffix = "%") => {
    if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
    return `${value.toFixed(1)}${suffix}`;
  };

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

        {/* Results Display */}
        {analysisData && (
          <div className="max-w-6xl mx-auto mb-16 space-y-8">
            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="surface-card">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Cap Rate</p>
                  <p className="text-3xl font-bold text-foreground">{formatPercentage(analysisData.property_overview.cap_rate, "%")}</p>
                  <p className="text-xs text-muted-foreground">Price per Unit: {formatCurrency(analysisData.property_overview.price_per_unit)}</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Occupancy</p>
                  <p className="text-3xl font-bold text-foreground">{formatPercentage(analysisData.property_overview.occupancy_rate)}</p>
                  <p className="text-xs text-muted-foreground">Units: {analysisData.property_overview.units ?? "N/A"}</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Median Rent</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(analysisData.market_data.median_rent)}</p>
                  <p className="text-xs text-muted-foreground">YOY Trend: {formatPercentage(analysisData.market_data.rent_trend_yoy)}</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Investment Rating</p>
                  <p className="text-3xl font-bold text-foreground">{analysisData.investment_ratings.overall_score.toFixed(1)}/10</p>
                  <p className="text-xs text-muted-foreground">Decision: {analysisData.recommendation.invest_decision}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="surface-card">
                <CardContent className="p-6" style={{ height: "420px" }}>
                  <canvas ref={crimeChartRef} />
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-6" style={{ height: "420px" }}>
                  <canvas ref={typeChartRef} />
                </CardContent>
              </Card>
            </div>

            {/* Crime Trend */}
            <Card className="surface-card">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground uppercase font-semibold mb-4">Crime Trend (5 Year)</p>
                <div className="flex gap-6 overflow-x-auto text-sm">
                  {analysisData.crime_trend_5year.map((entry) => (
                    <div key={entry.year} className="min-w-[120px]">
                      <p className="text-muted-foreground">{entry.year}</p>
                      <p className="text-lg font-semibold">{entry.total_crimes ?? "N/A"}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="surface-card">
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Security Recommendations</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {analysisData.security_recommendations.slice(0, 6).map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Key Strengths</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {analysisData.recommendation.key_strengths.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Key Concerns</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {analysisData.recommendation.key_concerns.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-destructive">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Raw Data Inspector */}
            <Card className="surface-card">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Validated Analysis JSON</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 max-h-96 overflow-y-auto">
                    {analysisData ? JSON.stringify(analysisData, null, 2) : result}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Preview */}
        {!isLoading && !analysisData && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg-grid-cols-4 mt-16">
            {/* ... existing feature cards ... */}
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
