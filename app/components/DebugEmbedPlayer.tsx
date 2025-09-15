'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import '../styles/hls-debug.css';

interface DebugEmbedPlayerProps {
  hlsUrl: string;
  streamId: string;
  hlsBaseUrl: string;
}

export default function DebugEmbedPlayer({ hlsUrl, streamId, hlsBaseUrl }: DebugEmbedPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    duration: 0,
    networkState: 0,
    readyState: 0,
    paused: true,
    muted: true,
    volume: 1,
    playbackRate: 1,
    buffered: 0,
    played: 0,
    seekable: 0
  });

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    addDebugLog('🚀 Inicializando Debug Embed Player...');
    addDebugLog(`📡 HLS URL: ${hlsUrl}`);
    addDebugLog(`🔑 Stream ID: ${streamId}`);
    addDebugLog(`🌐 Base URL: ${hlsBaseUrl}`);

    // Configuración de Video.js
    const videoJsOptions = {
      controls: true,
      autoplay: 'muted',
      muted: true,
      fluid: true,
      responsive: true,
      playsinline: true,
      preload: 'metadata',
      // Usar HLS nativo
      html5: {
        vhs: {
          overrideNative: false
        }
      },
      // Configuración de controlBar personalizada
      controlBar: {
        playToggle: true,
        volumePanel: {
          inline: false
        },
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: false,
        progressControl: false,
        liveDisplay: true,
        remainingTimeDisplay: true,
        customControlSpacer: true,
        fullscreenToggle: true,
        pictureInPictureToggle: false,
        playbackRateMenuButton: false
      },
      // Configuración del botón de play personalizado
      bigPlayButton: {
        inline: false,
        position: 'center'
      }
    };

    addDebugLog('⚙️ Configurando Video.js...');

    // Inicializar Video.js
    const player = videojs(videoRef.current, videoJsOptions);
    playerRef.current = player;

    // Configurar eventos del player
    player.ready(() => {
      setIsLoading(false);
      addDebugLog('✅ Video.js player ready');
    });

    player.on('error', (error: Error) => {
      console.error('Video.js error:', error);
      addDebugLog(`❌ Video.js error: ${error.message}`);
      setError('Error de reproducción');
      setIsLoading(false);
    });

    player.on('loadstart', () => {
      setIsLoading(true);
      setError(null);
      addDebugLog('🔄 loadstart - Iniciando carga');
    });

    player.on('canplay', () => {
      setIsLoading(false);
      addDebugLog('✅ canplay - Video listo para reproducir');
      // Forzar reproducción cuando el video esté listo
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          addDebugLog(`❌ Error en play: ${err.message}`);
        });
      }
    });

    player.on('play', () => {
      addDebugLog('▶️ play - Reproducción iniciada');
      setPlayerState(prev => ({ ...prev, paused: false }));
    });

    player.on('pause', () => {
      addDebugLog('⏸️ pause - Reproducción pausada');
      setPlayerState(prev => ({ ...prev, paused: true }));
    });

    player.on('timeupdate', () => {
      if (videoRef.current) {
        setPlayerState(prev => ({
          ...prev,
          currentTime: videoRef.current!.currentTime,
          duration: videoRef.current!.duration,
          networkState: videoRef.current!.networkState,
          readyState: videoRef.current!.readyState,
          muted: videoRef.current!.muted,
          volume: videoRef.current!.volume,
          playbackRate: videoRef.current!.playbackRate,
          buffered: videoRef.current!.buffered.length > 0 ? videoRef.current!.buffered.end(0) : 0,
          played: videoRef.current!.played.length > 0 ? videoRef.current!.played.end(0) : 0,
          seekable: videoRef.current!.seekable.length > 0 ? videoRef.current!.seekable.end(0) : 0
        }));
      }
    });

    // Usar HLS nativo (más confiable)
    videoRef.current!.src = hlsUrl;
    addDebugLog('🎯 Usando HLS nativo');
    
    // Forzar reproducción si autoplay está habilitado
    setTimeout(() => {
      if (videoRef.current) {
        addDebugLog('🔄 Intentando autoplay...');
        videoRef.current.play().catch((err) => {
          addDebugLog(`❌ Autoplay falló: ${err.message}`);
        });
      }
    }, 100);

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [hlsUrl, streamId, hlsBaseUrl]);

  // Actualizar src cuando cambie
  useEffect(() => {
    if (!playerRef.current || !hlsUrl) return;
    playerRef.current.src(hlsUrl);
    addDebugLog(`🔄 Cambiando src a: ${hlsUrl}`);
  }, [hlsUrl]);

  return (
    <div className="hls-debug-container">
      {/* Video Player */}
      <div className="hls-debug-video-container">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin hls-debug-video"
          playsInline
          preload="metadata"
          data-setup="{}"
        />
        
        {/* Loading spinner personalizado */}
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

      {/* Debug Panel */}
      <div className="hls-debug-panel">
        <div className="hls-debug-header">
          <h3 className="hls-debug-title">🔍 Debug Embed Player</h3>
          <div className="hls-debug-buttons">
            <button
              onClick={clearDebug}
              className="hls-debug-button hls-debug-button-danger"
            >
              🗑️ Limpiar Logs
            </button>
          </div>
        </div>

        {/* Player State */}
        <div className="hls-debug-state">
          <div className="hls-debug-state-item">
            <span className="hls-debug-state-label">Estado:</span>
            <span className={`hls-debug-state-value ${playerState.paused ? 'text-yellow-400' : 'text-green-400'}`}>
              {playerState.paused ? '⏸️ Pausado' : '▶️ Reproduciendo'}
            </span>
          </div>
          <div className="hls-debug-state-item">
            <span className="hls-debug-state-label">Tiempo:</span>
            <span className="hls-debug-state-value">
              {Math.floor(playerState.currentTime)}s / {Math.floor(playerState.duration)}s
            </span>
          </div>
          <div className="hls-debug-state-item">
            <span className="hls-debug-state-label">Volumen:</span>
            <span className="hls-debug-state-value">
              {Math.round(playerState.volume * 100)}% {playerState.muted ? '(Silenciado)' : ''}
            </span>
          </div>
          <div className="hls-debug-state-item">
            <span className="hls-debug-state-label">Velocidad:</span>
            <span className="hls-debug-state-value">
              {playerState.playbackRate}x
            </span>
          </div>
          <div className="hls-debug-state-item">
            <span className="hls-debug-state-label">Buffer:</span>
            <span className="hls-debug-state-value">
              {Math.floor(playerState.buffered)}s
            </span>
          </div>
          <div className="hls-debug-state-item">
            <span className="hls-debug-state-label">Network:</span>
            <span className="hls-debug-state-value">
              {playerState.networkState} (Ready: {playerState.readyState})
            </span>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="hls-debug-logs">
          {debugInfo.length === 0 ? (
            <div>
              <div className="hls-debug-log-empty">Esperando eventos del player...</div>
              <div className="hls-debug-log hls-debug-log-info">📜 SCROLL TEST - Esta área tiene scroll vertical</div>
              <div className="hls-debug-log hls-debug-log-info">📜 SCROLL TEST - Deberías poder hacer scroll hacia abajo</div>
              <div className="hls-debug-log hls-debug-log-info">📜 SCROLL TEST - El scrollbar debería ser verde y visible</div>
            </div>
          ) : (
            debugInfo.map((log, index) => (
              <div key={index} className="hls-debug-log hls-debug-log-info">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
