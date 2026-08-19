const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  devIndicators: false,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'three']
  },
  turbopack: {
    root: path.join(__dirname)
  }
};

module.exports = nextConfig;
