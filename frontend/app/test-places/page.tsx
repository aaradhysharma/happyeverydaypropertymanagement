"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function TestPlacesPage() {
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isPlacesReady, setIsPlacesReady] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Check if API key is present
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey && apiKey.length > 10) {
      setApiKeyStatus("valid");
    } else {
      setApiKeyStatus("invalid");
    }

    const handleScriptLoaded = () => {
      setIsPlacesReady(true);
      setPlacesError(null);
      
      // Initialize the PlaceAutocompleteElement
      if (autocompleteRef.current) {
        const autocomplete = autocompleteRef.current;
        
        // Configure the autocomplete
        autocomplete.setAttribute('types', 'address');
        autocomplete.setAttribute('placeholder', 'Type an address like "123 Main St, New York"');
        
        // Handle place selection
        autocomplete.addEventListener('gmp-placeselect', (event: any) => {
          const place = event.detail.place;
          setSelectedPlace(place);
          setInput(place.formattedAddress || place.displayName || '');
        });
      }
    };

    const handleScriptError = () => {
      setPlacesError("Failed to load Google Maps API");
    };

    window.addEventListener("google-maps-loaded", handleScriptLoaded);
    window.addEventListener("google-maps-error", handleScriptError);

    return () => {
      window.removeEventListener("google-maps-loaded", handleScriptLoaded);
      window.removeEventListener("google-maps-error", handleScriptError);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setSelectedPlace(null);
    
    // Update the autocomplete element's value
    if (autocompleteRef.current) {
      autocompleteRef.current.value = value;
    }
  };

  const getApiKeyStatusIcon = () => {
    switch (apiKeyStatus) {
      case "checking":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "valid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getPlacesStatusIcon = () => {
    if (placesError) return <XCircle className="h-5 w-5 text-red-500" />;
    if (isPlacesReady) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Google Places API Test
          </h1>
          <p className="text-muted-foreground">
            Testing the new PlaceAutocompleteElement with your API key
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getApiKeyStatusIcon()}
                API Key Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Status:</strong> {
                    apiKeyStatus === "checking" ? "Checking..." :
                    apiKeyStatus === "valid" ? "Valid" : "Invalid/Missing"
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {apiKeyStatus === "valid" ? 
                    "API key is present and configured" : 
                    "API key is missing or too short"
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPlacesStatusIcon()}
                Places API Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Status:</strong> {
                    placesError ? "Error" :
                    isPlacesReady ? "Ready" : "Loading..."
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  {placesError ? placesError :
                   isPlacesReady ? "Google Places API loaded successfully" :
                   "Loading Google Places API..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Address Autocomplete Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {/* New PlaceAutocompleteElement */}
              <gmp-place-autocomplete
                ref={autocompleteRef}
                placeholder="Type an address like '123 Main St, New York'"
                className="w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  fontSize: '1.125rem',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  backgroundColor: 'hsl(var(--background))',
                  outline: 'none'
                }}
              />
              
              {/* Fallback input */}
              {!isPlacesReady && (
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type an address like '123 Main St, New York'"
                  className="absolute inset-0 w-full pl-12 pr-4 py-4 text-lg border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={!isPlacesReady}
                />
              )}
            </div>

            {/* Instructions */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Test Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Start typing an address (e.g., "123 Main St")</li>
                <li>You should see address suggestions appear below</li>
                <li>Click on a suggestion to select it</li>
                <li>Selected place details will appear below</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Selected Place Details */}
        {selectedPlace && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Selected Place Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <strong>Address:</strong> {selectedPlace.formattedAddress || selectedPlace.displayName}
                </div>
                {selectedPlace.location && (
                  <div>
                    <strong>Coordinates:</strong> {selectedPlace.location.lat}, {selectedPlace.location.lng}
                  </div>
                )}
                {selectedPlace.types && (
                  <div>
                    <strong>Types:</strong> {selectedPlace.types.join(", ")}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  <strong>Raw Data:</strong>
                  <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(selectedPlace, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>API Key Present:</strong> {apiKeyStatus === "valid" ? "Yes" : "No"}</div>
              <div><strong>Places Ready:</strong> {isPlacesReady ? "Yes" : "No"}</div>
              <div><strong>Places Error:</strong> {placesError || "None"}</div>
              <div><strong>Current Input:</strong> "{input}"</div>
              <div><strong>Selected Place:</strong> {selectedPlace ? "Yes" : "No"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
