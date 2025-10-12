"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, List, Navigation } from "lucide-react";

// Sample property data (same as properties page)
const properties = [
  {
    id: 1,
    name: "44 Unit Apartment Building",
    address: "1015 Walnut Street, Yankton, SD 57078",
    lat: 42.8711,
    lng: -97.3968,
    type: "Multifamily",
    units: 44,
    occupancy: 95.5,
    price: 2995000,
    capRate: 6.81,
  },
];

export default function MapPage() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div>
            <p className="eyebrow mb-2">Happy Everyday</p>
            <h1 className="text-2xl font-heading text-foreground">Portfolio Map</h1>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold">
                Home
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="outline" className="rounded-full">
                <List className="mr-2 h-4 w-4" />
                List View
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="button-primary">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative flex h-[calc(100vh-120px)]">
        {/* Map Container */}
        <div className="relative flex-1">
          {/* Placeholder for Google Maps - will be integrated with GCP */}
          <div className="h-full w-full bg-gradient-to-br from-[#0f3d35]/20 to-[#c8643c]/20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex rounded-full bg-primary/10 p-6">
                  <Navigation className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                    Interactive Portfolio Map
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    GCP Maps integration showing {properties.length} properties across the United States.
                    AI-powered route optimization for property visits and maintenance coordination.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Simulated Map Marker - Yankton, SD */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Link href="/properties/yankton-sd" className="pointer-events-auto">
                  <button
                    onClick={() => setSelectedProperty(1)}
                    className="relative animate-bounce hover:scale-110 transition-transform"
                  >
                    <Building2 
                      className="h-12 w-12 text-primary drop-shadow-2xl"
                    />
                    <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-black/30" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                      <p className="text-xs font-semibold text-foreground">Yankton, SD</p>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Property List Sidebar */}
        <div className="w-96 border-l border-border bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Properties ({properties.length})
            </h2>
            <div className="space-y-3">
              {properties.map((property) => (
                <Link key={property.id} href="/properties/yankton-sd">
                  <Card
                    className={`surface-card cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                      selectedProperty === property.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{property.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{property.address}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Price:</span>{" "}
                              <span className="font-medium text-foreground">${(property.price / 1000000).toFixed(2)}M</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cap Rate:</span>{" "}
                              <span className="font-medium text-primary">{property.capRate}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span>{" "}
                              <span className="font-medium text-foreground">{property.type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Units:</span>{" "}
                              <span className="font-medium text-foreground">{property.units}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">Occupancy</span>
                              <span className="text-xs font-semibold text-primary">{property.occupancy}%</span>
                            </div>
                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${property.occupancy}%` }}
                              />
                            </div>
                          </div>
                          <Button className="w-full mt-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                            View Full Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* AI Route Optimizer */}
            <Card className="surface-card mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-primary/10 p-2">
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">AI Route Optimizer</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate optimized inspection routes across your portfolio. Our AI considers traffic patterns, maintenance priority, and technician availability.
                </p>
                <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Generate Route
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

