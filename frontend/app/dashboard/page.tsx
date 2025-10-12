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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Happy Everyday</h1>
                <p className="text-sm text-gray-600">AI Property Management</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/inspections">
                <Button variant="ghost">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Inspections
                </Button>
              </Link>
              <Link href="/providers">
                <Button variant="ghost">
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <Button 
            onClick={() => refetch()} 
            disabled={isFetching}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            Error loading dashboard data. Please check your backend connection.
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
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

        {/* Info Cards */}
        {data && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Target Metrics</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Occupancy: 85-95%</li>
                <li>Response Time: {'<'} 24 hours</li>
                <li>Retention: {'>'} 80%</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">📈 Performance Gains</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>60% vacancy reduction</li>
                <li>75% faster response times</li>
                <li>15-20% revenue increase</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">🤖 AI Features</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>GPT-4V property inspection</li>
                <li>Automated dispatch</li>
                <li>Predictive analytics</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

