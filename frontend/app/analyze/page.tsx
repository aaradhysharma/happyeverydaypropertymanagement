"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  MapPin,
  Sparkles,
  Loader2,
  ArrowLeft,
  Shield,
  BarChart3,
  UtensilsCrossed,
  DollarSign
} from "lucide-react";
import { analyticsApi } from "@/lib/api";
import { PropertyAnalysisReport } from "@/components/PropertyAnalysisReport";
import { AnalysisProgress } from "@/components/AnalysisProgress";

// Google Places Autocomplete component using new PlaceAutocompleteElement
function AddressSearchInput({ onAddressSelect, onAnalyze }: {
  onAddressSelect: (address: string) => void;
  onAnalyze: (address: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isPlacesApiLoaded, setIsPlacesApiLoaded] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      setIsPlacesApiLoaded(true);
      setPlacesError(null);
      
      // Create the new Place Autocomplete Element dynamically
      if (containerRef.current && !containerRef.current.querySelector('gmp-place-autocomplete')) {
        const autocomplete = document.createElement('gmp-place-autocomplete');
        autocomplete.setAttribute('placeholder', 'Enter property address (e.g., 123 Main St, City, State)');
        autocomplete.setAttribute('type-restrictions', 'address');
        autocomplete.setAttribute('country', 'us');
        autocomplete.style.cssText = `
          width: 100%;
          padding-left: 1rem;
          padding-right: 8rem;
          padding-top: 1rem;
          padding-bottom: 1rem;
          font-size: 1.125rem;
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          background-color: hsl(var(--background));
          outline: none;
        `;
        
        // Add event listeners
        autocomplete.addEventListener('gmp-placeselect', (event: any) => {
          const place = event.detail.place;
          if (place && place.formatted_address) {
            setInputValue(place.formatted_address);
            onAddressSelect(place.formatted_address);
          }
        });
        
        autocomplete.addEventListener('input', (event: any) => {
          setInputValue(event.target.value);
          onAddressSelect(event.target.value);
        });
        
        containerRef.current.appendChild(autocomplete);
      }
    };

    const handleGoogleMapsError = () => {
      setPlacesError("Unable to load Google Places suggestions right now.");
    };

    window.addEventListener("google-maps-loaded", handleGoogleMapsLoaded);
    window.addEventListener("google-maps-error", handleGoogleMapsError);

    // Check if API is already loaded
    if ((window as any).google?.maps?.places) {
      handleGoogleMapsLoaded();
    }

    return () => {
      window.removeEventListener("google-maps-loaded", handleGoogleMapsLoaded);
      window.removeEventListener("google-maps-error", handleGoogleMapsError);
    };
  }, [onAddressSelect]);

  const handleAnalyzeClick = () => {
    if (inputValue.trim()) {
      onAnalyze(inputValue.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div ref={containerRef} className="relative">
          {/* Autocomplete element will be inserted here dynamically */}
        </div>
        
        <Button
          onClick={handleAnalyzeClick}
          disabled={!inputValue.trim() || !isPlacesApiLoaded}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-xl"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze
        </Button>
      </div>

      {!isPlacesApiLoaded && !placesError && (
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

// Analysis Results component with progress tracking
function AnalysisResults({ address, isLoading, analysisData, analysisId }: {
  address: string;
  isLoading: boolean;
  analysisData: any;
  analysisId?: string | null;
}) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Starting analysis...");

  // Poll for progress updates
  useEffect(() => {
    if (isLoading && analysisId) {
      const pollInterval = setInterval(async () => {
        try {
          const response = await analyticsApi.getAnalysisProgress(analysisId);
          const progressData = response.data;
          
          if (progressData.progress !== undefined) {
            setProgress(progressData.progress);
          }
          if (progressData.current_step) {
            setCurrentStep(progressData.current_step);
          }
        } catch (error) {
          console.error("Error polling progress:", error);
        }
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(pollInterval);
    }
  }, [isLoading, analysisId]);
  if (isLoading) {
    return (
      <AnalysisProgress 
        progress={progress} 
        currentStep={currentStep} 
        address={address}
      />
    );
  }

  if (analysisData) {
    return (
      <div className="mt-8 max-w-6xl mx-auto">
        <PropertyAnalysisReport 
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
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleAnalyze = async (address: string) => {
    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      // Call backend API to start analysis
      const response = await analyticsApi.analyzeProperty(address);
      const currentAnalysisId = response.data.analysis_id;
      setAnalysisId(currentAnalysisId);

      // Poll for results
      const pollForResults = async () => {
        const maxAttempts = 60; // 5 minutes max
        let attempts = 0;

        while (attempts < maxAttempts) {
          try {
            const resultResponse = await analyticsApi.getPropertyAnalysis(currentAnalysisId);
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

              {/* Demo Button */}
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const demoAddress = "6737 Arbor Dr, Miramar, FL 33023";
                    setSelectedAddress(demoAddress);
                    handleAddressSelect(demoAddress);
                    handleAnalyze(demoAddress);
                  }}
                  className="rounded-xl px-6 py-2"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try Demo Property
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Test with a real property in Miramar, FL
                </p>
                
                {/* Test API Button */}
                <div className="mt-4">
                  <Link href="/technology">
                    <Button variant="secondary" className="rounded-xl px-6 py-2">
                      <Search className="mr-2 h-4 w-4" />
                      Test Gemini AI
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2">
                    Test our Gemini AI integration on the Technology page
                  </p>
                </div>
              </div>
        </div>

        {/* Analysis Results */}
        {(isAnalyzing || analysisData) && (
          <AnalysisResults
            address={selectedAddress}
            isLoading={isAnalyzing}
            analysisData={analysisData}
            analysisId={analysisId}
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
            Powered by Google AI, Gemini, and comprehensive data analysis v0.1.0
          </p>
        </div>
      </footer>
    </div>
  );
}