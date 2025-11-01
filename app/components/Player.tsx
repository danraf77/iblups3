'use client';

import React from 'react';
import videojs from 'video.js';
import Hls from 'hls.js'; // 👈 añadido para leer bitrate/resolución del stream
import 'video.js/dist/video-js.css';
import '../styles/player.css';

// Modificado por Cursor: Tipos para métricas y extensión del player
type IBlupsMetrics = {
  updateMetrics: (bitrate: number, resolution: string) => void;
};

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
  // Modificado por Cursor: Extensión del player para guardar instancia de HLS.js para métricas
  hlsMetricsInstance?: Hls;
};

// Modificado por Cursor: Extensión de Window para guardar métricas globalmente
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

    // 🧩 Determinar si está en /embed/ o no
    const isEmbed = window.location.pathname.includes('/embed/');
    const mode = isEmbed ? 'watch' : 'readonly';

    // ✅ Conexión WebSocket al Gateway con modo explícito
    const ws = new WebSocket(
      `wss://iblups-viewers-gateway.fly.dev?channel=${username}&mode=${mode}`
    );

    ws.onopen = () => console.log(`🟢 WS (${username}) conectado [${mode}]`);
    ws.onclose = () => console.log(`🔴 WS (${username}) desconectado [${mode}]`);
    ws.onerror = (err) => console.error('⚠️ Error WebSocket:', err);

    // 🆔 ID único por sesión
    const viewerId = crypto.randomUUID();
    const device = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    let country = '??';

    // 🌍 Detectar país vía API interna
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country) country = data.country;
      })
      .catch(() => {});

    // Variables actualizables desde HLS
    let lastBitrate = 0;
    let lastResolution = '';

    // 💓 Enviar ping cada 30s con métricas actuales
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

    // Guardar referencias para actualización posterior
    // Modificado por Cursor: Usar tipo específico en lugar de any
    window._iblupsMetrics = {
      updateMetrics: (b: number, r: string) => {
        lastBitrate = b;
        lastResolution = r;
      },
    };

    // 🧹 Cierre seguro
    const handleClose = () => ws.close();
    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose); // Safari/iOS

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

        // ⚡ Capturar bitrate/resolución en tiempo real con HLS.js (solo para métricas, no para reproducir)
        // Modificado por Cursor: HLS.js usa un elemento de video oculto solo para leer métricas, VideoJS sigue manejando la reproducción
        if (Hls.isSupported() && window._iblupsMetrics) {
          // Crear elemento de video oculto solo para HLS.js (para métricas)
          // Modificado por Cursor: Usar elemento oculto solo para leer manifest, sin reproducir
          const hiddenVideo = document.createElement('video');
          hiddenVideo.style.display = 'none';
          hiddenVideo.style.position = 'absolute';
          hiddenVideo.style.width = '1px';
          hiddenVideo.style.height = '1px';
          hiddenVideo.style.opacity = '0';
          hiddenVideo.style.pointerEvents = 'none';
          hiddenVideo.muted = true;
          hiddenVideo.volume = 0;
          hiddenVideo.playsInline = true;
          document.body.appendChild(hiddenVideo);
          
          // Crear instancia de HLS.js solo para leer métricas del manifest
          const hlsMetrics = new Hls({
            // Configuración mínima solo para leer manifest
            enableWorker: false,
            lowLatencyMode: false,
            autoStartLoad: true, // Modificado por Cursor: Cargar manifest para leer niveles
          });
          
          hlsMetrics.loadSource(streamUrl);
          hlsMetrics.attachMedia(hiddenVideo);
          // Modificado por Cursor: No reproducimos el video oculto, solo leemos el manifest para métricas
          // El elemento de video está oculto y muted, HLS.js solo leerá el manifest sin descargar segmentos grandes
          
          // Escuchar cambios de nivel para actualizar métricas
          hlsMetrics.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            const level = hlsMetrics.levels[data.level];
            if (level && window._iblupsMetrics) {
              window._iblupsMetrics.updateMetrics(
                level.bitrate,
                `${level.width}x${level.height}`
              );
            }
          });
          
          // También obtener métricas iniciales cuando se carga el manifest
          hlsMetrics.on(Hls.Events.MANIFEST_PARSED, () => {
            const currentLevel = hlsMetrics.currentLevel;
            if (currentLevel >= 0 && hlsMetrics.levels[currentLevel]) {
              const level = hlsMetrics.levels[currentLevel];
              if (window._iblupsMetrics) {
                window._iblupsMetrics.updateMetrics(
                  level.bitrate,
                  `${level.width}x${level.height}`
                );
              }
            }
          });
          
          // Guardar referencias para limpieza
          // Modificado por Cursor: Guardar tanto HLS como el elemento de video oculto
          (player as VideoJSPlayer).hlsMetricsInstance = hlsMetrics;
          (player as VideoJSPlayer & { hiddenVideoElement?: HTMLVideoElement }).hiddenVideoElement = hiddenVideo;
        }
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
      if (player) {
        // Limpiar instancia de HLS.js para métricas si existe
        // Modificado por Cursor: Limpiar correctamente la instancia de HLS.js y el elemento de video oculto
        const hlsMetricsInstance = (player as VideoJSPlayer).hlsMetricsInstance;
        const hiddenVideo = (player as VideoJSPlayer & { hiddenVideoElement?: HTMLVideoElement }).hiddenVideoElement;
        
        if (hlsMetricsInstance) {
          hlsMetricsInstance.destroy();
          (player as VideoJSPlayer).hlsMetricsInstance = undefined;
        }
        
        if (hiddenVideo && hiddenVideo.parentNode) {
          hiddenVideo.parentNode.removeChild(hiddenVideo);
          (player as VideoJSPlayer & { hiddenVideoElement?: HTMLVideoElement }).hiddenVideoElement = undefined;
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

export default VideoJS;
