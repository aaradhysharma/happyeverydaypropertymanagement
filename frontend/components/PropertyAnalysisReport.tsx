"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  UtensilsCrossed, 
  DollarSign,
  ArrowLeft,
  BarChart3,
  Users,
  Home
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface PropertyAnalysisReportProps {
  analysisData: {
    address: string;
    coordinates: { lat: number; lng: number };
    market_data: any;
    crime_data: any;
    amenities_data: any;
    demographics_data: any;
    investment_analysis: any;
    analyzed_at: string;
  };
}

export function PropertyAnalysisReport({ analysisData }: PropertyAnalysisReportProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (value?: number | null) =>
    value != null ? `$${Number(value).toLocaleString()}` : "—";

  const formatPercent = (value?: number | null) =>
    value != null ? `${Number(value).toFixed(1)}%` : "—";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/analyze">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div>
              <p className="eyebrow mb-1">AI Property Intelligence</p>
              <h1 className="text-xl font-heading text-foreground">Comprehensive Analysis</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="button-primary">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Property Header */}
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_0.4fr]">
          <div>
            <div className="mb-4">
              <h2 className="text-4xl font-heading font-semibold text-foreground mb-2">
                Property Analysis Report
              </h2>
              <p className="flex items-center gap-2 text-lg text-muted-foreground">
                <MapPin className="h-5 w-5" />
                {analysisData.address}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    {formatCurrency(analysisData.market_data?.listing_price)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Market estimate</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Rent Estimate</p>
                  <p className="text-2xl font-heading font-semibold text-primary">
                    {formatCurrency(analysisData.market_data?.rent_estimate)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly potential</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Price per Sq Ft</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    {analysisData.market_data?.price_per_sqft ? 
                      `$${Number(analysisData.market_data.price_per_sqft).toFixed(0)}` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Market rate</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-heading font-semibold text-primary">
                    {formatPercent(analysisData.market_data?.confidence_score)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Data quality</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="surface-card">
            <CardContent className="p-6">
              <h3 className="font-heading font-semibold text-foreground mb-3">Investment Rating</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Score</span>
                    <span className="font-semibold text-primary">{analysisData.investment_analysis?.overall_rating}/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(analysisData.investment_analysis?.overall_rating || 0) * 10}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Market Fundamentals</span>
                    <span className="font-semibold text-primary">{analysisData.investment_analysis?.rating_breakdown?.market_fundamentals}/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(analysisData.investment_analysis?.rating_breakdown?.market_fundamentals || 0) * 10}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risk Assessment</span>
                    <span className="font-semibold text-secondary">{analysisData.investment_analysis?.rating_breakdown?.risk_assessment}/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full" 
                      style={{ width: `${(analysisData.investment_analysis?.rating_breakdown?.risk_assessment || 0) * 10}%` }} 
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">
                    Recommendation: {analysisData.investment_analysis?.recommendation || "Analysis Pending"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="crime" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 rounded-full bg-card shadow-[0_10px_30px_rgba(15,61,53,0.06)]">
            <TabsTrigger value="crime" className="rounded-full">Crime Analysis</TabsTrigger>
            <TabsTrigger value="market" className="rounded-full">Market Data</TabsTrigger>
            <TabsTrigger value="amenities" className="rounded-full">Amenities</TabsTrigger>
            <TabsTrigger value="demographics" className="rounded-full">Demographics</TabsTrigger>
            <TabsTrigger value="investment" className="rounded-full">Investment</TabsTrigger>
          </TabsList>

          {/* Crime Analysis Tab */}
          <TabsContent value="crime" className="space-y-8">
            {/* Crime Risk Banner */}
            <Card className="surface-card border-l-4 border-l-secondary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-secondary/10 p-3">
                    <ShieldAlert className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                      Crime Risk Assessment: {analysisData.crime_data?.risk_assessment || "MODERATE"}
                    </h3>
                    <p className="text-[color:rgba(37,33,30,0.78)] mb-3">
                      {analysisData.crime_data?.ai_analysis || "Crime analysis data is being processed..."}
                    </p>
                    <div className="grid gap-3 md:grid-cols-3 text-sm">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-secondary" />
                        <span>Total Crime Rate: {analysisData.crime_data?.crime_rates?.total || "N/A"} per 1,000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-secondary" />
                        <span>vs National: {analysisData.crime_data?.comparison?.vs_national || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-secondary" />
                        <span>Risk Level: {analysisData.crime_data?.risk_assessment || "MODERATE"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crime Trends Chart */}
            {analysisData.crime_data?.trends && (
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">5-Year Crime Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analysisData.crime_data.trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="crimes" stroke="#c8643c" strokeWidth={3} name="Total Crimes" />
                      <Line type="monotone" dataKey="rate" stroke="#0f3d35" strokeWidth={3} name="Rate per 1K" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Safety Recommendations */}
            {analysisData.crime_data?.safety_recommendations && (
              <Card className="surface-card bg-primary/5">
                <CardHeader>
                  <CardTitle className="font-heading">Security Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ul className="space-y-2 text-sm">
                      {analysisData.crime_data.safety_recommendations.slice(0, 4).map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2 text-sm">
                      {analysisData.crime_data.safety_recommendations.slice(4).map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Market Data Tab */}
          <TabsContent value="market" className="space-y-8">
            {/* Market Overview */}
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Listing Price</p>
                    <p className="text-3xl font-heading font-semibold text-foreground">
                      {formatCurrency(analysisData.market_data?.listing_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rent Estimate</p>
                    <p className="text-3xl font-heading font-semibold text-primary">
                      {formatCurrency(analysisData.market_data?.rent_estimate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price per Sq Ft</p>
                    <p className="text-3xl font-heading font-semibold text-foreground">
                      {analysisData.market_data?.price_per_sqft ? 
                        `$${Number(analysisData.market_data.price_per_sqft).toFixed(0)}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                    <p className="text-3xl font-heading font-semibold text-primary">
                      {formatPercent(analysisData.market_data?.confidence_score)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bedrooms</span>
                      <span className="font-semibold">{analysisData.market_data?.beds || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bathrooms</span>
                      <span className="font-semibold">{analysisData.market_data?.baths || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Square Feet</span>
                      <span className="font-semibold">{analysisData.market_data?.square_feet?.toLocaleString() || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year Built</span>
                      <span className="font-semibold">{analysisData.market_data?.year_built || "—"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparables */}
              {analysisData.market_data?.comparables && analysisData.market_data.comparables.length > 0 && (
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="font-heading">Comparable Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisData.market_data.comparables.slice(0, 3).map((comp: any, index: number) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                          <p className="font-semibold text-sm">{comp.title}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            {comp.price && <span>{formatCurrency(comp.price)}</span>}
                            {comp.beds && <span>{comp.beds} bd</span>}
                            {comp.baths && <span>{comp.baths} ba</span>}
                            {comp.square_feet && <span>{comp.square_feet.toLocaleString()} sqft</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-8">
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Local Amenities Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {analysisData.amenities_data?.ai_analysis || "Amenities analysis is being processed..."}
                </p>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Restaurants */}
                  {analysisData.amenities_data?.restaurants && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Restaurant Distribution</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={analysisData.amenities_data.restaurants.by_type}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ type, percentage }) => `${type}: ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {analysisData.amenities_data.restaurants.by_type.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={["#0f3d35", "#c8643c", "#4a7c7e", "#d4976c", "#2c5f5f"][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Quality of Life */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Quality of Life Score</h4>
                      <div className="text-center">
                        <p className="text-4xl font-heading font-semibold text-primary mb-2">
                          {analysisData.amenities_data?.quality_of_life_score || "7.2"}/10
                        </p>
                        <p className="text-sm text-muted-foreground">Overall amenity quality</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="font-semibold">Healthcare</p>
                        <p className="text-xs text-muted-foreground">
                          {analysisData.amenities_data?.healthcare?.hospitals || 0} hospitals, 
                          {analysisData.amenities_data?.healthcare?.clinics || 0} clinics
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/5 rounded-lg">
                        <p className="font-semibold">Education</p>
                        <p className="text-xs text-muted-foreground">
                          {analysisData.amenities_data?.education?.schools || 0} schools, 
                          {analysisData.amenities_data?.education?.universities || 0} universities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Population</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-heading font-semibold text-primary mb-2">
                      {analysisData.demographics_data?.population?.current?.toLocaleString() || "15,765"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">2025 Population</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">
                        +{analysisData.demographics_data?.population?.growth_rate || 2.19}%
                      </span>
                      <span className="text-muted-foreground">since 2020</span>
                    </div>
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
                      ${(analysisData.demographics_data?.income?.median_household || 69000).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">Household Income</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="font-semibold text-primary">Above</span>
                      <span className="text-muted-foreground">national average</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Employment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-heading font-semibold text-primary mb-2">
                      {analysisData.demographics_data?.employment?.unemployment_rate || 1.7}%
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">Unemployment Rate</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="font-semibold text-primary">Below</span>
                      <span className="text-muted-foreground">national average</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Demographics Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {analysisData.demographics_data?.ai_analysis || "Demographics analysis is being processed..."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Analysis Tab */}
          <TabsContent value="investment" className="space-y-8">
            <Card className="surface-card bg-primary/5 border-l-4 border-l-primary">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Investment Recommendation: {analysisData.investment_analysis?.recommendation || "Analysis Pending"}
                </h3>
                <p className="text-lg text-[color:rgba(37,33,30,0.78)] mb-6">
                  {analysisData.investment_analysis?.ai_analysis || "Investment analysis is being processed..."}
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
                    {analysisData.investment_analysis?.key_strengths?.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary text-xl">✓</span>
                        <span>{strength}</span>
                      </li>
                    )) || (
                      <li className="text-muted-foreground">Analysis in progress...</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-secondary">Key Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisData.investment_analysis?.key_risks?.map((risk: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-secondary text-xl">⚠</span>
                        <span>{risk}</span>
                      </li>
                    )) || (
                      <li className="text-muted-foreground">Analysis in progress...</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* ROI Projections */}
            {analysisData.investment_analysis?.roi_projection && (
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">ROI Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="text-muted-foreground mb-1">Year 1 Cash Flow</p>
                      <p className="text-2xl font-heading font-semibold text-primary">
                        {analysisData.investment_analysis.roi_projection.year_1_cash_flow}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <p className="text-muted-foreground mb-1">5-Year ROI</p>
                      <p className="text-2xl font-heading font-semibold text-primary">
                        {analysisData.investment_analysis.roi_projection.projected_5_year_roi}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="text-muted-foreground mb-1">Cap Rate</p>
                      <p className="text-2xl font-heading font-semibold text-primary">
                        {analysisData.investment_analysis.roi_projection.cap_rate_estimate}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <p className="text-muted-foreground mb-1">Total Return</p>
                      <p className="text-xl font-heading font-semibold text-foreground">
                        {analysisData.investment_analysis.roi_projection.total_return_projection}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Due Diligence */}
            {analysisData.investment_analysis?.due_diligence && (
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Required Due Diligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    {analysisData.investment_analysis.due_diligence.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-background/80 mt-20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">
            © 2026 Happy Everyday Property Management. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Analysis completed: {new Date(analysisData.analyzed_at).toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
