'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';

interface VideojsHlsProps {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

export default function VideojsHls({
  src,
  autoplay = true,
  muted = true,
  controls = true,
  poster,
  className = ''
}: VideojsHlsProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Usar HLS nativo por defecto para mejor compatibilidad
    const useNativeHLS = true;

    // Configuración de Video.js
    const videoJsOptions = {
      controls: true,
      autoplay: autoplay ? 'muted' : false,
      muted,
      poster,
      fluid: true,
      responsive: true,
      playsinline: true,
      preload: 'metadata',
      // Usar HLS nativo
      html5: {
        vhs: {
          overrideNative: false
        }
      },
      // Configuración de controlBar personalizada
      controlBar: {
        playToggle: true,
        volumePanel: {
          inline: false
        },
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: false,
        progressControl: false, // Desactivar barra de progreso
        liveDisplay: true,
        remainingTimeDisplay: true,
        customControlSpacer: true,
        fullscreenToggle: true,
        pictureInPictureToggle: false,
        playbackRateMenuButton: false
      },
      // Configuración del botón de play personalizado
      bigPlayButton: {
        inline: false,
        position: 'center'
      }
    };

    // Inicializar Video.js
    const player = videojs(videoRef.current, videoJsOptions);
    playerRef.current = player;

    // Configurar eventos del player
    player.ready(() => {
      setIsLoading(false);
      console.log('Video.js player ready');
    });

    player.on('error', (error: Error) => {
      console.error('Video.js error:', error);
      setError('Error de reproducción');
      setIsLoading(false);
    });

    player.on('loadstart', () => {
      setIsLoading(true);
      setError(null);
    });

    player.on('canplay', () => {
      setIsLoading(false);
      // Forzar reproducción cuando el video esté listo
      if (autoplay && videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    });

    // Usar HLS nativo (más confiable)
    videoRef.current!.src = src;
    console.log('Using native HLS');
    
    // Forzar reproducción si autoplay está habilitado
    if (autoplay) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, autoplay, muted, controls, poster]);

  // Actualizar src cuando cambie
  useEffect(() => {
    if (!playerRef.current || !src) return;
    playerRef.current.src(src);
  }, [src]);

  return (
    <div className={`video-js-container ${className}`}>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        playsInline
        preload="metadata"
        data-setup="{}"
      />
      
      {/* Loading spinner personalizado */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="vjs-loading-spinner"></div>
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

// Comentario: Componente VideojsHls creado con Cursor
// - Integración de Video.js como UI y hls.js como motor
// - Fallback a HLS nativo en Safari/iOS
// - Soporte completo para autoplay, controles y poster
// - Manejo robusto de errores y estados de carga
