/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://backend-7qj93yo2u-aaradhys-projects.vercel.app',
        NEXT_PUBLIC_VERSION: '0.1.0'
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