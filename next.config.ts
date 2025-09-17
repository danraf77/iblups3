import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbnail.iblups.com',
        port: '',
        pathname: '/thumb/live/**',
      },
      {
        protocol: 'https',
        hostname: 'iblups.sfo3.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/app/**',
      },
    ],
  },
  // Configurar allowedDevOrigins para evitar warnings de cross-origin - Cursor
  experimental: {
    allowedDevOrigins: ['192.168.1.39:3000', 'localhost:3000'],
  },
};

export default nextConfig;
