'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
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

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  loading = 'lazy'
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función para manejar errores de imagen
  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoading(false);
  }, []);

  // Función para manejar carga exitosa
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Determinar qué imagen usar - usar fallback solo si hay error
  const imageSrc = imageError ? fallbackSrc : src;

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-tertiary animate-pulse rounded" />
      )}
      
      {/* Imagen principal */}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={priority}
        loading={loading}
        // Configuraciones para optimizar la carga
        unoptimized={false}
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        // Agregar timeout para evitar que se quede cargando indefinidamente
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}
