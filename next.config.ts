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
  // Configuración experimental removida - allowedDevOrigins no existe en esta versión - Cursor
};

export default nextConfig;
