"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Users, DollarSign, TrendingUp, Home } from "lucide-react";

// Sample property data
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
    monthlyRevenue: 425000,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
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
    monthlyRevenue: 185000,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
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
    monthlyRevenue: 298000,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
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
    monthlyRevenue: 356000,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
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
    monthlyRevenue: 512000,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
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
    monthlyRevenue: 425000,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PropertiesPage() {
  const [selectedType, setSelectedType] = useState<string>("All");
  const types = ["All", "Multifamily", "HOA", "Mixed-Use", "Condominium", "Luxury"];

  const filteredProperties = selectedType === "All" 
    ? properties 
    : properties.filter(p => p.type === selectedType);

  const totalUnits = properties.reduce((sum, p) => sum + p.units, 0);
  const avgOccupancy = properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length;
  const totalRevenue = properties.reduce((sum, p) => sum + p.monthlyRevenue, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div>
            <p className="eyebrow mb-2">Happy Everyday</p>
            <h1 className="text-2xl font-heading text-foreground">Property Portfolio</h1>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold">
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="button-primary">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="mb-12 grid gap-6 md:grid-cols-4">
          <Card className="surface-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Properties</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-secondary/10 p-3">
                  <Home className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">{totalUnits.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Occupancy</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">{avgOccupancy.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-secondary/10 p-3">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-heading font-semibold text-foreground">${(totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              {type}
            </button>
          ))}
          <Link href="/map" className="ml-auto">
            <Button variant="outline" className="rounded-full">
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </Button>
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="surface-card overflow-hidden">
              <div className="relative h-48">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                  {property.type}
                </div>
              </div>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="text-xl font-heading font-semibold text-foreground">{property.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {property.address}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Units</p>
                    <p className="font-semibold text-foreground">{property.units}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
                    <p className="font-semibold text-primary">{property.occupancy}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-foreground">${(property.monthlyRevenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-background/80 mt-20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">© {new Date().getFullYear()} Happy Everyday Property Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

