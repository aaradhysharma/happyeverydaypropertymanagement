"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowLeft, Loader2, ShieldAlert, AlertTriangle, TrendingUp, MapPin, UtensilsCrossed, Briefcase } from "lucide-react";

// Chart.js types
declare global {
  interface Window {
    Chart: any;
  }
}

type PropertyAnalysis = {
  property_info?: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
  };
  crime_data?: any;
  market_data?: any;
  amenities?: any;
  economics?: any;
  investment?: any;
};

const CHART_COLORS = {
  primary: "rgba(200, 100, 60, 0.8)",
  secondary: "rgba(15, 61, 53, 0.8)",
  tertiary: "rgba(123, 123, 123, 0.8)",
  accent: "rgba(168, 168, 168, 0.8)",
};

export default function TestGeminiSimplePage() {
  const [address, setAddress] = useState("1015 Walnut Street, Yankton, SD");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<PropertyAnalysis | null>(null);
  
  const comparisonChartRef = useRef<HTMLCanvasElement>(null);
  const breakdownChartRef = useRef<HTMLCanvasElement>(null);
  const trendChartRef = useRef<HTMLCanvasElement>(null);
  const rentalChartRef = useRef<HTMLCanvasElement>(null);
  const priceTrendChartRef = useRef<HTMLCanvasElement>(null);
  const restaurantChartRef = useRef<HTMLCanvasElement>(null);
  
  const chartInstances = useRef<any[]>([]);

  // Load Chart.js from CDN
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const destroyAllCharts = () => {
    chartInstances.current.forEach(chart => {
      if (chart) chart.destroy();
    });
    chartInstances.current = [];
  };

  const handleAnalysis = async () => {
    if (!address.trim()) {
      setError("Please enter a property address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAnalysisData(null);
    destroyAllCharts();

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

        setAnalysisData(parsedData);
        setTimeout(() => createCharts(parsedData), 100);
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

  const createCharts = (data: PropertyAnalysis) => {
    if (typeof window === "undefined" || !window.Chart) {
      return;
    }

    destroyAllCharts();

    // Crime Comparison Chart
    if (comparisonChartRef.current && data?.crime_data?.comparison) {
      const ctx = comparisonChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new window.Chart(ctx, {
          type: "bar",
          data: {
            labels: data.crime_data.comparison.map((entry: any) => entry.category),
            datasets: [
              {
                label: "Property",
                data: data.crime_data.comparison.map((entry: any) => entry.subject ?? 0),
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primary.replace("0.8", "1"),
                borderWidth: 2,
              },
              {
                label: "National Avg",
                data: data.crime_data.comparison.map((entry: any) => entry.national_avg ?? 0),
                backgroundColor: CHART_COLORS.tertiary,
                borderColor: CHART_COLORS.tertiary.replace("0.8", "1"),
                borderWidth: 2,
              },
              {
                label: "State Avg",
                data: data.crime_data.comparison.map((entry: any) => entry.state_avg ?? 0),
                backgroundColor: CHART_COLORS.accent,
                borderColor: CHART_COLORS.accent.replace("0.8", "1"),
                borderWidth: 2,
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
        chartInstances.current.push(chart);
      }
    }

    // Crime Breakdown Pie Chart
    if (breakdownChartRef.current && data?.crime_data?.breakdown) {
      const ctx = breakdownChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new window.Chart(ctx, {
          type: "pie",
          data: {
            labels: data.crime_data.breakdown.map((entry: any) => entry.name),
            datasets: [{
              data: data.crime_data.breakdown.map((entry: any) => entry.value),
              backgroundColor: [
                "#c8643c", "#0f3d35", "#7b7b7b", "#a8a8a8", "#c85050", "#8b0000"
              ],
            }],
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
        chartInstances.current.push(chart);
      }
    }

    // Crime Trend Line Chart
    if (trendChartRef.current && data?.crime_data?.trend) {
      const ctx = trendChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new window.Chart(ctx, {
          type: "line",
          data: {
            labels: data.crime_data.trend.map((entry: any) => entry.year),
            datasets: [
              {
                label: "Total Crimes",
                data: data.crime_data.trend.map((entry: any) => entry.crimes),
                borderColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primary.replace("0.8", "0.2"),
                tension: 0.4,
                borderWidth: 3,
              },
              {
                label: "Rate per 1K",
                data: data.crime_data.trend.map((entry: any) => entry.rate),
                borderColor: CHART_COLORS.secondary,
                backgroundColor: CHART_COLORS.secondary.replace("0.8", "0.2"),
                tension: 0.4,
                borderWidth: 3,
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
                text: "5-Year Crime Trend",
                font: { size: 16, weight: "bold" },
              },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
        chartInstances.current.push(chart);
      }
    }

    // Rental Rates Chart
    if (rentalChartRef.current && data?.market_data?.rental_rates) {
      const ctx = rentalChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new window.Chart(ctx, {
          type: "bar",
          data: {
            labels: data.market_data.rental_rates.map((entry: any) => entry.type),
            datasets: [
              {
                label: "Avg Rent ($)",
                data: data.market_data.rental_rates.map((entry: any) => entry.rent),
                backgroundColor: CHART_COLORS.secondary,
                yAxisID: "y",
              },
              {
                label: "Avg Sq Ft",
                data: data.market_data.rental_rates.map((entry: any) => entry.sqft),
                backgroundColor: CHART_COLORS.primary,
                yAxisID: "y1",
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
                text: "Rental Rates by Bedroom Type",
                font: { size: 16, weight: "bold" },
              },
            },
            scales: {
              y: {
                type: "linear",
                display: true,
                position: "left",
                title: { display: true, text: "Rent ($)" },
              },
              y1: {
                type: "linear",
                display: true,
                position: "right",
                title: { display: true, text: "Sq Ft" },
                grid: { drawOnChartArea: false },
              },
            },
          },
        });
        chartInstances.current.push(chart);
      }
    }

    // Price Trend Chart
    if (priceTrendChartRef.current && data?.market_data?.price_trend) {
      const ctx = priceTrendChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new window.Chart(ctx, {
          type: "line",
          data: {
            labels: data.market_data.price_trend.map((entry: any) => entry.year),
            datasets: [{
              label: "Median Price",
              data: data.market_data.price_trend.map((entry: any) => entry.price),
              borderColor: CHART_COLORS.secondary,
              backgroundColor: CHART_COLORS.secondary.replace("0.8", "0.2"),
              tension: 0.4,
              borderWidth: 3,
              fill: true,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Property Price Trend",
                font: { size: 16, weight: "bold" },
              },
            },
            scales: {
              y: { beginAtZero: false },
            },
          },
        });
        chartInstances.current.push(chart);
      }
    }

    // Restaurant Distribution Chart
    if (restaurantChartRef.current && data?.amenities?.restaurant_types) {
      const ctx = restaurantChartRef.current.getContext("2d");
      if (ctx) {
        const chart = new window.Chart(ctx, {
          type: "pie",
          data: {
            labels: data.amenities.restaurant_types.map((entry: any) => entry.type),
            datasets: [{
              data: data.amenities.restaurant_types.map((entry: any) => entry.count),
              backgroundColor: [
                "#0f3d35", "#c8643c", "#4a7c7e", "#d4976c", "#2c5f5f", "#999999"
              ],
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
              title: {
                display: true,
                text: "Restaurant Distribution",
                font: { size: 16, weight: "bold" },
              },
            },
          },
        });
        chartInstances.current.push(chart);
      }
    }
  };

  useEffect(() => {
    return () => {
      destroyAllCharts();
    };
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "very high":
      case "high":
        return "bg-red-100 text-red-700";
      case "moderate":
        return "bg-yellow-100 text-yellow-700";
      case "low":
      case "very low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
              <p className="eyebrow mb-1">Gemini AI Property Analysis</p>
              <h1 className="text-xl font-heading text-foreground">Comprehensive Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-semibold text-foreground mb-4">
            AI-Powered Property Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get comprehensive insights with crime analysis, market data, amenities, economics, and investment recommendations.
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading && address.trim()) {
                        handleAnalysis();
                      }
                    }}
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
          <div className="max-w-7xl mx-auto">
            {/* Property Header */}
            <div className="mb-12">
              <div className="mb-4">
                <h2 className="text-4xl font-heading font-semibold text-foreground mb-2">
                  {analysisData.property_info?.address || address}
                </h2>
                <p className="flex items-center gap-2 text-lg text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  {analysisData.property_info?.city}, {analysisData.property_info?.state} {analysisData.property_info?.zip_code}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card className="surface-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Crime Rate</h4>
                    <p className="text-3xl font-bold text-foreground">{analysisData.crime_data?.total_crime_rate?.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">per 1,000 residents</p>
                    <p className="text-xs mt-2 font-semibold text-secondary">{analysisData.crime_data?.risk_level || "MODERATE"}</p>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Median Price</h4>
                    <p className="text-3xl font-bold text-foreground">
                      {analysisData.market_data?.median_price 
                        ? `$${(analysisData.market_data.median_price / 1000).toFixed(0)}K`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${analysisData.market_data?.price_per_sqft || "N/A"}/sqft
                    </p>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Avg Rent</h4>
                    <p className="text-3xl font-bold text-foreground">
                      ${analysisData.market_data?.avg_rent?.toLocaleString() || analysisData.market_data?.rent_estimate?.toLocaleString() || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">per month</p>
                    <p className="text-xs mt-2 font-semibold text-primary">{analysisData.market_data?.market_temp || "STABLE"}</p>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Investment Score</h4>
                    <p className="text-3xl font-bold text-primary">
                      {analysisData.investment?.overall_score?.toFixed(1) || "N/A"}/10
                    </p>
                    <p className="text-sm text-muted-foreground">Overall rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Investment Rating */}
              {analysisData.investment && (
                <Card className="surface-card">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-foreground mb-3">Investment Rating</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cap Rate</span>
                          <span className="font-semibold text-primary">{analysisData.investment.cap_rate_score}/10</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(analysisData.investment.cap_rate_score || 0) * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Market Stability</span>
                          <span className="font-semibold text-primary">{analysisData.investment.market_stability_score}/10</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(analysisData.investment.market_stability_score || 0) * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Crime Safety</span>
                          <span className="font-semibold text-secondary">{analysisData.investment.crime_safety_score}/10</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${(analysisData.investment.crime_safety_score || 0) * 10}%` }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="crime" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5 rounded-full bg-card shadow-[0_10px_30px_rgba(15,61,53,0.06)]">
                <TabsTrigger value="crime" className="rounded-full">Crime Analysis</TabsTrigger>
                <TabsTrigger value="market" className="rounded-full">Market Data</TabsTrigger>
                <TabsTrigger value="amenities" className="rounded-full">Amenities</TabsTrigger>
                <TabsTrigger value="economics" className="rounded-full">Economics</TabsTrigger>
                <TabsTrigger value="investment" className="rounded-full">Investment</TabsTrigger>
              </TabsList>

              {/* Crime Analysis Tab */}
              <TabsContent value="crime" className="space-y-8">
                {analysisData.crime_data && (
                  <>
                    {/* Crime Risk Banner */}
                    <Card className="surface-card border-l-4 border-l-secondary">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-xl bg-secondary/10 p-3">
                            <ShieldAlert className="h-6 w-6 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                              Crime Risk Assessment: {analysisData.crime_data.risk_level || "MODERATE"}
                            </h3>
                            <p className="text-[color:rgba(37,33,30,0.78)] mb-3">
                              {analysisData.crime_data.summary}
                            </p>
                            <div className="grid gap-3 md:grid-cols-3 text-sm mt-4">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-secondary" />
                                <span>Total Crime Rate: {analysisData.crime_data.total_crime_rate?.toFixed(2)}/1,000</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-secondary" />
                                <span>Violent: {analysisData.crime_data.violent_crime_rate?.toFixed(2)}/1,000</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-secondary" />
                                <span>Property: {analysisData.crime_data.property_crime_rate?.toFixed(2)}/1,000</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Crime Comparison Chart */}
                    {analysisData.crime_data.comparison && (
                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading">Crime Rate Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div style={{ height: '400px' }}>
                            <canvas ref={comparisonChartRef}></canvas>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Crime Breakdown */}
                      {analysisData.crime_data.breakdown && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Crime Type Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div style={{ height: '350px' }}>
                              <canvas ref={breakdownChartRef}></canvas>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Crime Trend */}
                      {analysisData.crime_data.trend && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">5-Year Crime Trend</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div style={{ height: '350px' }}>
                              <canvas ref={trendChartRef}></canvas>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Crime Type Tables */}
                    <div className="grid gap-8 md:grid-cols-2">
                      {analysisData.crime_data.violent_types && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Violent Crime Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {analysisData.crime_data.violent_types.map((crime: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-semibold text-foreground">{crime.type}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {crime.incidents} incidents • {crime.rateVsNational} vs national
                                    </p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(crime.risk)}`}>
                                    {crime.risk}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {analysisData.crime_data.property_types && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Property Crime Breakdown</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {analysisData.crime_data.property_types.map((crime: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-semibold text-foreground">{crime.type}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {crime.incidents} incidents • {crime.rateVsNational} vs national
                                    </p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(crime.risk)}`}>
                                    {crime.risk}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Security Recommendations */}
                    <Card className="surface-card bg-primary/5">
                      <CardHeader>
                        <CardTitle className="font-heading">Recommended Security Enhancements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Comprehensive surveillance camera systems at all entry points and parking areas</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Motion-activated LED security lighting in common areas</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Controlled access entry systems with individual tenant codes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Secure, well-lit parking with visible surveillance</span>
                            </li>
                          </ul>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Regular security patrols or private security services consideration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Tenant screening with thorough background checks</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Mandatory renter's insurance requirements in lease agreements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary">✓</span>
                              <span>Increased liability coverage for elevated property crime exposure</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              {/* Market Data Tab */}
              <TabsContent value="market" className="space-y-8">
                {analysisData.market_data && (
                  <>
                    {/* Market Overview */}
                    <Card className="surface-card bg-primary/5 border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <p className="text-lg text-[color:rgba(37,33,30,0.78)]">
                          {analysisData.market_data.summary}
                        </p>
                        <div className="grid gap-6 md:grid-cols-4 mt-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Average Rent</p>
                            <p className="text-3xl font-heading font-semibold text-foreground">
                              ${analysisData.market_data.avg_rent?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                          {analysisData.market_data.yoy_change && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">YoY Change</p>
                              <p className="text-3xl font-heading font-semibold text-primary">
                                +${analysisData.market_data.yoy_change.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {analysisData.market_data.vs_national_avg_percent !== null && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">vs National</p>
                              <p className="text-3xl font-heading font-semibold text-secondary">
                                {analysisData.market_data.vs_national_avg_percent}%
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Market Temp</p>
                            <p className="text-3xl font-heading font-semibold text-foreground">
                              {analysisData.market_data.market_temp || "STABLE"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Rental Rates Chart */}
                      {analysisData.market_data.rental_rates && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Rental Rates by Type</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div style={{ height: '350px' }}>
                              <canvas ref={rentalChartRef}></canvas>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Price Trend Chart */}
                      {analysisData.market_data.price_trend && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Price Trend</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div style={{ height: '350px' }}>
                              <canvas ref={priceTrendChartRef}></canvas>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Rental Distribution and Regional Comparison */}
                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Rental Price Distribution */}
                      {analysisData.market_data.rental_distribution && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Rental Price Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {analysisData.market_data.rental_distribution.map((item: any, idx: number) => (
                                <div key={idx}>
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-semibold text-foreground">{item.range}</span>
                                    <span className="text-primary">{item.percentage}% ({item.count} units)</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Regional Comparison */}
                      {analysisData.market_data.rent_comparison && (
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Regional Rent Comparison</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                              {analysisData.market_data.rent_comparison.map((item: any, idx: number) => (
                                <div key={idx} className="text-center p-4 bg-muted/50 rounded-lg">
                                  <p className="font-semibold text-foreground">{item.city}</p>
                                  <p className="text-2xl font-bold text-primary mt-2">${item.rent}</p>
                                  <p className="text-xs text-muted-foreground mt-1">avg/month</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-8">
                {analysisData.amenities && (
                  <>
                    <Card className="surface-card">
                      <CardContent className="p-6">
                        <p className="text-lg text-[color:rgba(37,33,30,0.78)] mb-6">
                          {analysisData.amenities.summary}
                        </p>
                        <div className="grid gap-6 md:grid-cols-5">
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <UtensilsCrossed className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-2xl font-bold text-foreground">{analysisData.amenities.restaurants || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">Restaurants</p>
                          </div>
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <p className="text-2xl font-bold text-foreground">{analysisData.amenities.shopping_centers || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">Shopping</p>
                          </div>
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <p className="text-2xl font-bold text-foreground">{analysisData.amenities.schools || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">Schools</p>
                          </div>
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <p className="text-2xl font-bold text-foreground">{analysisData.amenities.hospitals || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">Hospitals</p>
                          </div>
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <p className="text-2xl font-bold text-foreground">{analysisData.amenities.parks || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">Parks</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {analysisData.amenities.restaurant_types && (
                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading">Restaurant Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-8 md:grid-cols-2">
                            <div style={{ height: '350px' }}>
                              <canvas ref={restaurantChartRef}></canvas>
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground mb-4">Breakdown</h4>
                              <div className="space-y-3">
                                {analysisData.amenities.restaurant_types.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="font-semibold text-foreground">{item.type}</span>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-primary">{item.count}</p>
                                      <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Economics Tab */}
              <TabsContent value="economics" className="space-y-8">
                {analysisData.economics && (
                  <>
                    <div className="grid gap-8 md:grid-cols-3">
                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading text-lg">Population</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <p className="text-4xl font-heading font-semibold text-primary mb-2">
                              {analysisData.economics.population?.toLocaleString() || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">Total Population</p>
                            {analysisData.economics.population_growth && (
                              <div className="flex items-center justify-center gap-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-primary">{analysisData.economics.population_growth}</span>
                                <span className="text-muted-foreground">growth</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading text-lg">Unemployment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <p className="text-4xl font-heading font-semibold text-primary mb-2">
                              {analysisData.economics.unemployment_rate ? `${analysisData.economics.unemployment_rate}%` : "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">Current Rate</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading text-lg">Median Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <p className="text-4xl font-heading font-semibold text-primary mb-2">
                              {analysisData.economics.median_income ? `$${(analysisData.economics.median_income / 1000).toFixed(0)}K` : "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">Household Income</p>
                            {analysisData.economics.income_growth && (
                              <div className="flex items-center justify-center gap-2 text-sm">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-primary">{analysisData.economics.income_growth}</span>
                                <span className="text-muted-foreground">YoY</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="surface-card">
                      <CardHeader>
                        <CardTitle className="font-heading">Demographics Snapshot</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 md:grid-cols-4">
                          {analysisData.economics.median_age && (
                            <div>
                              <p className="text-3xl font-heading font-semibold text-primary mb-1">
                                {analysisData.economics.median_age}
                              </p>
                              <p className="text-sm text-muted-foreground">Median Age</p>
                            </div>
                          )}
                          {analysisData.economics.education_bachelor_plus && (
                            <div>
                              <p className="text-3xl font-heading font-semibold text-primary mb-1">
                                {analysisData.economics.education_bachelor_plus}%
                              </p>
                              <p className="text-sm text-muted-foreground">Bachelor's Degree+</p>
                            </div>
                          )}
                          {analysisData.economics.homeownership_rate && (
                            <div>
                              <p className="text-3xl font-heading font-semibold text-primary mb-1">
                                {analysisData.economics.homeownership_rate}%
                              </p>
                              <p className="text-sm text-muted-foreground">Homeownership</p>
                            </div>
                          )}
                          {analysisData.economics.employed_residents && (
                            <div>
                              <p className="text-3xl font-heading font-semibold text-primary mb-1">
                                {analysisData.economics.employed_residents.toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">Employed</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {analysisData.economics.key_sectors && (
                      <div className="grid gap-8 md:grid-cols-2">
                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Key Employment Sectors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {analysisData.economics.key_sectors.map((sector: any, idx: number) => (
                                <div key={idx}>
                                  <div className="flex justify-between mb-2">
                                    <span className="text-sm font-semibold flex items-center gap-2">
                                      <Briefcase className="h-4 w-4" />
                                      {sector.sector}
                                    </span>
                                    <span className="text-sm text-primary">{sector.status}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{sector.description}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="surface-card">
                          <CardHeader>
                            <CardTitle className="font-heading">Economic Indicators</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                                <span className="text-sm font-semibold text-foreground">Employment Rate</span>
                                <span className="text-lg font-bold text-primary">
                                  {analysisData.economics.unemployment_rate 
                                    ? `${(100 - analysisData.economics.unemployment_rate).toFixed(1)}%`
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                                <span className="text-sm font-semibold text-foreground">Population Growth</span>
                                <span className="text-lg font-bold text-secondary">
                                  {analysisData.economics.population_growth || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                                <span className="text-sm font-semibold text-foreground">Income Growth</span>
                                <span className="text-lg font-bold text-primary">
                                  {analysisData.economics.income_growth || "N/A"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Investment Tab */}
              <TabsContent value="investment" className="space-y-8">
                {analysisData.investment && (
                  <>
                    <Card className="surface-card bg-primary/5 border-l-4 border-l-primary">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                          {analysisData.investment.recommendation || "Investment Recommendation"}
                        </h3>
                        <p className="text-lg text-[color:rgba(37,33,30,0.78)] mb-6">
                          ROI Potential: {analysisData.investment.roi_potential || "N/A"}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid gap-8 md:grid-cols-2">
                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading text-primary">Key Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {analysisData.investment.key_strengths?.map((strength: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary text-xl">✓</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading text-secondary">Key Risks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {analysisData.investment.key_risks?.map((risk: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-secondary text-xl">⚠</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {analysisData.investment.next_steps && (
                      <Card className="surface-card">
                        <CardHeader>
                          <CardTitle className="font-heading">Next Steps & Due Diligence</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Required Actions</h4>
                              <ol className="space-y-2 text-sm list-decimal list-inside">
                                {analysisData.investment.next_steps.map((step: string, idx: number) => (
                                  <li key={idx} className="text-muted-foreground">{step}</li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">AI-Enhanced Management</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span>Deploy predictive maintenance AI to prevent costly system failures</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span>Computer vision property inspections (quarterly)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span>Intelligent dispatch system for vendor coordination</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span>24/7 resident communication bot for service requests</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary">✓</span>
                                  <span>Revenue optimization engine for dynamic pricing</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="surface-card bg-primary/5">
                      <CardContent className="p-8 text-center">
                        <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                          Projected ROI: {analysisData.investment.roi_potential || "Strong"}
                        </h4>
                        <p className="text-[color:rgba(37,33,30,0.78)] mb-6">
                          With AI-enhanced operations reducing costs by 15-20%, this property offers significant value-add opportunities.
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Link href="/dashboard">
                            <Button className="button-primary">View Portfolio Analytics</Button>
                          </Link>
                          <Link href="/properties">
                            <Button variant="outline" className="rounded-full">
                              Browse More Properties
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Raw Data */}
            <Card className="surface-card mt-12">
              <CardHeader>
                <CardTitle className="font-heading">Raw Analysis Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 max-h-96 overflow-y-auto">
                    {analysisData ? JSON.stringify(analysisData, null, 2) : result}
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
            Powered by Google Gemini AI with Chart.js • Comprehensive Analysis v0.0.8
          </p>
        </div>
      </footer>

      {/* Version Display */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm">
        v0.0.8
      </div>
    </div>
  );
}
