'use client';

import React from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import '../styles/player.css';

/* ---------------------------------------------------
   🎯 Tipado mínimo del player video.js
--------------------------------------------------- */
type VideoJSPlayer = {
  autoplay: (v: boolean) => void;
  muted: (v: boolean) => void;
  controls: (v: boolean) => void;
  src: (sources: { src: string; type: string }[]) => void;
  volume: (v: number) => void;
  dispose: () => void;
  isDisposed: () => boolean;
  el_: Element;
  on: (event: string, cb: () => void) => void;
  paused: () => boolean;
  userActive: () => boolean | undefined;
  log: (msg: string) => void;
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

/* ---------------------------------------------------
   ⚙️ COMPONENTE PRINCIPAL
--------------------------------------------------- */
const PlayerHLS: React.FC<Props> = ({
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
     📡 Conexión WS + Captura de métricas
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

    // 💾 Info base del viewer
    const device = /mobile/i.test(navigator.userAgent)
      ? 'mobile'
      : /smart/i.test(navigator.userAgent)
      ? 'tv'
      : 'desktop';
    const country =
      (Intl.DateTimeFormat().resolvedOptions().timeZone || '??')
        .split('/')[1]
        ?.slice(0, 2)
        .toUpperCase() || '??';

    // 📤 Función para enviar ping con datos acumulados
    const sendPing = (extra: Record<string, any> = {}) => {
      if (ws.readyState !== WebSocket.OPEN || mode !== 'watch') return;
      ws.send(
        JSON.stringify({
          event: 'ping',
          viewer_id: viewerId.current,
          channel: username,
          device,
          country,
          watch_seconds: 30,
          ...extra, // bitrate, resolución, etc.
        })
      );
    };

    // 💓 Ping periódico cada 30 s
    const pingInterval = setInterval(() => sendPing(), 30_000);

    // 🧹 Cierre seguro
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
     🎬 Inicialización del player + HLS.js
  -------------------------------------------- */
  React.useEffect(() => {
    if (!playerRef.current && wrapRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add(
        'video-js',
        'vjs-16-9',
        'iblups',
        'vjs-big-play-centered'
      );
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
        poster: thumbnailUrl
          ? `${thumbnailUrl}?p=${Date.now()}`
          : undefined,
        sources: options.sources || [
          { src: streamUrl, type: 'application/x-mpegURL' },
        ],
        ...options,
      };

      const player = (playerRef.current = videojs(
        videoElement,
        playerOptions,
        () => {
          videojs.log('player is ready');
          addLogo(player as VideoJSPlayer);
          player.volume(volume);
          if (muted) player.muted(false);
          onReady?.(player as VideoJSPlayer);

          /* ---------------------------
             🔍 Métricas con HLS.js
          --------------------------- */
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoElement);

            // Cuando cambia la calidad del stream
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
                    country: '??',
                    watch_seconds: 0,
                  })
                );
              }
            });
          }
        }
      ));
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.src(
        options.sources || [{ src: streamUrl, type: 'application/x-mpegURL' }]
      );
    }
  }, [streamUrl, thumbnailUrl, options, onReady]);

  /* --------------------------------------------
     🧹 Limpieza total del player
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

  /* -------------------------------------------- */
  return (
    <div data-vjs-player className={`player-container ${className}`}>
      <div ref={wrapRef} />
    </div>
  );
};

export default PlayerHLS;
