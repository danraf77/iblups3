import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Deshabilitar ESLint durante el build para permitir warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permitir que el build continúe con errores de TypeScript
    ignoreBuildErrors: false,
  },
  experimental: {
    // Configuración experimental si es necesaria
  },
  // Configuración para evitar timeouts en build
  staticPageGenerationTimeout: 1000,
  // Deshabilitar generación estática para páginas problemáticas
  trailingSlash: false,
  // Configuración de output
  output: 'standalone',
  // Configuración para optimizar el build
  images: {
    domains: ['iblups.sfo3.cdn.digitaloceanspaces.com'],
    unoptimized: true,
  },
  // Configuración para páginas dinámicas
  generateStaticParams: false,
};

export default nextConfig;