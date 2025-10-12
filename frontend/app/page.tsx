import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, BarChart3, ImageIcon, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Happy Everyday</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Property Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionizing property management with AI automation, predictive analytics, and intelligent insights
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Launch Platform
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-500 mb-2" />
              <CardTitle>BI Analytics Dashboard</CardTitle>
              <CardDescription>
                Real-time KPIs: Occupancy rates, NOI, cash flow analysis, and predictive insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• 85-95% occupancy target tracking</li>
                <li>• Monthly cash flow visualization</li>
                <li>• Maintenance cost per unit</li>
                <li>• Tenant retention analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ImageIcon className="h-12 w-12 text-green-500 mb-2" />
              <CardTitle>AI Property Inspection</CardTitle>
              <CardDescription>
                GPT-4V powered image analysis for automated damage detection and cost estimation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Automated damage detection</li>
                <li>• Roof condition assessment</li>
                <li>• Severity scoring (1-10)</li>
                <li>• Repair cost estimates</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-500 mb-2" />
              <CardTitle>Service Provider Network</CardTitle>
              <CardDescription>
                AI-powered dispatch with automated scheduling and route optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Auto-assignment & triage</li>
                <li>• Route optimization</li>
                <li>• Real-time tracking</li>
                <li>• Performance analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-500 mb-2" />
              <CardTitle>Data Privacy & Compliance</CardTitle>
              <CardDescription>
                SOC 2, ISO 27001, GDPR, CCPA compliant with complete audit logging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• GDPR/CCPA compliance</li>
                <li>• Encrypted data storage</li>
                <li>• Audit trail logging</li>
                <li>• Fair Housing Act compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>Market Intelligence</CardTitle>
              <CardDescription>
                AI-powered competitive analysis and market insights using Claude
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Competitor analysis</li>
                <li>• Market trends</li>
                <li>• Pricing strategy</li>
                <li>• Technology gap identification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building2 className="h-12 w-12 text-indigo-500 mb-2" />
              <CardTitle>Performance Gains</CardTitle>
              <CardDescription>
                Research-backed improvements in key operational metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• 60% vacancy reduction</li>
                <li>• 75% faster response times</li>
                <li>• 15-20% revenue increase</li>
                <li>• 40% inspection cost savings</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-8">Powered by Cutting-Edge AI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">GPT-4V</div>
              <div className="text-gray-600">Property Inspection</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">Claude 3.5</div>
              <div className="text-gray-600">Market Analysis</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">FastAPI</div>
              <div className="text-gray-600">High-Performance API</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2025 Happy Everyday Property Management. All rights reserved.
          </div>
          <div className="text-sm text-gray-500">
            Version {process.env.NEXT_PUBLIC_VERSION || '0.0.1'}
          </div>
        </div>
      </footer>
    </div>
  );
}

