'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../styles/player.css'; // Usar estilos personalizados del player.css - Cursor

interface SimpleVideojsHlsProps {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

export default function SimpleVideojsHls({
  src,
  autoplay = false,
  muted = true,
  controls = true,
  poster,
  className = ''
}: SimpleVideojsHlsProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!videoRef.current) {
      console.log('❌ Video element not found');
      return;
    }

    console.log('✅ Video element found');
    console.log(`📺 Source URL: ${src}`);
    console.log(`🖼️ Poster URL: ${poster || 'No poster provided'}`);
    console.log(`🔍 URL validation:`, {
      hasProtocol: src.startsWith('http'),
      hasM3u8: src.endsWith('.m3u8'),
      urlLength: src.length
    });

    // Usar configuración estándar de Video.js - Cursor
    const options = {
      controls: true,
      autoplay: autoplay ? 'muted' : false,
      muted: muted, // Usar el valor pasado como prop
      fluid: true,
      responsive: true,
      preload: 'auto',
      poster: poster,
      volume: 0.5, // Volumen inicial en 50%
      playsinline: true, // Reproducción inline en móviles - Cursor
      // Configuración estándar de controlBar - Video.js manejará los estilos
      controlBar: {
        playToggle: true,
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: false,
        progressControl: false, // Ocultar barra de progreso como en player.css
        liveDisplay: true,
        remainingTimeDisplay: false,
        customControlSpacer: true,
        fullscreenToggle: true,
        pictureInPictureToggle: false,
        playbackRateMenuButton: false
      },
      // Configuración para live streaming
      liveui: true,
      liveTolerance: 15,
      liveTracker: {
        trackingThreshold: 20,
        liveTolerance: 15
      }
    };
    console.log('⚙️ Video.js options configured:', options);

    try {
      console.log('🚀 Initializing Video.js...');
      const player = videojs(videoRef.current, options);
      playerRef.current = player;
      console.log('✅ Video.js player created');

      player.ready(() => {
        console.log('🎯 Player ready event fired');
        
        // Agregar clase personalizada al player
        player.addClass('iblups');
        
        // Establecer volumen inicial en 50% solo si está silenciado - Cursor
        if (player.muted()) {
          player.volume(0.5);
          console.log('🔊 Volumen establecido en 50% (inicial)');
        }
        
        // Configurar controles para que solo aparezcan en hover usando eventos nativos de Video.js
        player.on('useractive', () => {
          console.log('👆 User active - mostrando controles');
          setIsHovered(true);
        });
        
        player.on('userinactive', () => {
          console.log('👆 User inactive - ocultando controles');
          setIsHovered(false);
        });
        
        // Mostrar controles cuando se pausa
        player.on('pause', () => {
          console.log('⏸️ Pause - mostrando controles');
          setIsHovered(true);
        });
        
        // Desmutear cuando el usuario hace play manualmente - Cursor
        player.on('play', () => {
          if (player.muted()) {
            player.muted(false);
            console.log('🔊 Video desmuteado al hacer play');
          }
        });
        
        // Configurar fuente
        console.log('📡 Setting video source...');
        player.src(src);
        console.log('✅ Video source set');
        
        // Forzar carga
        console.log('🔄 Forcing video load...');
        player.load();
        console.log('✅ Video load called');
      });

      // Eventos de debug
      player.on('loadstart', () => console.log('🔄 loadstart event'));
      player.on('loadedmetadata', () => console.log('📊 loadedmetadata event'));
      player.on('loadeddata', () => console.log('📦 loadeddata event'));
      player.on('canplay', () => console.log('▶️ canplay event'));
      player.on('canplaythrough', () => console.log('🎬 canplaythrough event'));
      player.on('play', () => console.log('▶️ play event'));
      player.on('pause', () => console.log('⏸️ pause event'));
      player.on('error', () => {
        const error = player.error();
        console.log(`❌ ERROR: ${JSON.stringify(error)}`);
      });

      // Cleanup
      return () => {
        console.log('🧹 Cleaning up player');
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };

    } catch (error) {
      console.log(`❌ Exception: ${error}`);
    }
  }, [src, poster]);

  return (
    <div 
      className={`video-js-container ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Preload del poster para carga más rápida */}
      {poster && (
        <link rel="preload" as="image" href={poster} />
      )}
      
      
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered iblups"
        controls
        preload="auto"
        muted
        playsInline
        webkit-playsinline="true"
        style={{ width: '100%', height: '400px' }}
      />
      
      {/* Logo de iBlups */}
      <img
        src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.svg"
        alt="iBlups"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '100px',
          height: 'auto',
          zIndex: 1000,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
