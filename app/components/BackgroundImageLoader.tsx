'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundImageLoaderProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

export default function BackgroundImageLoader({
  src,
  alt,
  fallbackSrc,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  loading = 'lazy'
}: BackgroundImageLoaderProps) {
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si no hay src o es la misma que fallback, no hacer nada
    if (!src || src === fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    // Función para verificar si la imagen existe usando fetch
    const checkImageExists = async (url: string): Promise<boolean> => {
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors' // Evitar CORS issues
        });
        return response.ok;
      } catch {
        // Si fetch falla, intentar con Image
        return new Promise((resolve) => {
          const img = new window.Image();
          const timeout = setTimeout(() => resolve(false), 3000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
          
          img.src = url;
        });
      }
    };

    // Verificar imagen en segundo plano
    const loadImageInBackground = async () => {
      setIsLoading(true);
      
      try {
        const exists = await checkImageExists(src);
        if (exists) {
          setCurrentSrc(src);
        }
      } catch {
        // Silenciar errores, mantener fallback
      } finally {
        setIsLoading(false);
      }
    };

    // Cargar imagen en segundo plano después de un pequeño delay
    const timer = setTimeout(loadImageInBackground, 200);
    
    return () => clearTimeout(timer);
  }, [src, fallbackSrc]);

  // Manejar errores de Next.js Image
  const handleImageError = () => {
    setCurrentSrc(fallbackSrc);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading indicator (opcional) */}
      {isLoading && (
        <div className="absolute top-1 right-1 z-10">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )}
      
      {/* Imagen */}
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className="object-cover transition-opacity duration-300"
        priority={priority}
        loading={loading}
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleImageError}
        unoptimized={true} // Desactivar optimización para evitar problemas
      />
    </div>
  );
}
