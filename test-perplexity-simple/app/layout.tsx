import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Test Perplexity Simple',
  description: 'Simple test for Perplexity API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <div className="fixed bottom-4 right-4 text-xs text-gray-500">
          v0.0.1
        </div>
      </body>
    </html>
  )
}

