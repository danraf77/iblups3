/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar timeouts en build
  output: 'standalone',
  staticPageGenerationTimeout: 120, // 120 segundos en lugar de 60
  
  // Configuración de imágenes
  images: {
    domains: [
      'iblups.sfo3.cdn.digitaloceanspaces.com',
      'thumbnail.iblups.com',
      'cdnhd.iblups.com',
      'live-stream.iblups.com'
    ],
    unoptimized: true, // Desactivar optimización temporalmente para evitar problemas
  },
  
  // Headers de seguridad y cache
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
      // Headers específicos para embed
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL' // Permitir iframe para embed
          },
        ],
      },
    ];
  },

  // Configuración de redirects si necesitas
  async redirects() {
    return [];
  },

  // Configuración de rewrites para APIs externas si necesitas
  async rewrites() {
    return [];
  },

  // Variables de entorno que se expondrán al cliente
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://iblups.com',
    NEXT_PUBLIC_HLS_BASE_URL: process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/video',
  },

  // Configuración de TypeScript
  typescript: {
    // Durante el desarrollo, permitir build con errores de TypeScript
    // En producción, esto debe ser false
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    // Durante el desarrollo, permitir build con warnings de ESLint
    ignoreDuringBuilds: false,
  },

  // Configuración de webpack si necesitas personalización
  webpack: (config, { isServer }) => {
    // Configuraciones personalizadas de webpack
    if (!isServer) {
      // Configuración para el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;