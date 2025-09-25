import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuración optimizada para Vercel - Implementado por Cursor
  output: 'standalone',
  
  // Optimizaciones de rendimiento
  images: {
    domains: ['iblups.sfo3.cdn.digitaloceanspaces.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuración de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configurar paquetes externos
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Configuración de webpack para optimizar el bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Configuración de headers para mejor rendimiento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;