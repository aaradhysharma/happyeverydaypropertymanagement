/**
 * Footer component with version display
 * Version number shown at bottom right corner
 */
export function Footer() {
  const version = process.env.NEXT_PUBLIC_VERSION || '0.0.1';

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center text-sm">
        <div className="text-gray-600">
          © 2025 Happy Everyday Property Management
        </div>
        <div className="text-gray-500 font-mono">
          v{version}
        </div>
      </div>
    </footer>
  );
}

