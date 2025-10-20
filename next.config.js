/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;