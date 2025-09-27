import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Deshabilitar ESLint durante el build para permitir warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mantener el build bloqueando errores de TypeScript (recomendado para Vercel)
    ignoreBuildErrors: false,
  },
  experimental: {
    // Configuración experimental si es necesaria
  },
  // Configuración para evitar timeouts en build
  staticPageGenerationTimeout: 1000,
  // Deshabilitar el slash final en rutas
  trailingSlash: false,
  // Configuración de output
  output: "standalone",
  // Configuración para optimizar el build/imágenes
  images: {
    domains: ["iblups.sfo3.cdn.digitaloceanspaces.com"],
    unoptimized: true,
  },
  // ❌ OJO: generateStaticParams NO debe ir en next.config.*
  // Mueve cualquier uso a la página/layout del App Router correspondiente.
};

export default nextConfig;
