'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface PureHlsPlayerProps {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

export default function PureHlsPlayer({
  src,
  autoplay = true,
  muted = true,
  controls = true,
  poster,
  className = ''
}: PureHlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Configurar video element
    videoRef.current.autoplay = autoplay;
    videoRef.current.muted = muted;
    videoRef.current.controls = controls;
    if (poster) {
      videoRef.current.poster = poster;
    }

    // Configurar HLS
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: (xhr, url) => {
          // Agregar headers necesarios para el stream
          xhr.setRequestHeader('Referer', 'http://localhost:3000/');
          xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15');
        }
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed (Pure HLS.js)');
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error (Pure HLS.js):', data);
        if (data.fatal) {
          let errorMessage = 'Error de reproducción HLS';
          if (data.details === 'manifestLoadError') {
            errorMessage = 'Error al cargar el stream';
          } else if (data.details === 'fragLoadError' || data.details === 'levelLoadError') {
            errorMessage = 'Error de red al cargar el stream';
          }
          setError(errorMessage);
          setIsLoading(false);
        }
      });

      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback para Safari/iOS
      videoRef.current.src = src;
      console.log('Using native HLS for Safari/iOS (Pure HLS.js)');
      setIsLoading(false);
    } else {
      setError('Tu navegador no soporta reproducción HLS');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src, autoplay, muted, controls, poster]);

  // Actualizar src cuando cambie
  useEffect(() => {
    if (!videoRef.current || !src) return;
    
    if (Hls.isSupported() && hlsRef.current) {
      hlsRef.current.loadSource(src);
    } else {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <div className={`pure-hls-container relative border-2 border-blue-500 rounded-lg overflow-hidden ${className}`} style={{ minHeight: '400px' }}>
      <video
        ref={videoRef}
        className="w-full h-auto"
        playsInline
        preload="metadata"
        style={{ backgroundColor: '#000', minHeight: '400px' }}
      />
      
      {/* Loading spinner personalizado */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Comentario: Player HLS.js puro creado con Cursor
