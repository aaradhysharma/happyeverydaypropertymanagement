"use client";

import { useQuery } from "@tanstack/react-query";
import { providersApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Building2, Users, Star } from "lucide-react";
import Link from "next/link";

export default function ProvidersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const response = await providersApi.getProviders();
      return response.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['provider-stats'],
    queryFn: async () => {
      const response = await providersApi.getStats();
      return response.data;
    },
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
        <h2 className="text-3xl font-bold mb-6">Service Provider Network</h2>

        {/* Stats */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_providers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Available Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.available_providers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {stats.average_rating}
                  <Star className="ml-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Providers List */}
        <Card>
          <CardHeader>
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>
              AI-powered dispatch and automated scheduling
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading providers...</div>
            ) : data && data.providers ? (
              <div className="space-y-4">
                {data.providers.map((provider: any) => (
                  <div key={provider.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{provider.company_name}</h3>
                        <p className="text-sm text-gray-600">{provider.provider_type}</p>
                        <div className="flex items-center mt-2 gap-4 text-sm">
                          <span className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {provider.rating}
                          </span>
                          <span className="text-gray-600">{provider.total_jobs} jobs</span>
                          <span className={provider.is_available ? 'text-green-600' : 'text-gray-400'}>
                            {provider.is_available ? '✓ Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {provider.hourly_rate && (
                          <div className="text-lg font-semibold">
                            ${provider.hourly_rate}/hr
                          </div>
                        )}
                        <Button size="sm" className="mt-2">Contact</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                No providers found. Add providers to get started.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">🤖 AI-Powered Dispatch</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatic request categorization</li>
              <li>• Smart provider matching</li>
              <li>• Priority-based assignment</li>
              <li>• 75% faster response times</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-2">📍 Route Optimization</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Minimize travel time</li>
              <li>• Geographic clustering</li>
              <li>• Real-time tracking</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

