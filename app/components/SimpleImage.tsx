'use client';
import { useState } from 'react';
import Image from 'next/image';

interface SimpleImageProps {
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

export default function SimpleImage({
  src,
  alt,
  fallbackSrc,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  loading = 'lazy'
}: SimpleImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    console.log('Image error for:', src, 'switching to fallback');
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', src);
    setIsLoading(false);
  };

  // Usar fallback solo si hay error
  const imageSrc = imageError ? fallbackSrc : src;

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-tertiary animate-pulse rounded" />
      )}
      
      {/* Imagen */}
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
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
