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

export default function DashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await analyticsApi.getDashboard();
      return response.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-card/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Building2 className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Happy Everyday</h1>
                <p className="text-xs text-muted-foreground">AI Property Intelligence</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Link href="/">
                <Button variant="ghost" className="hover:bg-primary/10">Home</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="bg-primary/10 text-primary">Dashboard</Button>
              </Link>
              <Link href="/inspections">
                <Button variant="ghost" className="hover:bg-primary/10">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Inspections
                </Button>
              </Link>
              <Link href="/providers">
                <Button variant="ghost" className="hover:bg-primary/10">
                  <Users className="mr-2 h-4 w-4" />
                  Providers
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold gradient-text mb-2">Command Center</h2>
            <p className="text-muted-foreground">Real-time property intelligence and operational metrics</p>
          </div>
          <Button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Syncing...' : 'Sync Data'}
          </Button>
        </div>

        {error && (
          <div className="gradient-border bg-destructive/10 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
            <p className="text-destructive font-medium">⚠️ Connection Error</p>
            <p className="text-sm text-destructive/80 mt-1">Unable to reach backend. Please verify your API connection.</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary absolute top-0"></div>
            </div>
            <p className="text-muted-foreground">Loading intelligence data...</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Overview
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Financial
              </TabsTrigger>
              <TabsTrigger value="operations" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Operations
              </TabsTrigger>
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

        {/* System Status Cards */}
        {data && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="gradient-border bg-primary/5 backdrop-blur-sm rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <h3 className="font-semibold text-primary">Target Metrics</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex justify-between"><span>Occupancy</span><span className="text-primary">85-95%</span></li>
                <li className="flex justify-between"><span>Response</span><span className="text-primary">{'<'} 24h</span></li>
                <li className="flex justify-between"><span>Retention</span><span className="text-primary">{'>'} 80%</span></li>
              </ul>
            </div>

            <div className="gradient-border bg-secondary/5 backdrop-blur-sm rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <h3 className="font-semibold text-secondary">Performance Gains</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex justify-between"><span>Vacancy</span><span className="text-secondary">-60%</span></li>
                <li className="flex justify-between"><span>Speed</span><span className="text-secondary">+75%</span></li>
                <li className="flex justify-between"><span>Revenue</span><span className="text-secondary">+20%</span></li>
              </ul>
            </div>

            <div className="gradient-border bg-primary/5 backdrop-blur-sm rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <h3 className="font-semibold text-primary">AI Systems</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2"><span className="text-xs">●</span> GPT-4V Vision</li>
                <li className="flex items-center gap-2"><span className="text-xs">●</span> Auto Dispatch</li>
                <li className="flex items-center gap-2"><span className="text-xs">●</span> Predictive AI</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

