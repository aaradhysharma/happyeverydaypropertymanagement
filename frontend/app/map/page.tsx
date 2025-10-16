"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, List, Navigation, ArrowLeft } from "lucide-react";

// Property data
const property = {
  id: 1,
  name: "44 Unit Apartment Building",
  address: "1015-1021 Walnut Street, Yankton, SD 57078",
  lat: 42.8711,
  lng: -97.3968,
  price: 2995000,
  capRate: 6.81,
  units: 44,
  occupancy: 95.5,
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Google Map
    const initMap = () => {
      if (!mapRef.current || googleMapRef.current) return;

      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat: property.lat, lng: property.lng },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      googleMapRef.current = map;

      // Create custom marker
      const marker = new (window as any).google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: map,
        title: property.name,
        animation: (window as any).google.maps.Animation.DROP,
      });

      // Create info window
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #252118;">
              ${property.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(37, 33, 24, 0.7);">
              ${property.address}
            </p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
              <div>
                <div style="font-size: 12px; color: rgba(37, 33, 24, 0.6);">Price</div>
                <div style="font-size: 14px; font-weight: 600; color: #0f3d35;">$${(property.price / 1000000).toFixed(2)}M</div>
              </div>
              <div>
                <div style="font-size: 12px; color: rgba(37, 33, 24, 0.6);">Cap Rate</div>
                <div style="font-size: 14px; font-weight: 600; color: #0f3d35;">${property.capRate}%</div>
              </div>
              <div>
                <div style="font-size: 12px; color: rgba(37, 33, 24, 0.6);">Units</div>
                <div style="font-size: 14px; font-weight: 600; color: #252118;">${property.units}</div>
              </div>
              <div>
                <div style="font-size: 12px; color: rgba(37, 33, 24, 0.6);">Occupancy</div>
                <div style="font-size: 14px; font-weight: 600; color: #0f3d35;">${property.occupancy}%</div>
              </div>
            </div>
            <a href="/properties/yankton-sd" style="display: block; width: 100%; padding: 8px; background: #0f3d35; color: white; text-align: center; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">
              View Full Report
            </a>
          </div>
        `,
      });

      // Show info window on marker click
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Open info window by default
      infoWindow.open(map, marker);
    };

    // Load Google Maps script
    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      (window as any).initMap = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Cleanup
      if ((window as any).initMap) {
        delete (window as any).initMap;
      }
    };
  }, []);

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
              <p className="eyebrow mb-1">Happy Everyday</p>
              <h1 className="text-xl font-heading text-foreground">Portfolio Map</h1>
            </div>
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
        {/* Google Maps Container */}
        <div ref={mapRef} className="flex-1 relative" />

        {/* Property Details Sidebar */}
        <div className="w-96 border-l border-border bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Featured Property
            </h2>
            
            <Link href="/properties/yankton-sd">
              <Card className="surface-card cursor-pointer transition-all hover:ring-2 hover:ring-primary">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground text-lg">{property.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{property.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Purchase Price</p>
                        <p className="font-semibold text-foreground">${(property.price / 1000000).toFixed(2)}M</p>
                        <p className="text-xs text-muted-foreground">${(property.price / property.units).toLocaleString()}/unit</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
                        <p className="font-semibold text-primary text-lg">{property.capRate}%</p>
                        <p className="text-xs text-muted-foreground">Above market</p>
                      </div>
                      <div className="p-3 bg-secondary/5 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Total Units</p>
                        <p className="font-semibold text-foreground">{property.units}</p>
                        <p className="text-xs text-muted-foreground">Built 1977</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                        <p className="font-semibold text-primary text-lg">{property.occupancy}%</p>
                        <p className="text-xs text-muted-foreground">Above target</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">Occupancy Rate</span>
                        <span className="text-sm font-semibold text-primary">{property.occupancy}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                          style={{ width: `${property.occupancy}%` }}
                        />
                      </div>
                    </div>

                    <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      View Comprehensive Report →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* AI Route Optimizer */}
            <Card className="surface-card mt-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Navigation className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">AI Route Optimizer</h3>
                    <p className="text-xs text-muted-foreground">GCP Maps + ML routing</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate optimized inspection routes across your portfolio. Our AI considers traffic patterns, 
                  maintenance priority, and technician availability.
                </p>
                <Button className="w-full rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                  Generate Route
                </Button>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="surface-card mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Market Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Rent (Yankton)</span>
                    <span className="font-semibold text-foreground">$1,082/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Temperature</span>
                    <span className="font-semibold text-secondary">Cool</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">YoY Rent Change</span>
                    <span className="font-semibold text-primary">+$562</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">vs National Avg</span>
                    <span className="font-semibold text-primary">-47%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">
            © 2026 Happy Everyday Property Management. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Google Maps Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
