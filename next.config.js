/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar timeouts en build
  output: 'standalone',
  staticPageGenerationTimeout: 120, // 120 segundos
  experimental: {
    // Usar runtime de Node.js
    runtime: 'nodejs',
  },
  
  // Configuración de imágenes
  images: {
    domains: [
      'iblups.sfo3.cdn.digitaloceanspaces.com',
      'thumbnail.iblups.com',
      'cdnhd.iblups.com'
    ],
    unoptimized: true, // Desactivar optimización para evitar problemas
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;