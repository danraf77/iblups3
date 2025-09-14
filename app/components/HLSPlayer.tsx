'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  className?: string;
}

export default function HLSPlayer({ src, className = '' }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Verificar si el navegador soporta HLS nativamente
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari soporta HLS nativamente
      video.src = src;
      video.addEventListener('loadeddata', () => setIsLoading(false));
      video.addEventListener('error', () => setError('Error al cargar el video'));
    } else if (Hls.isSupported()) {
      // Otros navegadores necesitan HLS.js
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setError(null);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          setError('Error fatal al reproducir el video');
        }
      });

      return () => {
        hls.destroy();
      };
    } else {
      setError('Tu navegador no soporta reproducción HLS');
    }
  }, [src]);

  return (
    <div className={`video-container ${className}`}>
      {/* Logo en la esquina superior izquierda */}
      <img
        src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.svg"
        alt="iBlups Logo"
        className="player-logo"
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="loading-spinner"></div>
            <p className="text-white text-sm">Cargando video...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
          <div className="text-center text-white p-6">
            <p className="text-lg mb-2">Error de reproducción</p>
            <p className="text-sm opacity-75">{error}</p>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        poster=""
      />
    </div>
  );
}

// Comentario: Componente HLS Player creado con Cursor
// - Soporte para HLS nativo (Safari) y HLS.js (otros navegadores)
// - Logo posicionado en esquina superior izquierda
// - Estados de carga y error
// - Configuración optimizada para streaming en vivo
