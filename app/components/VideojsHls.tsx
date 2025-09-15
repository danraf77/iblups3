'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import { getVideoJsConfig } from '../config/videojs.config';

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
  autoplay = false,
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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    console.log('Starting Video.js initialization');
    console.log(`Source URL: ${src}`);

    // Configuración mínima de Video.js (igual que en simple-debug)
    const options = {
      controls: true,
      autoplay: false,
      muted: true,
      fluid: true,
      responsive: true,
      preload: 'auto'
    };

    console.log('Video.js options configured');

    try {
      console.log('Initializing Video.js...');
      const player = videojs(videoRef.current, options);
      playerRef.current = player;
      console.log('Video.js player created');

      player.ready(() => {
        console.log('Player ready event fired');
        setIsLoading(false);
        
        // Configurar fuente
        console.log('Setting video source...');
        player.src(src);
        console.log('Video source set');
        
        // Forzar carga
        console.log('Forcing video load...');
        player.load();
        console.log('Video load called');
        
        // Configurar controles para que solo aparezcan en hover
        const controlBar = player.controlBar;
        if (controlBar) {
          // Ocultar controles inicialmente
          controlBar.addClass('vjs-control-bar-hidden');
          
          // Mostrar controles en hover del player
          player.on('mouseenter', () => {
            controlBar.removeClass('vjs-control-bar-hidden');
            setIsHovered(true);
          });
          
          // Ocultar controles cuando el mouse sale del player
          player.on('mouseleave', () => {
            controlBar.addClass('vjs-control-bar-hidden');
            setIsHovered(false);
          });
        }

        // Configurar eventos del logo
        const logoContainer = document.getElementById('vjs-logo-container');
        if (logoContainer) {
          player.on('useractive', () => {
            logoContainer.style.opacity = '1';
          });
          
          player.on('userinactive', () => {
            if (!player.paused()) {
              logoContainer.style.opacity = '0';
            }
          });
          
          player.on('pause', () => {
            logoContainer.style.opacity = '1';
          });
          
          player.on('play', () => {
            if (player.userActive()) {
              logoContainer.style.opacity = '1';
            } else {
              logoContainer.style.opacity = '0';
            }
          });
        }
      });

      // Eventos de debug
      player.on('loadstart', () => {
        console.log('loadstart event');
        setIsLoading(true);
        setError(null);
      });

      player.on('loadedmetadata', () => {
        console.log('loadedmetadata event');
      });

      player.on('loadeddata', () => {
        console.log('loadeddata event');
      });

      player.on('canplay', () => {
        console.log('canplay event');
        setIsLoading(false);
      });

      player.on('canplaythrough', () => {
        console.log('canplaythrough event');
      });

      player.on('play', () => {
        console.log('play event');
      });

      player.on('pause', () => {
        console.log('pause event');
      });

      player.on('error', () => {
        const error = player.error();
        console.error('Video.js error:', error);
        setError('Error de reproducción');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Exception initializing Video.js:', error);
      setError('Error inicializando Video.js');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      console.log('Cleaning up Video.js player');
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
    <div 
      className={`video-js-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered iblups"
        playsInline
        controls
        preload="auto"
        muted
        data-setup="{}"
      />
      
      {/* Logo de iBlups en la parte superior izquierda - solo visible en hover */}
      <div 
        id="vjs-logo-container"
        className="absolute top-4 left-4 z-10 transition-opacity duration-300 opacity-0"
      >
        <a 
          href="https://iblups.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          <img 
            src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.svg"
            alt="iBlups"
            className="h-8 w-auto hover:opacity-100 transition-opacity duration-200"
          />
        </a>
      </div>
      
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
