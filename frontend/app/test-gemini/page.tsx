"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Search, MapPin, ArrowLeft, Loader2, BarChart3, Shield, DollarSign } from "lucide-react";

export default function TestGeminiPage() {
  const [apiKey, setApiKey] = useState("");
  const [address, setAddress] = useState("6737 Arbor Dr, Miramar, FL 33023");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [analysisData, setAnalysisData] = useState<{
    marketAnalysis: string[];
    crimeSafety: string[];
    amenities: string[];
    demographics: string[];
    investment: string[];
  } | null>(null);

  const handleAnalysis = async () => {
    if (!apiKey.trim() || !address.trim()) {
      setError("Please enter both API key and property address");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");
    setAnalysisData(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Conduct a comprehensive property analysis for ${address}. Provide detailed information about:
                
                1. Market Analysis:
                   - Current property values
                   - Rental rates and trends
                   - Price per square foot
                   - Market forecast
                
                2. Crime & Safety:
                   - Crime rates per 1,000 residents
                   - Safety assessment
                   - Security recommendations
                
                3. Local Amenities:
                   - Restaurants and dining
                   - Shopping centers
                   - Healthcare facilities
                   - Entertainment options
                
                4. Demographics:
                   - Population statistics
                   - Income levels
                   - Education levels
                   - Employment data
                
                5. Investment Analysis:
                   - ROI potential
                   - Risk assessment
                   - Investment recommendation
                   - Key strengths and risks
                
                Format the response as a comprehensive property analysis report with specific data points and recommendations.`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 4000,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates[0].content.parts[0].text;
      setResult(content);
      
      // Parse and structure the data for display
      try {
        const structuredData = parseAnalysisResult(content);
        setAnalysisData(structuredData);
      } catch (parseError) {
        console.log("Could not parse structured data, showing raw result");
      }
    } catch (error: any) {
      setError(error.message || 'Failed to analyze property with Gemini API');
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnalysisResult = (content: string): {
    marketAnalysis: string[];
    crimeSafety: string[];
    amenities: string[];
    demographics: string[];
    investment: string[];
  } => {
    // Simple parsing to extract key information
    const lines = content.split('\n').filter(line => line.trim());
    
    return {
      marketAnalysis: lines.filter(line => 
        line.toLowerCase().includes('market') || 
        line.toLowerCase().includes('price') || 
        line.toLowerCase().includes('rental')
      ).slice(0, 5),
      
      crimeSafety: lines.filter(line => 
        line.toLowerCase().includes('crime') || 
        line.toLowerCase().includes('safety') || 
        line.toLowerCase().includes('security')
      ).slice(0, 5),
      
      amenities: lines.filter(line => 
        line.toLowerCase().includes('restaurant') || 
        line.toLowerCase().includes('shopping') || 
        line.toLowerCase().includes('amenities')
      ).slice(0, 5),
      
      demographics: lines.filter(line => 
        line.toLowerCase().includes('population') || 
        line.toLowerCase().includes('income') || 
        line.toLowerCase().includes('demographics')
      ).slice(0, 5),
      
      investment: lines.filter(line => 
        line.toLowerCase().includes('roi') || 
        line.toLowerCase().includes('investment') || 
        line.toLowerCase().includes('return')
      ).slice(0, 5)
    };
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
              <p className="eyebrow mb-1">Gemini AI Property Analysis</p>
              <h1 className="text-xl font-heading text-foreground">Test Property Analysis</h1>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/technology">
              <Button variant="ghost" className="rounded-full px-4 py-2 text-sm font-semibold">
                Technology
              </Button>
            </Link>
            <Link href="/analyze">
              <Button className="button-primary">Full Analysis</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-semibold text-foreground mb-4">
            Gemini AI Property Analysis Test
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Test our Gemini AI integration with a sample property. Enter your API key and see how our AI analyzes property data in real-time.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="surface-card">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter property address"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Try: "6737 Arbor Dr, Miramar, FL 33023" or any other property address
                  </p>
                </div>
                
                <Button 
                  onClick={handleAnalysis}
                  disabled={isLoading || !apiKey.trim() || !address.trim()}
                  className="w-full py-4 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Property...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze Property with Gemini AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">Analysis Results</h3>
            
            {/* Structured Data Display */}
            {analysisData && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Market Analysis</h4>
                    </div>
                    <div className="space-y-2">
                      {analysisData.marketAnalysis.map((line, index) => (
                        <p key={index} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Crime & Safety</h4>
                    </div>
                    <div className="space-y-2">
                      {analysisData.crimeSafety.map((line, index) => (
                        <p key={index} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Amenities</h4>
                    </div>
                    <div className="space-y-2">
                      {analysisData.amenities.map((line, index) => (
                        <p key={index} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Demographics</h4>
                    </div>
                    <div className="space-y-2">
                      {analysisData.demographics.map((line, index) => (
                        <p key={index} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Investment</h4>
                    </div>
                    <div className="space-y-2">
                      {analysisData.investment.map((line, index) => (
                        <p key={index} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Full Text Results */}
            <Card className="surface-card">
              <CardContent className="p-8">
                <h4 className="font-semibold text-foreground mb-4">Complete Analysis Report</h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">{result}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Preview */}
        {!isLoading && !result && (
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
                  <MapPin className="h-8 w-8 text-primary" />
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
            Powered by Google Gemini AI v0.0.4
          </p>
        </div>
      </footer>
    </div>
  );
}
