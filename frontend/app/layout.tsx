import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { VersionDisplay } from "@/components/VersionDisplay";

const heading = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Happy Everyday Property Management | Full-Service Stewardship",
  description:
    "Happy Everyday delivers full-service property management with tailored operations, trusted stewardship, and thoughtfully applied technology across the U.S.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <Providers>
          {children}
          <VersionDisplay />
        </Providers>
      </body>
    </html>
  );
}

