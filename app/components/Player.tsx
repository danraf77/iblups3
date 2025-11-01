'use client';

import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../styles/player.css';

// Tipos para métricas
type IBlupsMetrics = {
  updateMetrics: (bitrate: number, resolution: string) => void;
};

// Tipos extendidos para APIs del navegador y Video.js
// Modificado por Cursor: Agregados tipos para evitar el uso de 'any'
// Usando type en lugar de interface extendida para evitar conflictos con tipos nativos
type VideoElementWithQuality = HTMLVideoElement & {
  getVideoPlaybackQuality?: () => {
    totalVideoFrames: number;
    droppedVideoFrames: number;
    corruptedVideoFrames: number;
  };
  webkitVideoDecodedByteCount?: number;
}

interface VHSPlaylist {
  master?: unknown;
  media?: () => {
    attributes?: {
      BANDWIDTH?: number;
      RESOLUTION?: string;
      WIDTH?: number;
      HEIGHT?: number;
    };
  };
}

interface PlayerWithVHS extends VideoJSPlayer {
  vhs?: {
    playlists?: VHSPlaylist;
  };
}

type VideoJSPlayer = {
  autoplay: (value: boolean) => void;
  muted: (value: boolean) => void;
  controls: (value: boolean) => void;
  src: (sources: { src: string; type: string }[]) => void;
  volume: (value: number) => void;
  dispose: () => void;
  isDisposed: () => boolean;
  el_: Element;
  el: () => Element; // Modificado por Cursor: Agregado método el() para acceder al elemento del player
  on: (event: string, callback: () => void) => void;
  paused: () => boolean;
  userActive: () => boolean | undefined;
  log: (message: string) => void;
  _metricsInterval?: NodeJS.Timeout;
};

declare global {
  interface Window {
    _iblupsMetrics?: IBlupsMetrics;
  }
}

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

  // 🎯 Tracking silencioso de viewers (modo inteligente + métricas)
  React.useEffect(() => {
    const path = window.location.pathname.split('/');
    const username = path[path.length - 1];
    if (!username) return;

    const isEmbed = window.location.pathname.includes('/embed/');
    const mode = isEmbed ? 'watch' : 'readonly';

    const ws = new WebSocket(
      `wss://iblups-viewers-gateway.fly.dev?channel=${username}&mode=${mode}`
    );

    ws.onopen = () => console.log(`🟢 WS (${username}) conectado [${mode}]`);
    ws.onclose = () => console.log(`🔴 WS (${username}) desconectado [${mode}]`);
    ws.onerror = (err) => console.error('⚠️ Error WebSocket:', err);

    const viewerId = crypto.randomUUID();
    const device = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    let country = '??';

    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country) country = data.country;
      })
      .catch(() => {});

    let lastBitrate = 0;
    let lastResolution = '';

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN && mode === 'watch') {
        ws.send(
          JSON.stringify({
            event: 'ping',
            viewer_id: viewerId,
            channel: username,
            device,
            country,
            bitrate: lastBitrate,
            resolution: lastResolution,
            watch_seconds: 30,
          })
        );
      }
    }, 30_000);

    window._iblupsMetrics = {
      updateMetrics: (b: number, r: string) => {
        lastBitrate = b;
        lastResolution = r;
      },
    };

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

  // ⚙️ Inicialización del player
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

        // ⚡ Capturar bitrate y resolución desde el <video> interno de Video.js
        // Modificado por Cursor: Mejorado el método de captura de métricas usando APIs más confiables
        const updateMetrics = () => {
          try {
            // Método 1: Intentar acceder al elemento video nativo
            const videoElement = player.el().querySelector('video') as VideoElementWithQuality | null;
            if (videoElement) {
              const { videoWidth, videoHeight } = videoElement;
              
              // Obtener bitrate usando la API de Video Playback Quality (Chrome/Safari)
              let bitrate = 0;
              const quality = videoElement.getVideoPlaybackQuality?.();
              
              if (quality && quality.totalVideoFrames > 0) {
                // Usar webkitVideoDecodedByteCount si está disponible (Chrome)
                const decodedBytes = videoElement.webkitVideoDecodedByteCount || 0;
                if (decodedBytes > 0 && quality.totalVideoFrames > 0) {
                  // Calcular bitrate promedio: bytes * 8 bits / frames
                  bitrate = Math.round((decodedBytes * 8) / quality.totalVideoFrames);
                }
              }
              
              // Si no hay bitrate calculado, intentar obtener del stream HLS/VHS
              if (bitrate === 0) {
                try {
                  const playerWithVHS = player as PlayerWithVHS;
                  const vhs = playerWithVHS.vhs;
                  if (vhs && vhs.playlists) {
                    const masterPlaylist = vhs.playlists.master;
                    if (masterPlaylist) {
                      const currentPlaylist = vhs.playlists.media?.();
                      if (currentPlaylist?.attributes?.BANDWIDTH) {
                        // Convertir de bps a promedio por frame (aproximado)
                        bitrate = currentPlaylist.attributes.BANDWIDTH / 1000; // en kbps
                      }
                    }
                  }
                } catch {
                  // Ignorar errores de VHS (variable no usada eliminada por Cursor)
                }
              }
              
              if (videoWidth > 0 && videoHeight > 0) {
                window._iblupsMetrics?.updateMetrics(bitrate, `${videoWidth}x${videoHeight}`);
              }
            }
          } catch (err) {
            console.warn('⚠️ Error al obtener métricas:', err);
          }
        };

        // Capturar métricas cuando se carga metadata
        player.on('loadedmetadata', updateMetrics);
        
        // También capturar cuando cambia la calidad del stream HLS
        player.on('loadeddata', updateMetrics);
        
        // Actualizar métricas cada 10s
        const metricsInterval = setInterval(updateMetrics, 10_000);

        (player as VideoJSPlayer)._metricsInterval = metricsInterval;
      }));
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(!!autoplay);
      player.muted(!!muted);
      player.controls(!!controls);
      player.src(options.sources || [{ src: streamUrl, type: 'application/x-mpegURL' }]);
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

  // 🧹 Limpieza completa
  React.useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player) {
        if (player._metricsInterval) {
          clearInterval(player._metricsInterval);
          delete player._metricsInterval;
        }
        if (!player.isDisposed()) {
          player.dispose();
          playerRef.current = null;
        }
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
