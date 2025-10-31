'use client';

import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../styles/player.css';

// Tipado de Video.js
type VideoJSPlayer = {
  autoplay: (value: boolean) => void;
  muted: (value: boolean) => void;
  controls: (value: boolean) => void;
  src: (sources: { src: string; type: string }[]) => void;
  volume: (value: number) => void;
  dispose: () => void;
  isDisposed: () => boolean;
  el_: Element;
  on: (event: string, callback: () => void) => void;
  paused: () => boolean;
  userActive: () => boolean | undefined;
  log: (message: string) => void;
};

type Props = {
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
  options?: {
    sources?: { src: string; type: string }[];
    [key: string]: unknown;
  };
  onReady?: (player: VideoJSPlayer) => void;
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
  onReady,
}) => {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<VideoJSPlayer | null>(null);

  // 🎯 Tracking de viewers (modo sesión)
  React.useEffect(() => {
    const path = window.location.pathname.split('/');
    const username = path[path.length - 1];
    if (!username) return;

    // 🔹 Crear un ID único por viewer
    const sessionId = Math.random().toString(36).substring(2, 10);

    // 🔹 Abrir la conexión SSE con sessionId
    const es = new EventSource(`/api/viewers/${username}?session=${sessionId}`);

    es.onerror = () => {
      console.warn('⚠️ Reconectando viewer tracking...');
      es.close();
      setTimeout(() => new EventSource(`/api/viewers/${username}?session=${sessionId}`), 2000);
    };

    // 🔹 Al cerrar o recargar la pestaña: desconectar viewer
    const handleClose = () => {
      try {
        es.close();
        navigator.sendBeacon(`/api/viewers/${username}?disconnect=1&session=${sessionId}`);
      } catch (err) {
        console.error('Error enviando disconnect beacon:', err);
      }
    };

    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose); // Safari / iOS

    return () => {
      es.close();
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
    };
  }, []);

  // ⚙️ Inicialización del player
  React.useEffect(() => {
    if (!playerRef.current && wrapRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('video-js', 'vjs-16-9', 'iblups', 'vjs-big-play-centered');

      if (playsinline) {
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('webkit-playsinline', '');
      }
      if (autoplay) videoElement.setAttribute('autoplay', '');
      if (controls) videoElement.setAttribute('controls', '');
      if (muted) videoElement.setAttribute('muted', '');
      videoElement.setAttribute('id', 'player');

      wrapRef.current.appendChild(videoElement);

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
        sources:
          options.sources || [
            {
              src: streamUrl,
              type: 'application/x-mpegURL',
            },
          ],
        ...options,
      };

      const player = (playerRef.current = videojs(videoElement, playerOptions, () => {
        videojs.log('player is ready');
        addLogo(player as VideoJSPlayer);
        player.volume(volume);
        if (muted) player.muted(false);
        onReady?.(player as VideoJSPlayer);
      }));
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(!!autoplay);
      player.muted(!!muted);
      player.controls(!!controls);
      player.src(
        options.sources || [{ src: streamUrl, type: 'application/x-mpegURL' }]
      );
    }
  }, [
    streamUrl,
    thumbnailUrl,
    autoplay,
    muted,
    controls,
    fluid,
    liveui,
    responsive,
    preload,
    playsinline,
    volume,
    options,
    onReady,
  ]);

  // Limpieza del player
  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // 🎨 Logo iBlups
  const addLogo = (player: VideoJSPlayer) => {
    const logoContainer = document.createElement('div');
    logoContainer.className = 'vjs-logo-container';

    const logoImage = document.createElement('img');
    logoImage.src =
      'https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.svg';
    logoImage.alt = 'iblups';
    logoImage.className = 'vjs-logo-image';

    const logoLink = document.createElement('a');
    logoLink.href = 'https://iblups.com';
    logoLink.target = '_blank';
    logoLink.appendChild(logoImage);

    logoContainer.appendChild(logoLink);

    if (player.el_) {
      player.el_.appendChild(logoContainer);

      player.on('useractive', () => (logoContainer.style.opacity = '1'));
      player.on('userinactive', () => {
        if (!player.paused()) logoContainer.style.opacity = '0';
      });
      player.on('pause', () => (logoContainer.style.opacity = '1'));
      player.on('play', () => {
        logoContainer.style.opacity = player.userActive() ? '1' : '0';
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
