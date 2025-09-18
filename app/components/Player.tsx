'use client';

import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../styles/player.css';

type Props = {
  // Opciones del player - Cursor
  streamUrl: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  fluid?: boolean;
  liveui?: boolean;
  responsive?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  playsinline?: boolean;
  volume?: number;
  className?: string;
  
  // Opciones avanzadas - Cursor
  options?: {
    sources?: { src: string; type: string }[];
    [key: string]: unknown;
  };
  onReady?: (player: any) => void;
};

const VideoJS: React.FC<Props> = ({ 
  streamUrl,
  thumbnailUrl,
  autoplay = false,
  muted = true,
  controls = true,
  fluid = true,
  liveui = true,
  responsive = true,
  preload = 'auto',
  playsinline = true,
  volume = 0.5,
  className = '',
  options = {},
  onReady 
}) => {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!playerRef.current && wrapRef.current) {
      // Crear el <video-js> dentro del contenedor (compat con React 18 StrictMode)
      const videoElement = document.createElement('video-js');

      // clases tal como tu Nuxt: video-js vjs-16-9 iblups
      videoElement.classList.add('video-js', 'vjs-16-9', 'iblups', 'vjs-big-play-centered');

      // atributos HTML directos - Cursor
      if (playsinline) {
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('webkit-playsinline', '');
      }
      if (autoplay) videoElement.setAttribute('autoplay', '');
      if (controls) videoElement.setAttribute('controls', '');
      if (muted) videoElement.setAttribute('muted', '');

      // id opcional para inspección
      videoElement.setAttribute('id', 'player');

      wrapRef.current.appendChild(videoElement);

      // Configuración del player con props - Cursor
      const playerOptions = {
        autoplay,
        muted,
        controls,
        fluid,
        liveui,
        responsive,
        preload,
        playsinline,
        volume,
        poster: thumbnailUrl ? `${thumbnailUrl}?p=${Date.now()}` : undefined,
        sources: options.sources || [{
          src: streamUrl,
          type: 'application/x-mpegURL'
        }],
        ...options // Merge con opciones adicionales
      };

      const player = (playerRef.current = videojs(videoElement, playerOptions, () => {
        videojs.log('player is ready');
        
        // Agregar logo de iBlups - Cursor
        addLogo(player);
        
        // Establecer volumen inicial - Cursor
        player.volume(volume);
        if (muted) {
          player.muted(false); // Desmutear para que el volumen funcione
        }
        
        if (onReady) {
          onReady(player);
        }
      }));
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(!!autoplay);
      player.muted(!!muted);
      player.controls(!!controls);
      player.src(options.sources || [{ src: streamUrl, type: 'application/x-mpegURL' }]);
    }
  }, [streamUrl, thumbnailUrl, autoplay, muted, controls, fluid, liveui, responsive, preload, playsinline, volume, options, onReady]);

  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Función para agregar logo de iBlups - Cursor
  const addLogo = (player: any) => {
    const logoContainer = document.createElement('div');
    logoContainer.className = 'vjs-logo-container';
    
    const logoImage = document.createElement('img');
    logoImage.src = 'https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.svg';
    logoImage.alt = 'iblups';
    logoImage.className = 'vjs-logo-image';
    
    const logoLink = document.createElement('a');
    logoLink.href = 'https://iblups.com';
    logoLink.target = '_blank';
    logoLink.appendChild(logoImage);
    
    logoContainer.appendChild(logoLink);
    
    if (player.el_) {
      player.el_.appendChild(logoContainer);
      
      // Mostrar/ocultar logo con hover - Cursor
      player.on('useractive', function() {
        logoContainer.style.opacity = '1';
      });
      
      player.on('userinactive', function() {
        if (!player.paused()) {
          logoContainer.style.opacity = '0';
        }
      });
      
      player.on('pause', function() {
        logoContainer.style.opacity = '1';
      });
      
      player.on('play', function() {
        if (player.userActive()) {
          logoContainer.style.opacity = '1';
        } else {
          logoContainer.style.opacity = '0';
        }
      });
    }
  };

  return (
    <div data-vjs-player className={`player-container ${className}`}>
      <div ref={wrapRef} />
    </div>
  );
};

export default VideoJS;
