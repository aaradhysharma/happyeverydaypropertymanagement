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
    name: "Riverside Luxury Apartments",
    address: "1250 Riverside Drive, New York, NY 10032",
    lat: 40.8296,
    lng: -73.9428,
    type: "Multifamily",
    units: 185,
    occupancy: 96.2,
  },
  {
    id: 2,
    name: "Lakeview Gardens HOA",
    address: "8900 Lakeshore Blvd, Chicago, IL 60640",
    lat: 41.9742,
    lng: -87.6624,
    type: "HOA",
    units: 124,
    occupancy: 94.8,
  },
  {
    id: 3,
    name: "Downtown Executive Suites",
    address: "450 Congress Avenue, Austin, TX 78701",
    lat: 30.2672,
    lng: -97.7431,
    type: "Mixed-Use",
    units: 92,
    occupancy: 97.8,
  },
  {
    id: 4,
    name: "Pacific Heights Condominiums",
    address: "2100 Broadway, Seattle, WA 98122",
    lat: 47.6098,
    lng: -122.3331,
    type: "Condominium",
    units: 156,
    occupancy: 92.3,
  },
  {
    id: 5,
    name: "Sunset Valley Community",
    address: "7850 West Sunset Boulevard, Los Angeles, CA 90046",
    lat: 34.0979,
    lng: -118.3617,
    type: "Multifamily",
    units: 210,
    occupancy: 95.7,
  },
  {
    id: 6,
    name: "Harbor Point Estates",
    address: "3400 Alton Road, Miami Beach, FL 33140",
    lat: 25.8106,
    lng: -80.1393,
    type: "Luxury",
    units: 68,
    occupancy: 98.5,
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
            
            {/* Simulated Map Markers */}
            <div className="absolute inset-0 pointer-events-none">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className="absolute"
                  style={{
                    left: `${20 + (index * 13)}%`,
                    top: `${30 + (index % 3) * 20}%`,
                  }}
                >
                  <button
                    onClick={() => setSelectedProperty(property.id)}
                    className="pointer-events-auto relative animate-bounce"
                  >
                    <Building2 
                      className={`h-8 w-8 ${
                        selectedProperty === property.id ? 'text-primary' : 'text-secondary'
                      } drop-shadow-lg`}
                    />
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-black/20" />
                  </button>
                </div>
              ))}
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
                <Card
                  key={property.id}
                  className={`surface-card cursor-pointer transition-all ${
                    selectedProperty === property.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedProperty(property.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{property.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{property.address}</p>
                        <div className="mt-3 flex gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Type:</span>{" "}
                            <span className="font-medium text-foreground">{property.type}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Units:</span>{" "}
                            <span className="font-medium text-foreground">{property.units}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${property.occupancy}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-primary">{property.occupancy}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

