'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { getVideoJsConfig } from '../config/videojs.config';

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

    // Usar configuración centralizada de Video.js
    const options = getVideoJsConfig(autoplay, muted, poster);
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
