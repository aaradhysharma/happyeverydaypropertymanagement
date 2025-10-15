"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";
import { KPICards } from "@/components/analytics/KPICards";
import { CashFlowChart } from "@/components/analytics/CashFlowChart";
import { OccupancyChart } from "@/components/analytics/OccupancyChart";
import { MaintenanceStats } from "@/components/analytics/MaintenanceStats";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, RefreshCw, ImageIcon, Users, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Mock data for demo purposes until backend is deployed
const mockDashboardData = {
  occupancy: {
    occupancy_rate: 94.2,
    occupied_units: 200,
    total_units: 212,
    target_min: 85,
    target_max: 95,
    status: 'good',
  },
  noi: {
    net_operating_income: 2847000,
    gross_revenue: 4125000,
    operating_expenses: 1278000,
    noi_margin: 69.0,
  },
  cash_flow: {
    net_cash_flow: 1235000,
    total_income: 4125000,
    total_expenses: 2890000,
    average_monthly_cash_flow: 102916,
  },
  tenant_retention: {
    retention_rate: 87.3,
    renewed_leases: 48,
    expiring_leases: 55,
    status: 'excellent',
  },
  maintenance_costs: {
    total_cost: 42500,
    cost_per_unit: 200.47,
    average_response_time: 1.8,
  },
  revenue_trend: [
    { month: 'Jan', revenue: 185000, expenses: 92000 },
    { month: 'Feb', revenue: 192000, expenses: 95000 },
    { month: 'Mar', revenue: 198000, expenses: 97000 },
    { month: 'Apr', revenue: 205000, expenses: 99000 },
    { month: 'May', revenue: 212000, expenses: 101000 },
    { month: 'Jun', revenue: 218000, expenses: 103000 },
  ],
  occupancy_trend: [
    { month: 'Jan', rate: 92.1 },
    { month: 'Feb', rate: 93.4 },
    { month: 'Mar', rate: 93.8 },
    { month: 'Apr', rate: 94.2 },
    { month: 'May', rate: 94.5 },
    { month: 'Jun', rate: 94.2 },
  ],
};

export default function DashboardPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data = mockDashboardData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        const response = await analyticsApi.getDashboard(selectedPropertyId);
        return response.data;
      } catch (err) {
        console.log('API unavailable, using mock data for demo');
        return mockDashboardData;
      }
    },
    retry: false,
    refetchInterval: false,
    staleTime: Infinity,
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const response = await analyticsApi.getProperties();
        return response.data.properties as Array<{ id: number; name: string; city: string; state: string }>;
      } catch (err) {
        return [];
      }
    },
  });

  const { data: marketData, isFetching: marketFetching } = useQuery({
    queryKey: ['market-data', selectedPropertyId],
    enabled: !!selectedPropertyId,
    queryFn: async () => {
      if (!selectedPropertyId) return null;
      const response = await analyticsApi.getLatestMarketData(selectedPropertyId);
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });

  const refreshMarketDataMutation = useMutation({
    mutationFn: analyticsApi.refreshMarketData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-data', selectedPropertyId] });
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="eyebrow mb-1">Happy Everyday</p>
              <h1 className="text-xl font-heading text-foreground">Operations Command Center</h1>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent">
                Home
              </Button>
            </Link>
            <Link href="/inspections">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent">
                <ImageIcon className="mr-2 h-4 w-4" />
                Inspections
              </Button>
            </Link>
            <Link href="/providers">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent">
                <Users className="mr-2 h-4 w-4" />
                Providers
              </Button>
            </Link>
            <Link href="/">
              <Button className="button-primary">Owner portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-[rgba(15,61,53,0.04)]">
        <div className="container mx-auto px-6 py-10">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="eyebrow">Live performance</p>
              <h2 className="text-4xl font-heading text-foreground">Portfolio analytics at a glance.</h2>
              <p className="max-w-2xl text-[color:rgba(37,33,30,0.78)]">
                Review occupancy, financial posture, and operational health in real time. Export reports or drill into any community from one
                centralized dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {propertiesData && propertiesData.length > 0 && (
                <select
                  value={selectedPropertyId ?? ""}
                  onChange={(event) => setSelectedPropertyId(Number(event.target.value) || undefined)}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm"
                >
                  <option value="">All properties</option>
                  {propertiesData.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} – {property.city}, {property.state}
                    </option>
                  ))}
                </select>
              )}
              <Button
                onClick={() => refetch()}
                disabled={isFetching}
                className="rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                {isFetching ? "Syncing..." : "Refresh data"}
              </Button>
              <Button
                onClick={() => refreshMarketDataMutation.mutate()}
                disabled={refreshMarketDataMutation.isPending}
                className="rounded-full bg-secondary/10 px-6 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/15"
              >
                {refreshMarketDataMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="mr-2 h-4 w-4" />
                )}
                {refreshMarketDataMutation.isPending ? "Updating market" : "Update market data"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/10 px-6 py-4">
              <p className="text-sm font-semibold text-primary">Demo Mode: Displaying sample portfolio data. Connect to live API for real-time analytics.</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20"></div>
                <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
              </div>
              <p className="text-[color:rgba(37,33,30,0.6)]">Loading intelligence data...</p>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="rounded-full bg-card shadow-[0_10px_30px_rgba(15,61,53,0.06)]">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Overview</TabsTrigger>
                <TabsTrigger value="financial" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Financial</TabsTrigger>
                <TabsTrigger value="operations" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Operations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <KPICards data={data} />
                <div className="grid gap-6 md:grid-cols-2">
                  <CashFlowChart data={data} />
                  <OccupancyChart data={data} />
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <KPICards data={data} />
                <CashFlowChart data={data} />
              </TabsContent>

              <TabsContent value="operations" className="space-y-6">
                <MaintenanceStats data={data} />
              </TabsContent>
            </Tabs>
          )}

          {data && (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="surface-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-primary">Target metrics</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                  <li className="flex justify-between"><span>Occupancy</span><span className="font-semibold text-primary">85-95%</span></li>
                  <li className="flex justify-between"><span>Response time</span><span className="font-semibold text-primary">&lt; 24h</span></li>
                  <li className="flex justify-between"><span>Retention</span><span className="font-semibold text-primary">&gt; 80%</span></li>
                </ul>
              </div>
              <div className="surface-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                  <span className="text-sm font-semibold text-secondary">Performance gains</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                  <li className="flex justify-between"><span>Vacancy</span><span className="font-semibold text-secondary">-60%</span></li>
                  <li className="flex justify-between"><span>Service speed</span><span className="font-semibold text-secondary">+75%</span></li>
                  <li className="flex justify-between"><span>Portfolio NOI</span><span className="font-semibold text-secondary">+20%</span></li>
                </ul>
              </div>
              <div className="surface-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-primary">Systems online</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                  <li>• Resident portal uptime 99.98%</li>
                  <li>• Maintenance triage staffed 24/7</li>
                  <li>• Compliance monitoring active in 15 states</li>
                </ul>
              </div>
            </div>
          )}

          {marketData && (
            <div className="mt-10 rounded-3xl border border-border/80 bg-card/80 p-6 shadow-[0_30px_60px_rgba(15,61,53,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="eyebrow text-secondary">Market intelligence</p>
                  <h3 className="text-2xl font-heading text-foreground">Latest property market snapshot</h3>
                  <p className="text-sm text-[color:rgba(37,33,30,0.65)]">
                    Updated {new Date(marketData.fetched_at).toLocaleString()} from {marketData.source}.
                  </p>
                </div>
                <Button
                  onClick={() => refreshMarketDataMutation.mutate()}
                  disabled={refreshMarketDataMutation.isPending}
                  className="rounded-full bg-secondary text-secondary-foreground"
                >
                  {refreshMarketDataMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="mr-2 h-4 w-4" />
                  )}
                  {refreshMarketDataMutation.isPending ? "Refreshing..." : "Refresh market data"}
                </Button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-4">
                <div className="rounded-2xl bg-background/80 p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Listing price</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {marketData.listing_price ? `$${marketData.listing_price.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/80 p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Rent estimate</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {marketData.rent_estimate ? `$${marketData.rent_estimate.toLocaleString()}` : '—'}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/80 p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Price per sqft</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {marketData.price_per_sqft ? `$${marketData.price_per_sqft.toFixed(0)}` : '—'}
                  </p>
                </div>
                <div className="rounded-2xl bg-background/80 p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {marketData.confidence_score ? `${(marketData.confidence_score * 100).toFixed(0)}%` : '—'}
                  </p>
                </div>
              </div>

              {marketData.comparables && marketData.comparables.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-foreground">Top comparable listings</h4>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {marketData.comparables.slice(0, 3).map((comp: any) => (
                      <a
                        key={comp.url}
                        href={comp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-border/60 bg-background/70 p-4 transition-all hover:border-primary/60 hover:bg-primary/5"
                      >
                        <p className="text-sm font-semibold text-primary group-hover:underline">{comp.title}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{comp.address}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                          {comp.price && <span className="font-semibold text-foreground">${comp.price.toLocaleString()}</span>}
                          {comp.beds && <span>{comp.beds} bd</span>}
                          {comp.baths && <span>{comp.baths} ba</span>}
                          {comp.square_feet && <span>{comp.square_feet.toLocaleString()} sqft</span>}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {marketFetching && !marketData && (
            <div className="mt-10 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Fetching market intelligence...
            </div>
          )}

          {data && (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="surface-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-primary">Target metrics</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                  <li className="flex justify-between"><span>Occupancy</span><span className="font-semibold text-primary">85-95%</span></li>
                  <li className="flex justify-between"><span>Response time</span><span className="font-semibold text-primary">&lt; 24h</span></li>
                  <li className="flex justify-between"><span>Retention</span><span className="font-semibold text-primary">&gt; 80%</span></li>
                </ul>
              </div>
              <div className="surface-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                  <span className="text-sm font-semibold text-secondary">Performance gains</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                  <li className="flex justify-between"><span>Vacancy</span><span className="font-semibold text-secondary">-60%</span></li>
                  <li className="flex justify-between"><span>Service speed</span><span className="font-semibold text-secondary">+75%</span></li>
                  <li className="flex justify-between"><span>Portfolio NOI</span><span className="font-semibold text-secondary">+20%</span></li>
                </ul>
              </div>
              <div className="surface-card p-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-primary">Systems online</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:rgba(37,33,30,0.78)]">
                  <li>• Resident portal uptime 99.98%</li>
                  <li>• Maintenance triage staffed 24/7</li>
                  <li>• Compliance monitoring active in 15 states</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

