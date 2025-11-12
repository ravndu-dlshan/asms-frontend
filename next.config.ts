import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  transpilePackages: ['@mui/material', '@mui/system', '@mui/x-date-pickers'],
  
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  
  // ESLint configuration for build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    // Only check types, don't fail build on type errors during development
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
