"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestPerplexityPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testPerplexityAPI = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = 'https://backend-f78ven2if-aaradhys-projects.vercel.app';
      const response = await fetch(`${apiUrl}/api/test-perplexity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
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
              <p className="eyebrow mb-1">API Testing</p>
              <h1 className="text-xl font-heading text-foreground">Perplexity API Test</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-semibold text-foreground mb-4">
              Test Perplexity API
            </h2>
            <p className="text-lg text-muted-foreground">
              Enter a search query to test the Perplexity API connection and response
            </p>
          </div>

          {/* Search Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your search query here... (e.g., 'What are the crime rates in Miramar, FL?')"
                  className="w-full min-h-[100px] p-4 border border-border rounded-lg bg-background text-foreground resize-none"
                />
                <Button 
                  onClick={testPerplexityAPI}
                  disabled={!query.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Test Perplexity API
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-green-600">✅ Success!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Perplexity API Response:</h3>
                  <pre className="whitespace-pre-wrap text-sm text-green-700 bg-white p-3 rounded border overflow-auto max-h-96">
                    {result}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-red-600">❌ Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Test Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setQuery("What are the crime rates in Miramar, FL?")}
                  className="text-left justify-start"
                >
                  Crime rates in Miramar, FL
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setQuery("What are the demographics and amenities near 6737 Arbor Dr, Miramar, FL?")}
                  className="text-left justify-start"
                >
                  Demographics near test property
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setQuery("Real estate market trends in Miramar, Florida 2024")}
                  className="text-left justify-start"
                >
                  Real estate market trends
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}