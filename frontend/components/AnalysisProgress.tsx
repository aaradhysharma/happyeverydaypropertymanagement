"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AnalysisProgressProps {
  progress: number; // 0-100
  currentStep: string;
  address: string;
}

export function AnalysisProgress({ progress, currentStep, address }: AnalysisProgressProps) {
  return (
    <Card className="surface-card">
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <h3 className="text-2xl font-heading">Analyzing {address}</h3>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <p className="text-center text-muted-foreground">{currentStep}</p>
        <p className="text-center text-sm text-primary mt-2 font-medium">{progress}% Complete</p>
      </CardContent>
    </Card>
  );
}


