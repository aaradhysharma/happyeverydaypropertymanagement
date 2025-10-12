/**
 * Footer component with version display
 * Version number shown at bottom right corner
 */
export function Footer() {
  const version = process.env.NEXT_PUBLIC_VERSION || '0.0.4';

  return (
    <footer className="border-t border-border bg-background/80">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center text-sm">
        <div className="text-[color:rgba(37,33,30,0.65)]">
          © {new Date().getFullYear()} Happy Everyday Property Management
        </div>
        <div className="text-[color:rgba(37,33,30,0.65)] font-mono">
          v{version}
        </div>
      </div>
    </footer>
  );
}

