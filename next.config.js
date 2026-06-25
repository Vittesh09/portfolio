const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname)
  }
};

module.exports = nextConfig;
