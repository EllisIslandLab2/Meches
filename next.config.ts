import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      },
      {
        protocol: 'https',
        hostname: '**.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizePackageImports: ['@vercel/analytics', 'react', 'react-dom'],
  },
  // Additional performance optimizations
  swcMinify: true,
  poweredByHeader: false,
};

export default nextConfig;
