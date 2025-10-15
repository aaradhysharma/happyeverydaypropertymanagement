"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyticsApi } from "@/lib/api";
import { 
  Building2, MapPin, TrendingUp, AlertTriangle, ShieldAlert, 
  UtensilsCrossed, Briefcase, Home, DollarSign, Calendar, ArrowLeft,
  Loader2, RefreshCw 
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// Property data
const property = {
  name: "44 Unit Apartment Building",
  address: "1015-1021 Walnut Street, Yankton, SD 57078",
  price: 2995000,
  pricePerUnit: 68068,
  units: 44,
  capRate: 6.81,
  yearBuilt: 1977,
  hudProperty: true,
  occupancy: 95.5,
};

// Crime data from Perplexity research
const crimeComparison = [
  { category: "Total Crime", yankton: 27.58, national: 22.80, sd: 19.48 },
  { category: "Violent Crime", yankton: 3.52, national: 3.64, sd: 2.84 },
  { category: "Property Crime", yankton: 24.06, national: 19.17, sd: 16.64 },
  { category: "Theft", yankton: 21.05, national: 13.47, sd: 11.96 },
];

const crimeBreakdown = [
  { name: "Theft/Larceny", value: 329, percentage: 76.3, color: "#c8643c" },
  { name: "Aggravated Assault", value: 43, percentage: 10.0, color: "#0f3d35" },
  { name: "Motor Vehicle Theft", value: 35, percentage: 8.1, color: "#7b7b7b" },
  { name: "Burglary", value: 12, percentage: 2.8, color: "#a8a8a8" },
  { name: "Rape", value: 11, percentage: 2.6, color: "#c85050" },
  { name: "Murder", value: 1, percentage: 0.2, color: "#8b0000" },
];

const crimeTrends = [
  { year: "2019", crimes: 389, rate: 26.28 },
  { year: "2020", crimes: 356, rate: 23.89 },
  { year: "2021", crimes: 332, rate: 21.84 },
  { year: "2022", crimes: 360, rate: 23.38 },
  { year: "2023", crimes: 431, rate: 27.60 },
];

const violentCrimeTypes = [
  { type: "Murder", incidents: 1, rateVsNational: "0%", risk: "Low" },
  { type: "Rape", incidents: 11, rateVsNational: "+85.8%", risk: "High" },
  { type: "Robbery", incidents: 0, rateVsNational: "-100%", risk: "Very Low" },
  { type: "Aggravated Assault", incidents: 43, rateVsNational: "+4.5%", risk: "Moderate" },
];

const propertyCrimeTypes = [
  { type: "Theft/Larceny", incidents: 329, rateVsNational: "+56.2%", risk: "Very High" },
  { type: "Motor Vehicle Theft", incidents: 35, rateVsNational: "-29.8%", risk: "Low" },
  { type: "Burglary", incidents: 12, rateVsNational: "-69.3%", risk: "Low" },
];

const restaurantData = [
  { type: "American", count: 26, percentage: 39.4 },
  { type: "Fast Food/Chains", count: 17, percentage: 25.8 },
  { type: "Bars/Pubs", count: 8, percentage: 12.1 },
  { type: "Asian", count: 7, percentage: 10.6 },
  { type: "Mexican", count: 5, percentage: 7.6 },
  { type: "Other", count: 3, percentage: 4.5 },
];

const rentalComparison = [
  { city: "Yankton", rent: 1082 },
  { city: "Rapid City", rent: 1310 },
  { city: "Sioux Falls", rent: 1109 },
  { city: "Mitchell", rent: 1145 },
  { city: "Aberdeen", rent: 1052 },
];

// NEW DATA from web scraping (Oct 2025)
const rentalByBedroom = [
  { type: "Studio", rent: 923, sqft: 430 },
  { type: "1 Bedroom", rent: 864, sqft: 616 },
  { type: "2 Bedroom", rent: 1088, sqft: 849 },
  { type: "3 Bedroom", rent: 1174, sqft: 1153 },
];

const rentalPriceDistribution = [
  { range: "Below $700", percentage: 33, count: 2 },
  { range: "$700-$1,000", percentage: 0, count: 0 },
  { range: "$1,001-$1,500", percentage: 67, count: 4 },
  { range: "$1,501-$2,000", percentage: 0, count: 0 },
  { range: "Above $2,000", percentage: 0, count: 0 },
];

const rentYearOverYear = [
  { month: "Jan", year2024: 520, year2025: 520 },
  { month: "Feb", year2024: 520, year2025: 1050 },
  { month: "Mar", year2024: 1150, year2025: 950 },
  { month: "Apr", year2024: 520, year2025: 900 },
  { month: "May", year2024: 2200, year2025: 900 },
  { month: "Jun", year2024: 925, year2025: 925 },
  { month: "Jul", year2024: 1500, year2025: 1050 },
  { month: "Aug", year2024: 2200, year2025: 2400 },
  { month: "Sep", year2024: 520, year2025: 1800 },
  { month: "Oct", year2024: 865, year2025: 1082 },
];

const marketMetrics = {
  avgRent: 1082,
  yoyChange: 562,
  vsNationalAvg: -47, // percentage
  nationalAvg: 2023,
  marketTemp: "COOL", // COOL, WARM, HOT
  availableRentals: 6,
  minRent: 388,
  maxRent: 2400,
};

const COLORS = ["#0f3d35", "#c8643c", "#4a7c7e", "#d4976c", "#2c5f5f", "#999999"];

type MarketSnapshot = {
  fetched_at: string;
  source: string;
  source_url?: string;
  listing_price?: number | null;
  rent_estimate?: number | null;
  price_per_sqft?: number | null;
  confidence_score?: number | null;
  beds?: number | null;
  baths?: number | null;
  square_feet?: number | null;
  comparables?: Array<{
    title: string;
    url: string;
    price?: number | null;
    beds?: number | null;
    baths?: number | null;
    square_feet?: number | null;
  }>;
};

const PROPERTY_ID = 1;

const formatCurrency = (value?: number | null) =>
  value != null ? `$${Number(value).toLocaleString()}` : "—";

const formatPercent = (value?: number | null) =>
  value != null ? `${(Number(value) * 100).toFixed(0)}%` : "—";

export default function YanktonPropertyReport() {
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  const { data: marketSnapshot, isFetching: marketSnapshotFetching } = useQuery<MarketSnapshot | null>({
    queryKey: ["market-data", PROPERTY_ID],
    queryFn: async () => {
      try {
        const response = await analyticsApi.getLatestMarketData(PROPERTY_ID);
        return response.data as MarketSnapshot;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const refreshMarketDataMutation = useMutation({
    mutationFn: analyticsApi.refreshMarketData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["market-data", PROPERTY_ID] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/properties">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <p className="eyebrow mb-1">Property Analysis Report</p>
              <h1 className="text-xl font-heading text-foreground">Yankton, SD Investment</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="button-primary">Dashboard</Button>
            </Link>
            <Button
              onClick={() => refreshMarketDataMutation.mutate()}
              disabled={refreshMarketDataMutation.isPending}
              className="rounded-full bg-secondary/10 px-5 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/20"
            >
              {refreshMarketDataMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {refreshMarketDataMutation.isPending ? "Updating market" : "Update market data"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Property Header */}
        <div className="mb-12 grid gap-8 md:grid-cols-[1fr_0.4fr]">
          <div>
            <div className="mb-4">
              <h2 className="text-4xl font-heading font-semibold text-foreground mb-2">
                {property.name}
              </h2>
              <p className="flex items-center gap-2 text-lg text-muted-foreground">
                <MapPin className="h-5 w-5" />
                {property.address}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Purchase Price</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    ${(property.price / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">${property.pricePerUnit.toLocaleString()}/unit</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Cap Rate</p>
                  <p className="text-2xl font-heading font-semibold text-primary">
                    {property.capRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Above market avg</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Units</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    {property.units}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Built {property.yearBuilt}</p>
                </CardContent>
              </Card>
              <Card className="surface-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">Occupancy</p>
                  <p className="text-2xl font-heading font-semibold text-primary">
                    {property.occupancy}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">HUD Property</p>
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
                    <span>Cap Rate</span>
                    <span className="font-semibold text-primary">9/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Market Stability</span>
                    <span className="font-semibold text-primary">8/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Crime Safety</span>
                    <span className="font-semibold text-secondary">6/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Score</span>
                    <span className="font-semibold text-primary">7.7/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "77%" }} />
                  </div>
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
            <TabsTrigger value="restaurants" className="rounded-full">Dining/Retail</TabsTrigger>
            <TabsTrigger value="economics" className="rounded-full">Economics</TabsTrigger>
            <TabsTrigger value="recommendation" className="rounded-full">Recommendation</TabsTrigger>
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
                      Crime Risk Assessment: MODERATE (3.0/5.0)
                    </h3>
                    <p className="text-[color:rgba(37,33,30,0.78)] mb-3">
                      Yankton experiences elevated crime rates primarily driven by property crimes (theft/larceny). Total crime rate of 27.58 
                      per 1,000 residents is 21% above national average. Enhanced security measures recommended.
                    </p>
                    <div className="grid gap-3 md:grid-cols-3 text-sm">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-secondary" />
                        <span>1 in 36 chance of crime victimization annually</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-secondary" />
                        <span>29.6% year-over-year crime increase (2022-2023)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-secondary" />
                        <span>Theft rate 56% above national average</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crime Comparison Chart */}
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Crime Rate Comparison (per 1,000 residents)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="yankton" fill="#c8643c" name="Yankton" />
                    <Bar dataKey="national" fill="#0f3d35" name="National Avg" />
                    <Bar dataKey="sd" fill="#7b7b7b" name="South Dakota Avg" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Crime Breakdown Pie Chart */}
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Crime Type Distribution (2023)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={crimeBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {crimeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Total: 431 crimes in 2023 (76.3% are theft/larceny)
                  </p>
                </CardContent>
              </Card>

              {/* Crime Trends Line Chart */}
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">5-Year Crime Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={crimeTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="crimes" stroke="#c8643c" strokeWidth={3} name="Total Crimes" />
                      <Line type="monotone" dataKey="rate" stroke="#0f3d35" strokeWidth={3} name="Rate per 1K" />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-center mt-4">
                    <span className="font-semibold text-secondary">⚠️ +19.7% increase</span> from 2022 to 2023
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Crime Type Tables */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Violent Crime Breakdown (2023)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {violentCrimeTypes.map((crime) => (
                      <div key={crime.type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{crime.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {crime.incidents} incidents • {crime.rateVsNational} vs national
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          crime.risk === "High" ? "bg-red-100 text-red-700" :
                          crime.risk === "Moderate" ? "bg-yellow-100 text-yellow-700" :
                          crime.risk === "Low" ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {crime.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Total violent crimes: 55 (3.52 per 1,000) - Slightly below national average
                  </p>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Property Crime Breakdown (2023)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {propertyCrimeTypes.map((crime) => (
                      <div key={crime.type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{crime.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {crime.incidents} incidents • {crime.rateVsNational} vs national
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          crime.risk === "Very High" ? "bg-red-100 text-red-700" :
                          crime.risk === "High" ? "bg-orange-100 text-orange-700" :
                          crime.risk === "Moderate" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {crime.risk}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Total property crimes: 376 (24.06 per 1,000) - 25.5% above national average
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Security Recommendations */}
            <Card className="surface-card bg-primary/5">
              <CardHeader>
                <CardTitle className="font-heading">Required Security Enhancements</CardTitle>
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
          </TabsContent>

          {/* Market Data Tab */}
          <TabsContent value="market" className="space-y-8">
            {marketSnapshotFetching && (
              <Card className="surface-card border border-border/70">
                <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching live market snapshot...
                </CardContent>
              </Card>
            )}

            {marketSnapshot && (
              <Card className="surface-card border border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="eyebrow text-secondary">Live market snapshot</p>
                      <h3 className="text-2xl font-heading text-foreground">
                        Updated {new Date(marketSnapshot.fetched_at).toLocaleString()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Source: {marketSnapshot.source}
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl bg-background/90 p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground">Listing price</p>
                        <p className="mt-1 text-xl font-semibold text-foreground">{formatCurrency(marketSnapshot.listing_price)}</p>
                      </div>
                      <div className="rounded-xl bg-background/90 p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground">Rent estimate</p>
                        <p className="mt-1 text-xl font-semibold text-foreground">{formatCurrency(marketSnapshot.rent_estimate)}</p>
                      </div>
                      <div className="rounded-xl bg-background/90 p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground">Price per sqft</p>
                        <p className="mt-1 text-xl font-semibold text-foreground">
                          {marketSnapshot.price_per_sqft != null
                            ? `$${Number(marketSnapshot.price_per_sqft).toFixed(0)}`
                            : "—"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-background/90 p-4 shadow-sm">
                        <p className="text-xs text-muted-foreground">Confidence score</p>
                        <p className="mt-1 text-xl font-semibold text-foreground">
                          {formatPercent(marketSnapshot.confidence_score)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {marketSnapshot.comparables && marketSnapshot.comparables.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-muted-foreground mb-3">Top comparable listings</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        {marketSnapshot.comparables.slice(0, 3).map((comp) => (
                          <a
                            key={comp.url}
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-2xl border border-border/60 bg-background/80 p-4 transition-all hover:border-primary/60 hover:bg-primary/5"
                          >
                            <p className="text-sm font-semibold text-primary">{comp.title}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {comp.price != null && <span className="font-semibold text-foreground">{formatCurrency(comp.price)}</span>}
                              {comp.beds != null && <span>{comp.beds} bd</span>}
                              {comp.baths != null && <span>{comp.baths} ba</span>}
                              {comp.square_feet != null && <span>{comp.square_feet.toLocaleString()} sqft</span>}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!marketSnapshot && !marketSnapshotFetching && (
              <Card className="surface-card border border-border/70">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">No live snapshot yet</p>
                    <p className="text-xs text-muted-foreground">
                      Trigger an update to fetch the latest market intelligence for this property.
                    </p>
                  </div>
                  <Button
                    onClick={() => refreshMarketDataMutation.mutate()}
                    disabled={refreshMarketDataMutation.isPending}
                    className="rounded-full bg-secondary/10 px-5 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/20"
                  >
                    {refreshMarketDataMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    {refreshMarketDataMutation.isPending ? "Updating..." : "Fetch market data"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Market Overview Banner */}
            <Card className="surface-card bg-primary/5 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Rent</p>
                    <p className="text-3xl font-heading font-semibold text-foreground">${marketMetrics.avgRent}</p>
                    <p className="text-xs text-muted-foreground mt-1">October 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">YoY Change</p>
                    <p className="text-3xl font-heading font-semibold text-primary">+${marketMetrics.yoyChange}</p>
                    <p className="text-xs text-muted-foreground mt-1">vs last year</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">vs National</p>
                    <p className="text-3xl font-heading font-semibold text-secondary">{marketMetrics.vsNationalAvg}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Lower than avg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Market Temp</p>
                    <p className="text-3xl font-heading font-semibold text-foreground">{marketMetrics.marketTemp}</p>
                    <p className="text-xs text-muted-foreground mt-1">Stable demand</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Rates by Bedroom Type */}
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Rental Rates by Bedroom Type (Oct 2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rentalByBedroom}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" orientation="left" stroke="#0f3d35" />
                    <YAxis yAxisId="right" orientation="right" stroke="#c8643c" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="rent" fill="#0f3d35" name="Avg Rent ($)" />
                    <Bar yAxisId="right" dataKey="sqft" fill="#c8643c" name="Avg Sq Ft" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                  {rentalByBedroom.map((item) => (
                    <div key={item.type} className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="font-semibold text-foreground">{item.type}</p>
                      <p className="text-primary font-semibold">${item.rent}/mo</p>
                      <p className="text-xs text-muted-foreground">{item.sqft} sq ft</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Year-over-Year Rental Trends */}
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Year-over-Year Rental Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rentYearOverYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="year2024" stroke="#c8643c" strokeWidth={3} name="2024" />
                    <Line type="monotone" dataKey="year2025" stroke="#0f3d35" strokeWidth={3} name="2025" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-muted-foreground mb-1">Average YoY Increase</p>
                    <p className="text-2xl font-heading font-semibold text-primary">+$562</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/5 rounded-lg">
                    <p className="text-muted-foreground mb-1">Price Range</p>
                    <p className="text-xl font-heading font-semibold text-foreground">${marketMetrics.minRent}-${marketMetrics.maxRent}</p>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-muted-foreground mb-1">Available Units</p>
                    <p className="text-2xl font-heading font-semibold text-foreground">{marketMetrics.availableRentals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental Price Distribution */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Rental Price Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={rentalPriceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="range" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#0f3d35" name="Percentage (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-center mt-4">
                    <span className="font-semibold text-primary">67%</span> of rentals fall in the $1,001-$1,500 range
                  </p>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Regional Rental Rate Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={rentalComparison} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis type="number" />
                      <YAxis dataKey="city" type="category" />
                      <Tooltip />
                      <Bar dataKey="rent" fill="#0f3d35" name="Avg Monthly Rent" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-4">
                    Yankton's $1,082 average rent is competitive in the South Dakota market
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Population Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-heading font-semibold text-primary mb-2">15,765</p>
                    <p className="text-sm text-muted-foreground mb-4">2025 Population</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">+2.19%</span>
                      <span className="text-muted-foreground">since 2020</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Unemployment Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-4xl font-heading font-semibold text-primary mb-2">1.7%</p>
                    <p className="text-sm text-muted-foreground mb-4">January 2025</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="font-semibold text-primary">Below</span>
                      <span className="text-muted-foreground">national average</span>
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
                    <p className="text-4xl font-heading font-semibold text-primary mb-2">$69K</p>
                    <p className="text-sm text-muted-foreground mb-4">Household Income</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">+14.8%</span>
                      <span className="text-muted-foreground">YoY growth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants" className="space-y-8">
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Restaurant Distribution in Yankton</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 md:grid-cols-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={restaurantData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percentage }) => `${type}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {restaurantData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Market Analysis</h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-semibold text-foreground mb-1">Total Establishments: 66</p>
                        <p className="text-muted-foreground">4.19 restaurants per 1,000 residents</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Market Gap Identified</p>
                        <p className="text-muted-foreground">
                          Residents consistently cite limited quality dining options. Opportunity for authentic ethnic cuisines, BBQ, and upscale dining.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">Dominant Categories</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>American cuisine: 39.4% market share</li>
                          <li>Fast food/chains dominate: 25.8%</li>
                          <li>Limited ethnic diversity in offerings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-card bg-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-secondary/10 p-3">
                    <UtensilsCrossed className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Resident Feedback</h4>
                    <p className="text-sm text-[color:rgba(37,33,30,0.78)]">
                      Local feedback describes Yankton as having "limited quality dining options" with one resident calling it
                      "the worst example of a food desert." This presents opportunities for restaurant entrepreneurs and 
                      may affect tenant retention for residents seeking diverse dining experiences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Economics Tab */}
          <TabsContent value="economics" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Key Employment Sectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">Healthcare</span>
                        <span className="text-sm text-primary">Major Growth Driver</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Avera Sacred Heart Hospital expansion driving employment growth
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">Manufacturing</span>
                        <span className="text-sm text-primary">Stable</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Agriculture and construction machinery production
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">Government</span>
                        <span className="text-sm text-primary">Stable</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        County seat status provides employment stability
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">Food Service</span>
                        <span className="text-sm text-secondary">Largest Sector</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Largest employment sector by establishment count
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading">Infrastructure & Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-foreground mb-2">Transportation</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• US Highway 81 access</li>
                        <li>• SD Highway 50 regional connectivity</li>
                        <li>• Major highway reconstruction 2025-2026</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Utilities</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• NorthWestern Energy (electric)</li>
                        <li>• MidAmerican Energy (gas)</li>
                        <li>• Municipal water/sewer</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Economic Development</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Napa Junction Rail Industrial Park ($7.25M TIF)</li>
                        <li>• Active industrial diversification</li>
                        <li>• Yankton Area Progressive Growth org</li>
                      </ul>
                    </div>
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
                  <div>
                    <p className="text-3xl font-heading font-semibold text-primary mb-1">41.8</p>
                    <p className="text-sm text-muted-foreground">Median Age</p>
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-semibold text-primary mb-1">30.7%</p>
                    <p className="text-sm text-muted-foreground">Bachelor's Degree+</p>
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-semibold text-primary mb-1">67%</p>
                    <p className="text-sm text-muted-foreground">Homeownership Rate</p>
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-semibold text-primary mb-1">11,944</p>
                    <p className="text-sm text-muted-foreground">Employed Residents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendation Tab */}
          <TabsContent value="recommendation" className="space-y-8">
            <Card className="surface-card bg-primary/5 border-l-4 border-l-primary">
              <CardContent className="p-8">
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  Investment Recommendation: SOLID BUY with Conditions
                </h3>
                <p className="text-lg text-[color:rgba(37,33,30,0.78)] mb-6">
                  The 44-unit Yankton apartment complex represents a solid investment opportunity with several compelling attributes.
                  With proper due diligence on property condition and local management capabilities, this investment aligns well with 
                  conservative real estate strategies seeking stable cash flow in growing secondary markets.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-primary">Primary Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Above-Market Cap Rate</p>
                        <p className="text-sm text-muted-foreground">6.81% vs 6.2-6.7% regional average indicates strong returns potential</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Stable, Growing Market</p>
                        <p className="text-sm text-muted-foreground">2.19% population growth since 2020 with favorable demographics</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Strong Rental Demand</p>
                        <p className="text-sm text-muted-foreground">Premium pricing of $1,248 avg rent, above most SD markets</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Excellent Economic Fundamentals</p>
                        <p className="text-sm text-muted-foreground">1.7% unemployment, well below national average</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary text-xl">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Tax-Advantaged</p>
                        <p className="text-sm text-muted-foreground">South Dakota has no state capital gains tax</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="surface-card">
                <CardHeader>
                  <CardTitle className="font-heading text-secondary">Key Considerations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary text-xl">⚠</span>
                      <div>
                        <p className="font-semibold text-foreground">Property Age</p>
                        <p className="text-sm text-muted-foreground">1977 construction may require capital improvements and deferred maintenance assessment</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary text-xl">⚠</span>
                      <div>
                        <p className="font-semibold text-foreground">Elevated Crime Rates</p>
                        <p className="text-sm text-muted-foreground">Property crime 25.5% above national average requires security enhancements</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary text-xl">⚠</span>
                      <div>
                        <p className="font-semibold text-foreground">Limited Amenities</p>
                        <p className="text-sm text-muted-foreground">Dining/entertainment options may affect tenant retention</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary text-xl">⚠</span>
                      <div>
                        <p className="font-semibold text-foreground">Small Market Size</p>
                        <p className="text-sm text-muted-foreground">Limits diversification options within single market</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary text-xl">⚠</span>
                      <div>
                        <p className="font-semibold text-foreground">HUD Property Compliance</p>
                        <p className="text-sm text-muted-foreground">May have additional regulatory requirements</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="font-heading">Next Steps & Due Diligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Required Actions</h4>
                    <ol className="space-y-2 text-sm list-decimal list-inside">
                      <li>Comprehensive property inspection (focus on 1977 systems)</li>
                      <li>Review rent roll and tenant lease terms</li>
                      <li>Analyze historical maintenance costs</li>
                      <li>Obtain insurance quotes with elevated crime risk disclosure</li>
                      <li>Review HUD compliance requirements and restrictions</li>
                      <li>Assess capital improvement needs and budget</li>
                      <li>Evaluate local property management options</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">AI-Enhanced Management Plan</h4>
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
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Real-time compliance monitoring for HUD requirements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-card bg-primary/5">
              <CardContent className="p-8 text-center">
                <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                  Projected First-Year ROI: 6.81% Cash-on-Cash
                </h4>
                <p className="text-[color:rgba(37,33,30,0.78)] mb-6">
                  With AI-enhanced operations reducing costs by 15-20%, projected ROI could exceed 8% in year two.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="button-primary">View Portfolio Analytics</Button>
                  </Link>
                  <Link href="/#contact">
                    <Button variant="outline" className="rounded-full">
                      Schedule Consultation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-background/80 mt-20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">
            © 2026 Happy Everyday Property Management. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Data sources: FBI UCR, SD AG, NeighborhoodScout, Apartments.com, Zillow (Real-time web scraping via Firecrawl AI)
          </p>
        </div>
      </footer>
    </div>
  );
}

