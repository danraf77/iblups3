'use client';

import React from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import '../styles/player.css';

// Tipado básico del player
type VideoJSPlayer = {
  autoplay: (value: boolean) => void;
  muted: (value: boolean) => void;
  controls: (value: boolean) => void;
  src: (sources: { src: string; type: string }[]) => void;
  volume: (value: number) => void;
  dispose: () => void;
  isDisposed: () => boolean;
  el_: HTMLElement;
  id_: string;
  on: (event: string, callback: () => void) => void;
  paused: () => boolean;
  userActive: () => boolean | undefined;
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

const Player: React.FC<Props> = ({
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
  const wsRef = React.useRef<WebSocket | null>(null);
  const viewerId = React.useRef<string>(crypto.randomUUID());

  /* --------------------------------------------
     📡 Conexión WebSocket + Ping de métricas
  -------------------------------------------- */
  React.useEffect(() => {
    const path = window.location.pathname.split('/');
    const username = path[path.length - 1];
    if (!username) return;

    const isEmbed = window.location.pathname.includes('/embed/');
    const mode = isEmbed ? 'watch' : 'readonly';

    const ws = new WebSocket(
      `wss://iblups-viewers-gateway.fly.dev?channel=${username}&mode=${mode}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log(`🟢 WS conectado [${mode}] ${username}`);
    ws.onclose = () => console.log(`🔴 WS desconectado ${username}`);
    ws.onerror = (err) => console.error('⚠️ Error WebSocket:', err);

    // Device básico
    const device = /mobile/i.test(navigator.userAgent)
      ? 'mobile'
      : /smart/i.test(navigator.userAgent)
      ? 'tv'
      : 'desktop';

    const sendPing = (extra: Record<string, unknown> = {}) => {
      if (ws.readyState !== WebSocket.OPEN || mode !== 'watch') return;
      ws.send(
        JSON.stringify({
          event: 'ping',
          viewer_id: viewerId.current,
          channel: username,
          device,
          watch_seconds: 30,
          ...extra,
        })
      );
    };

    // Ping cada 30s
    const pingInterval = setInterval(() => sendPing(), 30_000);

    const handleClose = () => ws.close();
    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);

    return () => {
      clearInterval(pingInterval);
      ws.close();
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
    };
  }, []);

  /* --------------------------------------------
     🎬 Inicialización de Video.js + HLS.js
  -------------------------------------------- */
  React.useEffect(() => {
    if (!playerRef.current && wrapRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('video-js', 'vjs-16-9', 'iblups', 'vjs-big-play-centered');
      videoElement.setAttribute('id', 'player');

      if (playsinline) {
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('webkit-playsinline', '');
      }
      if (autoplay) videoElement.setAttribute('autoplay', '');
      if (controls) videoElement.setAttribute('controls', '');
      if (muted) videoElement.setAttribute('muted', '');

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
        sources: options.sources || [{ src: streamUrl, type: 'application/x-mpegURL' }],
        ...options,
      };

      const player = (playerRef.current = videojs(videoElement, playerOptions, () => {
        console.log('🎞️ Player ready');
        addLogo(player as VideoJSPlayer);
        player.volume(volume);
        if (muted) player.muted(false);
        onReady?.(player as VideoJSPlayer);

        // ✅ Integración con HLS.js
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(streamUrl);

          // ⚠️ Obtener <video> interno de video.js
          const innerVideo = player.el_.querySelector('video') as HTMLMediaElement | null;
          if (innerVideo) {
            hls.attachMedia(innerVideo);

            hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
              const level = hls.levels[data.level];
              if (!level) return;
              const ws = wsRef.current;
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    event: 'ping',
                    viewer_id: viewerId.current,
                    channel: player.id_,
                    bitrate: level.bitrate,
                    resolution: `${level.width}x${level.height}`,
                    device:
                      /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                    watch_seconds: 0,
                  })
                );
              }
            });
          } else {
            console.warn('⚠️ No se encontró <video> interno para HLS');
          }
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo 1 vez al montar

  /* --------------------------------------------
     🧹 Limpieza del player
  -------------------------------------------- */
  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  /* --------------------------------------------
     🎨 Logo iBlups
  -------------------------------------------- */
  const addLogo = (player: VideoJSPlayer) => {
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

export default Player;
