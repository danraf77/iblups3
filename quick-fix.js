const fs = require('fs');
const path = require('path');

console.log('🔧 Corrección rápida de errores de build...\n');

// 1. Reemplazar useChannelFollow.ts con la versión corregida
console.log('📝 Corrigiendo useChannelFollow.ts...');
const channelFollowPath = path.join(process.cwd(), 'app/hooks/useChannelFollow.ts');
const channelFollowContent = `'use client';
import { useState, useEffect, useCallback } from 'react';

interface UseChannelFollowProps {
  channelId: string;
  enabled?: boolean;
}

export function useChannelFollow({ channelId, enabled = true }: UseChannelFollowProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Declarar checkFollowingStatus ANTES del useEffect
  const checkFollowingStatus = useCallback(async () => {
    try {
      const response = await fetch(\`/api/channels/is-following?channelId=\${channelId}\`);
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [channelId]);

  // Ahora useEffect puede usar checkFollowingStatus sin problemas
  useEffect(() => {
    if (enabled && channelId) {
      checkFollowingStatus();
    }
  }, [channelId, enabled, checkFollowingStatus]);

  const followChannel = async (channelUsername: string, channelName: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/channels/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          channelUsername,
          channelName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(true);
      } else {
        setError(data.error || 'Error siguiendo canal');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const unfollowChannel = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(\`/api/channels/follow?channelId=\${channelId}\`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(false);
      } else {
        setError(data.error || 'Error dejando de seguir canal');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (channelUsername: string, channelName: string) => {
    if (isFollowing) {
      await unfollowChannel();
    } else {
      await followChannel(channelUsername, channelName);
    }
  };

  return {
    isFollowing,
    loading,
    error,
    followChannel,
    unfollowChannel,
    toggleFollow
  };
}

// Comentario: Hook para seguimiento de canales creado con Cursor
// - Verifica estado de seguimiento
// - Maneja follow/unfollow
// - Estados de carga y error
// - Optimizado para rendimiento`;

fs.writeFileSync(channelFollowPath, channelFollowContent, 'utf8');
console.log('✅ useChannelFollow.ts corregido');

// 2. Reemplazar next.config.js
console.log('\n📝 Corrigiendo next.config.js...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const nextConfigContent = `/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;`;

fs.writeFileSync(nextConfigPath, nextConfigContent, 'utf8');
console.log('✅ next.config.js corregido');

// 3. Agregar export dynamic a páginas con parámetros dinámicos
const pagesToFix = [
  { 
    path: 'app/[username]/page.tsx',
    marker: "'use client';"
  },
  { 
    path: 'app/embed/[username]/page.tsx',
    marker: "import type { Metadata } from 'next';"
  }
];

console.log('\n📝 Agregando export dynamic a páginas dinámicas...');
pagesToFix.forEach(({ path: pagePath, marker }) => {
  const fullPath = path.join(process.cwd(), pagePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Solo agregar si no existe
    if (!content.includes("export const dynamic")) {
      const dynamicExport = "\n\n// Forzar renderizado dinámico para evitar timeout en build\nexport const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n";
      
      if (marker && content.includes(marker)) {
        content = content.replace(marker, marker + dynamicExport);
      } else {
        // Buscar después de los imports
        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ')) {
            lastImportIndex = i;
          }
        }
        if (lastImportIndex !== -1) {
          lines.splice(lastImportIndex + 1, 0, dynamicExport);
          content = lines.join('\n');
        }
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Actualizado: ${pagePath}`);
    } else {
      console.log(`⏭️  Ya configurado: ${pagePath}`);
    }
  } else {
    console.log(`⚠️  No encontrado: ${pagePath}`);
  }
});

console.log('\n✨ Corrección completada!');
console.log('\n📝 Próximos pasos:');
console.log('1. Ejecuta: npm run build');
console.log('2. Si funciona, haz: git add . && git commit -m "fix: corregir errores de build" && git push');
console.log('3. Vercel debería hacer el deploy automáticamente');