/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://backend-b6d91ni4j-aaradhys-projects.vercel.app",
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION || "0.0.7",
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig