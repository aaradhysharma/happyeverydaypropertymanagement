"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  MapPin, 
  Building2, 
  TrendingUp, 
  ArrowLeft,
  Loader2,
  Sparkles,
  BarChart3,
  Shield,
  UtensilsCrossed,
  DollarSign
} from "lucide-react";
import { analyticsApi } from "@/lib/api";
import { PropertyAnalysisReport } from "@/components/PropertyAnalysisReport";

// Google Places Autocomplete component using new PlaceAutocompleteElement
function AddressSearchInput({ onAddressSelect, onAnalyze }: {
  onAddressSelect: (address: string) => void;
  onAnalyze: (address: string) => void;
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacesReady, setIsPlacesReady] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    const handleScriptLoaded = () => {
      setIsPlacesReady(true);
      setPlacesError(null);
      
      // Initialize the PlaceAutocompleteElement
      if (autocompleteRef.current) {
        const autocomplete = autocompleteRef.current;
        
        // Configure the autocomplete
        autocomplete.setAttribute('types', 'address');
        autocomplete.setAttribute('placeholder', 'Enter property address (e.g., 123 Main St, City, State)');
        
        // Handle place selection
        autocomplete.addEventListener('gmp-placeselect', (event: any) => {
          const place = event.detail.place;
          const address = place.formattedAddress || place.displayName || '';
          setInput(address);
          onAddressSelect(address);
        });
      }
    };

    const handleScriptError = () => {
      setPlacesError("Unable to load Google Places suggestions right now.");
    };

    window.addEventListener("google-maps-loaded", handleScriptLoaded);
    window.addEventListener("google-maps-error", handleScriptError);

    return () => {
      window.removeEventListener("google-maps-loaded", handleScriptLoaded);
      window.removeEventListener("google-maps-error", handleScriptError);
    };
  }, [onAddressSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Update the autocomplete element's value
    if (autocompleteRef.current) {
      autocompleteRef.current.value = value;
    }
  };

  const handleAnalyze = () => {
    if (input.trim()) {
      onAnalyze(input.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {/* Use the new PlaceAutocompleteElement */}
        <gmp-place-autocomplete
          ref={autocompleteRef}
          placeholder="Enter property address (e.g., 123 Main St, City, State)"
          className="w-full pl-12 pr-32 py-4 text-lg border border-border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          style={{
            width: '100%',
            paddingLeft: '3rem',
            paddingRight: '8rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            fontSize: '1.125rem',
            border: '1px solid hsl(var(--border))',
            borderRadius: '1rem',
            backgroundColor: 'hsl(var(--background))',
            outline: 'none'
          }}
        />
        
        {/* Fallback input for when autocomplete isn't ready */}
        {!isPlacesReady && (
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter property address (e.g., 123 Main St, City, State)"
            className="absolute inset-0 w-full pl-12 pr-32 py-4 text-lg border border-border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={!isPlacesReady && !placesError}
          />
        )}
        
        <Button
          onClick={handleAnalyze}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-xl z-20"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>

      {!isPlacesReady && !placesError && (
        <p className="mt-3 text-sm text-muted-foreground text-center">
          Loading Google location suggestions…
        </p>
      )}

      {placesError && (
        <p className="mt-3 text-sm text-destructive text-center">
          {placesError}
        </p>
      )}
    </div>
  );
}

// Analysis Results component
function AnalysisResults({ address, isLoading, analysisData }: {
  address: string;
  isLoading: boolean;
  analysisData: any;
}) {
  if (isLoading) {
    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <Card className="surface-card">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="font-heading font-semibold text-foreground mb-2">
              Analyzing Property
            </h3>
            <p className="text-muted-foreground">
              Researching comprehensive data for {address}...
            </p>
            <div className="mt-4 text-sm text-muted-foreground">
              This may take a few minutes while we gather market data, crime statistics, 
              local amenities, and generate AI-powered insights.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analysisData) {
    return (
      <div className="mt-8 max-w-6xl mx-auto">
        <PropertyAnalysisReport 
          address={address}
          analysisData={analysisData}
        />
      </div>
    );
  }

  return null;
}

export default function AnalyzePage() {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleAnalyze = async (address: string) => {
    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      // Call backend API to start analysis
      const response = await analyticsApi.analyzeProperty(address);
      const analysisId = response.data.analysis_id;

      // Poll for results
      const pollForResults = async () => {
        const maxAttempts = 60; // 5 minutes max
        let attempts = 0;

        while (attempts < maxAttempts) {
          try {
            const resultResponse = await analyticsApi.getPropertyAnalysis(analysisId);
            const result = resultResponse.data;

            if (result.status === 'completed') {
              setAnalysisData(result);
              setIsAnalyzing(false);
              return;
            } else if (result.status === 'error') {
              console.error("Analysis failed:", result.error);
              setIsAnalyzing(false);
              return;
            }

            // Wait 5 seconds before next poll
            await new Promise(resolve => setTimeout(resolve, 5000));
            attempts++;
          } catch (error) {
            console.error("Error polling for results:", error);
            attempts++;
          }
        }

        // Timeout
        setIsAnalyzing(false);
        console.error("Analysis timed out");
      };

      await pollForResults();

    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/70 bg-background/70 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <p className="eyebrow mb-1">AI Property Intelligence</p>
              <h1 className="text-xl font-heading text-foreground">Analyze Any Property</h1>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                About
              </Button>
            </Link>
            <Link href="/analyze">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Analysis
              </Button>
            </Link>
            <Link href="/technology">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Technology
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Properties
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Map
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="button-primary">Client Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-semibold text-foreground mb-4">
            Comprehensive Property Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Enter any property address and get instant AI-powered insights including crime data,
            market analysis, local amenities, and investment recommendations.
          </p>

          <AddressSearchInput
            onAddressSelect={handleAddressSelect}
            onAnalyze={handleAnalyze}
          />
        </div>

        {/* Analysis Results */}
        {(isAnalyzing || analysisData) && (
          <AnalysisResults
            address={selectedAddress}
            isLoading={isAnalyzing}
            analysisData={analysisData}
          />
        )}

        {/* Features Preview */}
        {!isAnalyzing && !analysisData && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16">
            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-primary/10 p-4 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Crime Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive crime data, safety ratings, and security recommendations
                </p>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-secondary/10 p-4 w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Market Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time rental rates, property values, and market trends
                </p>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-primary/10 p-4 w-fit mx-auto mb-4">
                  <UtensilsCrossed className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Local Amenities</h3>
                <p className="text-sm text-muted-foreground">
                  Dining, shopping, entertainment, and quality of life factors
                </p>
              </CardContent>
            </Card>

            <Card className="surface-card">
              <CardContent className="p-6 text-center">
                <div className="rounded-xl bg-secondary/10 p-4 w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">Investment Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  ROI projections, risk assessment, and AI-powered recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-background/80 mt-20">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-[color:rgba(37,33,30,0.65)]">
            © 2026 Happy Everyday Property Management. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Google AI, Gemini, and comprehensive data analysis v0.0.4
          </p>
        </div>
      </footer>
    </div>
  );
}