"use client";

export function VersionDisplay() {
  const version = process.env.NEXT_PUBLIC_VERSION || "0.0.7";
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 shadow-lg">
        <span className="text-xs font-mono text-muted-foreground">
          v{version}
        </span>
      </div>
    </div>
  );
}
