'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface DebugVideojsHlsProps {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

export default function DebugVideojsHls({
  src,
  autoplay = false,
  muted = true,
  controls = true,
  poster,
  className = ''
}: DebugVideojsHlsProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    console.log('DEBUG:', info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    if (!videoRef.current) {
      addDebugInfo('Video element not found');
      return;
    }

    addDebugInfo('Starting Video.js initialization');
    addDebugInfo(`Source URL: ${src}`);

    // Configuración simple de Video.js
    const videoJsOptions = {
      controls: true,
      autoplay: autoplay ? 'muted' : false,
      muted,
      poster,
      fluid: true,
      responsive: true,
      playsinline: true,
      preload: 'auto',
      html5: {
        vhs: {
          overrideNative: false
        }
      }
    };

    addDebugInfo('Video.js options configured');

    try {
      // Inicializar Video.js
      const player = videojs(videoRef.current, videoJsOptions);
      playerRef.current = player;
      addDebugInfo('Video.js player created');

      // Configurar eventos del player
      player.ready(() => {
        addDebugInfo('Video.js player ready');
        setIsLoading(false);
        
        // Configurar la fuente del video
        addDebugInfo('Setting video source');
        player.src({
          src: src,
          type: 'application/x-mpegURL'
        });
        addDebugInfo('Video source set');
      });

      player.on('error', () => {
        const error = player.error();
        addDebugInfo(`Video.js error: ${JSON.stringify(error)}`);
        setError('Error de reproducción');
        setIsLoading(false);
      });

      player.on('loadstart', () => {
        addDebugInfo('Video loadstart event');
        setIsLoading(true);
        setError(null);
      });

      player.on('canplay', () => {
        addDebugInfo('Video canplay event');
        setIsLoading(false);
      });

      player.on('loadeddata', () => {
        addDebugInfo('Video loadeddata event');
      });

      player.on('loadedmetadata', () => {
        addDebugInfo('Video loadedmetadata event');
      });

      player.on('canplaythrough', () => {
        addDebugInfo('Video canplaythrough event');
      });

      // Forzar carga del video si no hay autoplay
      if (!autoplay) {
        addDebugInfo('Forcing video load (no autoplay)');
        player.load();
      }

    } catch (err) {
      addDebugInfo(`Error initializing Video.js: ${err}`);
      setError('Error inicializando Video.js');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      addDebugInfo('Cleaning up Video.js player');
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src, autoplay, muted, controls, poster]);

  return (
    <div className={`video-js-container ${className}`}>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered"
        playsInline
        controls
        preload="auto"
        muted
        data-setup="{}"
      />
      
      {/* Debug Info */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 max-w-md max-h-96 overflow-y-auto text-xs">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        {debugInfo.map((info, index) => (
          <div key={index} className="mb-1">{info}</div>
        ))}
      </div>
      
      {/* Loading spinner */}
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
