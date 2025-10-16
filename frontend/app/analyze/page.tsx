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

// Google Places Autocomplete component
function AddressSearchInput({ onAddressSelect, onAnalyze }: { 
  onAddressSelect: (address: string) => void;
  onAnalyze: (address: string) => void;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
      placesService.current = new (window as any).google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['address'],
        },
        (predictions: any[], status: any) => {
          if (status === (window as any).google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions || []);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setInput(suggestion.description);
    setSuggestions([]);
    onAddressSelect(suggestion.description);
  };

  const handleAnalyze = () => {
    if (input.trim()) {
      onAnalyze(input.trim());
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter property address (e.g., 123 Main St, City, State)"
          className="w-full pl-12 pr-32 py-4 text-lg border border-border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          onClick={handleAnalyze}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 bottom-2 px-6 rounded-xl"
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
      
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-accent border-b border-border last:border-b-0 flex items-center gap-3"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Analysis Results Component
function AnalysisResults({ address, isLoading, analysisData }: {
  address: string;
  isLoading: boolean;
  analysisData: any;
}) {
  if (isLoading) {
    return (
      <Card className="surface-card">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                Analyzing Property...
              </h3>
              <p className="text-muted-foreground">
                Our AI is researching crime data, market trends, demographics, and local amenities for:
              </p>
              <p className="font-semibold text-primary mt-2">{address}</p>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Crime Analysis</p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Market Data</p>
              </div>
              <div className="text-center">
                <UtensilsCrossed className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Local Amenities</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Investment Analysis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <PropertyAnalysisReport analysisData={analysisData} />
  );
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
            <Link href="/properties">
              <Button variant="ghost" className="rounded-full px-5 py-2 text-sm font-semibold">
                Portfolio
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="button-primary">Dashboard</Button>
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
            Powered by Google AI, Gemini, and comprehensive data analysis v0.0.3
          </p>
        </div>
      </footer>
    </div>
  );
}