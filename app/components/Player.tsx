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
type VideoElementWithQuality = HTMLVideoElement & {
  getVideoPlaybackQuality?: () => {
    totalVideoFrames: number;
    droppedVideoFrames: number;
    corruptedVideoFrames: number;
  };
  webkitVideoDecodedByteCount?: number;
};

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
  masterPlaylistLoader?: {
    master?: {
      playlists?: Array<{
        attributes?: {
          BANDWIDTH?: number;
          RESOLUTION?: string;
          WIDTH?: number;
          HEIGHT?: number;
        };
      }>;
    };
  };
}

interface PlayerWithVHS extends VideoJSPlayer {
  vhs?: {
    playlists?: VHSPlaylist;
    master?: {
      playlists?: Array<{
        attributes?: {
          BANDWIDTH?: number;
          RESOLUTION?: string;
          WIDTH?: number;
          HEIGHT?: number;
        };
      }>;
    };
  };
  tech?: {
    vhs?: {
      masterPlaylistLoader?: {
        master?: {
          playlists?: Array<{
            attributes?: {
              BANDWIDTH?: number;
              RESOLUTION?: string;
              WIDTH?: number;
              HEIGHT?: number;
            };
          }>;
        };
      };
    };
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
  el: () => Element;
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

  // 🎯 Tracking silencioso de viewers (modo inteligente + métricas) - MEJORADO
  React.useEffect(() => {
    const path = window.location.pathname.split('/');
    const username = path[path.length - 1];
    if (!username) return;

    const isEmbed = window.location.pathname.includes('/embed/');
    const mode = isEmbed ? 'watch' : 'readonly';
    const viewerId = crypto.randomUUID();
    const device = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    
    let country = '??';
    let lastBitrate = 0;
    let lastResolution = '';
    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    // ✅ Función para obtener fallback de país desde timezone
    const getCountryFromTimezone = (): string => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Mapeo básico de timezones a países
        if (tz.includes('Lima')) return 'PE';
        if (tz.includes('Mexico')) return 'MX';
        if (tz.includes('Argentina')) return 'AR';
        if (tz.includes('Bogota')) return 'CO';
        if (tz.includes('Santiago')) return 'CL';
        if (tz.includes('Caracas')) return 'VE';
        if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles')) return 'US';
        if (tz.includes('Madrid') || tz.includes('Barcelona')) return 'ES';
        if (tz.includes('London')) return 'GB';
        if (tz.includes('Paris')) return 'FR';
        if (tz.includes('Berlin')) return 'DE';
        if (tz.includes('Rome')) return 'IT';
        if (tz.includes('Tokyo')) return 'JP';
        if (tz.includes('Shanghai') || tz.includes('Hong_Kong')) return 'CN';
        if (tz.includes('Sydney') || tz.includes('Melbourne')) return 'AU';
        if (tz.includes('Sao_Paulo')) return 'BR';
      } catch {
        // Ignorar errores
      }
      return '??';
    };

    // ✅ Inicialización asíncrona mejorada - Optimizado para mobile
    // Cambio realizado por Cursor: timeout más largo en mobile y mejor manejo de errores
    const initializeTracking = async () => {
      // Paso 1: Obtener país ANTES de conectar WebSocket
      try {
        const controller = new AbortController();
        // Timeout más largo en mobile (conexiones más lentas)
        const geoTimeout = device === 'mobile' ? 8000 : 5000; // 8s mobile, 5s desktop
        const timeoutId = setTimeout(() => controller.abort(), geoTimeout);

        const geoRes = await fetch('/api/geo', {
          signal: controller.signal,
          cache: 'no-store',
        });

        clearTimeout(timeoutId);

        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data?.country && data.country !== '??') {
            country = data.country;
            console.log(`📍 Geo obtenido desde API (${device}):`, country);
          } else {
            // Si la API devuelve '??', usar fallback inmediatamente
            country = getCountryFromTimezone();
            console.log(`📍 Geo desde timezone fallback (${device}):`, country);
          }
        } else {
          // Si la respuesta no es OK, usar fallback
          country = getCountryFromTimezone();
          console.log(`📍 Geo desde timezone (API error) (${device}):`, country);
        }
      } catch (error) {
        console.warn(`⚠️ Error obteniendo geo (${device}), usando fallback:`, error);
        // Fallback: intentar desde timezone
        country = getCountryFromTimezone();
        console.log(`📍 Geo desde timezone (${device}):`, country);
      }

      // Paso 2: Conectar WebSocket con país ya detectado
      ws = new WebSocket(
        `wss://iblups-viewers-gateway.fly.dev?channel=${username}&mode=${mode}`
      );

      ws.onopen = () => {
        console.log(`🟢 WS (${username}) conectado [${mode}] - País: ${country}, Device: ${device}`);
      };

      ws.onclose = () => {
        console.log(`🔴 WS (${username}) desconectado [${mode}]`);
      };

      ws.onerror = (err) => {
        console.error('⚠️ Error WebSocket:', err);
      };

      // Paso 3: Configurar pings cada 30s
      pingInterval = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN && mode === 'watch') {
          const payload = {
            event: 'ping',
            viewer_id: viewerId,
            channel: username,
            device,
            country,
            bitrate: lastBitrate,
            resolution: lastResolution,
            watch_seconds: 30,
          };

          console.log('📤 Ping enviado:', payload);
          ws.send(JSON.stringify(payload));
        }
      }, 30_000);
    };

    // ✅ Interfaz global para actualizar métricas
    window._iblupsMetrics = {
      updateMetrics: (b: number, r: string) => {
        // Solo actualizar si los valores son válidos
        if (b > 0 && r && r !== '0x0') {
          lastBitrate = b;
          lastResolution = r;
          console.log('📊 Métricas actualizadas:', { bitrate: b, resolution: r, device });
        }
      },
    };

    // Iniciar tracking
    initializeTracking();

    // Cleanup al desmontar o cerrar página
    const handleClose = () => {
      if (ws) {
        console.log('🔌 Cerrando conexión WebSocket...');
        ws.close();
      }
    };

    window.addEventListener('beforeunload', handleClose);
    window.addEventListener('pagehide', handleClose);

    return () => {
      if (pingInterval) clearInterval(pingInterval);
      if (ws) ws.close();
      window.removeEventListener('beforeunload', handleClose);
      window.removeEventListener('pagehide', handleClose);
      delete window._iblupsMetrics;
    };
  }, []);

  // ⚙️ Inicialización del player - MEJORADO
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

        // ✅ Detectar device para métricas (importante para mobile)
        // Cambio realizado por Cursor: detectar device dentro del scope del player
        const currentDevice = /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

        // ⚡ Captura de métricas mejorada para mobile y desktop - Optimizado para mobile
        // Cambio realizado por Cursor: mejor acceso a VHS playlist y más métodos de fallback para mobile
        const updateMetrics = () => {
          try {
            const videoElement = player.el().querySelector('video') as VideoElementWithQuality | null;
            if (!videoElement) {
              if (currentDevice === 'mobile') {
                console.warn('⚠️ No se encontró elemento video (mobile) - reintentando...');
              }
              return;
            }

            const { videoWidth, videoHeight } = videoElement;

            // Validar que tenemos dimensiones - más permisivo en mobile (valores pequeños pueden ser válidos durante carga)
            if (!videoWidth || !videoHeight || videoWidth === 0 || videoHeight === 0) {
              if (currentDevice === 'mobile') {
                // En mobile, esperar más tiempo antes de reportar error
                console.warn('⚠️ Video sin dimensiones válidas todavía (mobile)');
              }
              return;
            }

            let bitrate = 0;

            // Método 1: API de Video Playback Quality (Chrome/Edge/Android)
            const quality = videoElement.getVideoPlaybackQuality?.();
            if (quality && quality.totalVideoFrames > 0) {
              const decodedBytes = videoElement.webkitVideoDecodedByteCount || 0;
              if (decodedBytes > 0) {
                // Calcular bitrate promedio: (bytes * 8 bits) / frames
                bitrate = Math.round((decodedBytes * 8) / quality.totalVideoFrames);
                console.log(`✅ Bitrate desde webkitVideoDecodedByteCount (${currentDevice}):`, bitrate);
              }
            }

            // Método 2: Obtener del HLS/VHS (más confiable en Safari/iOS/mobile)
            if (bitrate === 0) {
              try {
                const playerWithVHS = player as PlayerWithVHS;
                
                // Intentar múltiples rutas de acceso al VHS playlist (importante para mobile)
                // Ruta 1: vhs.playlists.media() (método estándar)
                if (playerWithVHS.vhs?.playlists) {
                  const currentPlaylist = playerWithVHS.vhs.playlists.media?.();
                  if (currentPlaylist?.attributes?.BANDWIDTH) {
                    bitrate = Math.round(currentPlaylist.attributes.BANDWIDTH / 1000);
                    console.log(`✅ Bitrate desde HLS bandwidth (ruta 1) (${currentDevice}):`, bitrate);
                  }
                }

                // Ruta 2: vhs.master.playlists (para master playlist)
                if (bitrate === 0 && playerWithVHS.vhs?.master?.playlists) {
                  const activePlaylist = playerWithVHS.vhs.master.playlists.find(
                    (p: { attributes?: { BANDWIDTH?: number } }) => p?.attributes?.BANDWIDTH
                  );
                  if (activePlaylist?.attributes?.BANDWIDTH) {
                    bitrate = Math.round(activePlaylist.attributes.BANDWIDTH / 1000);
                    console.log(`✅ Bitrate desde master playlist (ruta 2) (${currentDevice}):`, bitrate);
                  }
                }

                // Ruta 3: tech.vhs.masterPlaylistLoader (método alternativo para mobile)
                if (bitrate === 0 && playerWithVHS.tech?.vhs?.masterPlaylistLoader?.master?.playlists) {
                  const activePlaylist = playerWithVHS.tech.vhs.masterPlaylistLoader.master.playlists.find(
                    (p: { attributes?: { BANDWIDTH?: number } }) => p?.attributes?.BANDWIDTH
                  );
                  if (activePlaylist?.attributes?.BANDWIDTH) {
                    bitrate = Math.round(activePlaylist.attributes.BANDWIDTH / 1000);
                    console.log(`✅ Bitrate desde masterPlaylistLoader (ruta 3) (${currentDevice}):`, bitrate);
                  }
                }

                // Ruta 4: vhs.playlists.masterPlaylistLoader (otro método alternativo)
                if (bitrate === 0 && playerWithVHS.vhs?.playlists?.masterPlaylistLoader?.master?.playlists) {
                  const activePlaylist = playerWithVHS.vhs.playlists.masterPlaylistLoader.master.playlists.find(
                    (p: { attributes?: { BANDWIDTH?: number } }) => p?.attributes?.BANDWIDTH
                  );
                  if (activePlaylist?.attributes?.BANDWIDTH) {
                    bitrate = Math.round(activePlaylist.attributes.BANDWIDTH / 1000);
                    console.log(`✅ Bitrate desde playlists.masterPlaylistLoader (ruta 4) (${currentDevice}):`, bitrate);
                  }
                }
              } catch (vhsError) {
                console.warn(`⚠️ Error accediendo VHS (${currentDevice}):`, vhsError);
              }
            }

            // Método 3: Estimación basada en resolución (último recurso - especialmente útil en mobile)
            if (bitrate === 0) {
              if (videoHeight >= 2160) bitrate = 15000; // 4K ~ 15 Mbps
              else if (videoHeight >= 1440) bitrate = 8000; // 1440p ~ 8 Mbps
              else if (videoHeight >= 1080) bitrate = 4500; // 1080p ~ 4.5 Mbps
              else if (videoHeight >= 720) bitrate = 2500; // 720p ~ 2.5 Mbps
              else if (videoHeight >= 480) bitrate = 1200; // 480p ~ 1.2 Mbps
              else if (videoHeight >= 360) bitrate = 800; // 360p ~ 800 kbps
              else bitrate = 500; // 240p ~ 500 kbps

              console.log(`ℹ️ Bitrate estimado por resolución (${videoHeight}p) (${currentDevice}):`, bitrate);
            }

            const resolution = `${videoWidth}x${videoHeight}`;
            console.log(`📊 Métricas finales (${currentDevice}):`, { bitrate, resolution });

            // Actualizar métricas globales
            window._iblupsMetrics?.updateMetrics(bitrate, resolution);

          } catch (err) {
            console.error(`❌ Error capturando métricas (${currentDevice}):`, err);
          }
        };

        // ✅ Múltiples eventos para captura (especialmente importante en mobile)
        player.on('loadedmetadata', () => {
          console.log('🎬 Evento: loadedmetadata');
          updateMetrics();
        });

        player.on('loadeddata', () => {
          console.log('🎬 Evento: loadeddata');
          updateMetrics();
        });

        player.on('canplay', () => {
          console.log('🎬 Evento: canplay');
          updateMetrics();
        });

        player.on('playing', () => {
          console.log('🎬 Evento: playing');
          updateMetrics();
        });

        // ✅ Checks iniciales más frecuentes (útil en mobile donde tarda más)
        // Cambio realizado por Cursor: más checks iniciales en mobile y intervalo más frecuente
        const isMobile = /mobile/i.test(navigator.userAgent);
        const initialCheckCount = isMobile ? 8 : 5; // Más checks en mobile
        const initialCheckInterval = isMobile ? 1500 : 2000; // Más frecuente en mobile (1.5s vs 2s)
        const regularCheckInterval = isMobile ? 8000 : 10000; // Cada 8s en mobile, 10s en desktop

        let initialChecks = 0;
        const initialInterval = setInterval(() => {
          console.log(`🔄 Check inicial #${initialChecks + 1} (${isMobile ? 'mobile' : 'desktop'})`);
          updateMetrics();
          initialChecks++;

          // Cambiar a intervalo regular después de checks iniciales
          if (initialChecks >= initialCheckCount) {
            clearInterval(initialInterval);
            console.log(`✅ Checks iniciales completados, cambiando a intervalo regular (${regularCheckInterval / 1000}s)`);
            
            // Intervalo regular (más frecuente en mobile)
            const regularInterval = setInterval(() => {
              updateMetrics();
            }, regularCheckInterval);

            (player as VideoJSPlayer)._metricsInterval = regularInterval;
          }
        }, initialCheckInterval);

        // Guardar referencia al intervalo inicial
        (player as VideoJSPlayer)._metricsInterval = initialInterval;
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
    logoLink.rel = 'noopener noreferrer';
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