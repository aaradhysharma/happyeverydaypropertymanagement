"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";
import { KPICards } from "@/components/analytics/KPICards";
import { CashFlowChart } from "@/components/analytics/CashFlowChart";
import { OccupancyChart } from "@/components/analytics/OccupancyChart";
import { MaintenanceStats } from "@/components/analytics/MaintenanceStats";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, RefreshCw, ImageIcon, Users } from "lucide-react";
import Link from "next/link";

// Mock data for demo purposes until backend is deployed
const mockDashboardData = {
  occupancy_rate: 94.2,
  noi: 2847000,
  cash_flow: 1235000,
  maintenance_cost: 42500,
  tenant_retention: 87.3,
  response_time: 1.8,
  properties: 212,
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
  const { data = mockDashboardData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        const response = await analyticsApi.getDashboard();
        return response.data;
      } catch (err) {
        // Return mock data if API is unavailable
        return mockDashboardData;
      }
    },
    retry: false,
    refetchInterval: false, // Disable auto-refresh for demo
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
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15">
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Syncing..." : "Refresh data"}
            </Button>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}

