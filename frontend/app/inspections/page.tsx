"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Building2, Upload, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function InspectionsPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Happy Everyday</h1>
                <p className="text-sm text-gray-600">AI Property Management</p>
              </div>
            </div>
            <nav className="flex gap-2">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/inspections">
                <Button variant="ghost">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Inspections
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">AI Property Inspections</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Property Images</CardTitle>
              <CardDescription>
                GPT-4V will analyze images for damage detection and cost estimation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      {selectedFiles.length} file(s) selected
                    </div>
                  )}
                </div>
                <Button className="w-full" disabled={selectedFiles.length === 0}>
                  Analyze with AI
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Features</CardTitle>
              <CardDescription>
                Powered by GPT-4V for comprehensive property assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold">Roof Condition Assessment</div>
                    <div className="text-sm text-gray-600">
                      Missing shingles, structural damage, wear patterns
                    </div>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold">Damage Detection</div>
                    <div className="text-sm text-gray-600">
                      Water damage, structural issues, HVAC problems
                    </div>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold">Severity Scoring</div>
                    <div className="text-sm text-gray-600">
                      1-10 scale with confidence levels
                    </div>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-orange-100 rounded-full p-1 mr-3 mt-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold">Cost Estimation</div>
                    <div className="text-sm text-gray-600">
                      Automated repair cost estimates based on historical data
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Inspection Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload multiple angles for better analysis</li>
            <li>• Ensure good lighting in photos</li>
            <li>• Include close-up shots of damage areas</li>
            <li>• AI analysis typically completes in 10-30 seconds</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

