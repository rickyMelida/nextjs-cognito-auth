/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Configuraciones experimentales si son necesarias
  },
  webpack: (config) => {
    // Ensure proper path resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
    };
    
    return config;
  },
  // Configuración para Docker
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;