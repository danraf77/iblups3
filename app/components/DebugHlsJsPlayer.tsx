'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import '../styles/hls-debug.css';

interface DebugHlsJsPlayerProps {
  hlsUrl: string;
  streamId: string;
  hlsBaseUrl: string;
}

export default function DebugHlsJsPlayer({ hlsUrl, streamId, hlsBaseUrl }: DebugHlsJsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hlsStats, setHlsStats] = useState<Record<string, unknown> | null>(null);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[HLS.js Debug] ${message}`);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    addDebugLog('Inicializando player HLS.js...');
    addDebugLog(`HLS URL: ${hlsUrl}`);
    addDebugLog(`Stream ID: ${streamId}`);
    addDebugLog(`HLS Base URL: ${hlsBaseUrl}`);

    // Verificar soporte de HLS.js
    if (Hls.isSupported()) {
      addDebugLog('✅ HLS.js soportado en este navegador');
      
      const hls = new Hls({
        debug: true,
        enableWorker: true,
        xhrSetup: (xhr, url) => {
          addDebugLog(`🌐 Configurando XHR para: ${url}`);
          xhr.setRequestHeader('Referer', 'https://iblups.com');
          xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (compatible; HLS.js)');
        }
      });

      hlsRef.current = hls;

      // Eventos de HLS.js
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        addDebugLog('📎 MEDIA_ATTACHED - Media adjuntado');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        addDebugLog('📋 MANIFEST_PARSED - Manifesto parseado');
        addDebugLog(`Niveles disponibles: ${data.levels.length}`);
        addDebugLog(`Formato: ${data.levels[0]?.codecs || 'N/A'}`);
        addDebugLog(`Resolución: ${data.levels[0]?.width}x${data.levels[0]?.height || 'N/A'}`);
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        addDebugLog(`📊 LEVEL_LOADED - Nivel cargado: ${data.details.live ? 'LIVE' : 'VOD'}`);
        addDebugLog(`Duración: ${data.details.totalduration || 'N/A'}s`);
        addDebugLog(`Segmentos: ${data.details.fragments.length}`);
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        addDebugLog(`📦 FRAG_LOADED - Fragmento cargado: ${data.frag.sn}`);
      });

      hls.on(Hls.Events.FRAG_PARSED, (event, data) => {
        addDebugLog(`🔍 FRAG_PARSED - Fragmento parseado: ${data.frag.sn}`);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        addDebugLog(`🔄 LEVEL_SWITCHED - Cambio de nivel: ${data.level}`);
      });

      hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
        addDebugLog(`📈 BUFFER_APPENDED - Buffer actualizado`);
      });

      hls.on(Hls.Events.BUFFER_FLUSHED, (event, data) => {
        addDebugLog(`🗑️ BUFFER_FLUSHED - Buffer limpiado`);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        let errorMessage = `❌ Error HLS.js: ${data.type}`;
        if (data.details) {
          errorMessage += ` - ${data.details}`;
        }
        if (data.fatal) {
          errorMessage += ' (FATAL)';
          addDebugLog(errorMessage);
          setError(errorMessage);
          
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              addDebugLog('🔄 Intentando recuperación de error de red...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              addDebugLog('🔄 Intentando recuperación de error de media...');
              hls.recoverMediaError();
              break;
            default:
              addDebugLog('❌ Error fatal, no se puede recuperar');
              hls.destroy();
              break;
          }
        } else {
          addDebugLog(errorMessage);
        }
      });

      hls.on(Hls.Events.DESTROYING, () => {
        addDebugLog('🗑️ DESTROYING - Destruyendo HLS.js');
      });

      // Adjuntar media y cargar fuente
      hls.attachMedia(video);
      hls.loadSource(hlsUrl);

      // Eventos del video
      const handlePlay = () => {
        addDebugLog('▶️ play - Reproducción iniciada');
        setIsPlaying(true);
      };

      const handlePause = () => {
        addDebugLog('⏸️ pause - Reproducción pausada');
        setIsPlaying(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
      };

      const handleError = (e: Event) => {
        const error = video.error;
        if (error) {
          let errorMessage = `❌ Error del video: ${error.code}`;
          switch (error.code) {
            case 1:
              errorMessage += ' - MEDIA_ERR_ABORTED';
              break;
            case 2:
              errorMessage += ' - MEDIA_ERR_NETWORK';
              break;
            case 3:
              errorMessage += ' - MEDIA_ERR_DECODE';
              break;
            case 4:
              errorMessage += ' - MEDIA_ERR_SRC_NOT_SUPPORTED';
              break;
          }
          addDebugLog(errorMessage);
          setError(errorMessage);
        }
      };

      const handleLoadedMetadata = () => {
        addDebugLog('📊 loadedmetadata - Metadatos cargados');
        setDuration(video.duration);
      };

      const handleCanPlay = () => {
        addDebugLog('▶️ canplay - Video listo para reproducir');
      };

      const handleWaiting = () => {
        addDebugLog('⏳ waiting - Esperando datos');
      };

      const handleStalled = () => {
        addDebugLog('🔄 stalled - Descarga estancada');
      };

      const handleProgress = () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          addDebugLog(`📈 progress - Buffer: ${bufferedEnd.toFixed(2)}s`);
        }
      };

      // Agregar event listeners del video
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('error', handleError);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('stalled', handleStalled);
      video.addEventListener('progress', handleProgress);

      // Intentar autoplay
      const tryAutoplay = async () => {
        try {
          addDebugLog('🎬 Intentando autoplay...');
          await video.play();
          addDebugLog('✅ Autoplay exitoso');
        } catch (err) {
          addDebugLog(`❌ Autoplay falló: ${err}`);
          setError(`Autoplay falló: ${err}`);
        }
      };

      const timeoutId = setTimeout(tryAutoplay, 2000);

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('progress', handleProgress);
        
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      addDebugLog('✅ HLS nativo soportado (Safari/Edge)');
      video.src = hlsUrl;
      
      const tryAutoplay = async () => {
        try {
          addDebugLog('🎬 Intentando autoplay nativo...');
          await video.play();
          addDebugLog('✅ Autoplay nativo exitoso');
        } catch (err) {
          addDebugLog(`❌ Autoplay nativo falló: ${err}`);
          setError(`Autoplay nativo falló: ${err}`);
        }
      };

      const timeoutId = setTimeout(tryAutoplay, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      addDebugLog('❌ HLS no soportado en este navegador');
      setError('HLS no soportado en este navegador');
    }
  }, [hlsUrl, streamId, hlsBaseUrl]);

  const handlePlayClick = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        addDebugLog('🎬 Click en play...');
        await video.play();
      } catch (err) {
        addDebugLog(`❌ Error al reproducir: ${err}`);
        setError(`Error al reproducir: ${err}`);
      }
    }
  };

  const clearDebug = () => {
    setDebugInfo([]);
    setError(null);
  };

  return (
    <div className="hls-debug-container">
      {/* Video Player */}
      <div className={`hls-debug-video-container ${error ? 'error' : ''}`}>
        <video
          ref={videoRef}
          className="hls-debug-video"
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
        >
          <source src={hlsUrl} type="application/x-mpegURL" />
          <p className="text-white p-4 text-center">
            Tu navegador no soporta la reproducción de video HLS.
          </p>
        </video>
      </div>

      {/* Debug Panel */}
      <div className="hls-debug-panel">
        <div className="hls-debug-header">
          <h3 className="hls-debug-title">🔍 Debug HLS.js</h3>
          <div className="hls-debug-buttons">
            <button
              onClick={clearDebug}
              className="hls-debug-btn hls-debug-btn-clear"
            >
              Limpiar Logs
            </button>
            <button
              onClick={handlePlayClick}
              className="hls-debug-btn hls-debug-btn-play"
            >
              ▶️ Reproducir
            </button>
          </div>
        </div>

        {/* Status Info */}
        <div className="hls-debug-stats">
          <div className="hls-debug-stat">
            <div className="hls-debug-stat-label">Estado</div>
            <div className="hls-debug-stat-value">
              {isPlaying ? '▶️ Reproduciendo' : '⏸️ Pausado'}
            </div>
          </div>
          <div className="hls-debug-stat">
            <div className="hls-debug-stat-label">Tiempo</div>
            <div className="hls-debug-stat-value">
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </div>
          </div>
          <div className="hls-debug-stat">
            <div className="hls-debug-stat-label">HLS.js</div>
            <div className="hls-debug-stat-value">
              {Hls.isSupported() ? '✅ Soportado' : '❌ No soportado'}
            </div>
          </div>
          <div className="hls-debug-stat">
            <div className="hls-debug-stat-label">Nativo</div>
            <div className="hls-debug-stat-value">
              {videoRef.current?.canPlayType('application/vnd.apple.mpegurl') ? '✅ Soportado' : '❌ No soportado'}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-500 rounded p-3 mb-4">
            <div className="text-red-300 font-semibold">❌ Error:</div>
            <div className="text-red-200 text-sm">{error}</div>
          </div>
        )}

        {/* Debug Logs */}
        <div className="hls-debug-logs">
          {debugInfo.length === 0 ? (
            <div>
              <div className="hls-debug-log-empty">Esperando eventos del player...</div>
              <div className="hls-debug-log hls-debug-log-info">📜 SCROLL TEST - Esta área tiene scroll vertical</div>
              <div className="hls-debug-log hls-debug-log-info">📜 SCROLL TEST - Deberías poder hacer scroll hacia abajo</div>
              <div className="hls-debug-log hls-debug-log-info">📜 SCROLL TEST - El scrollbar debería ser verde y visible</div>
              {/* Contenido de prueba para scroll */}
              <div className="hls-debug-log hls-debug-log-info">[12:00:00] 🚀 Inicializando player HLS.js...</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:01] 📡 HLS URL: https://live-stream.iblups.com/dev/68fe7d84cbd05c3c32e1e31b35931a691d59df16.m3u8</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:02] 🆔 Stream ID: 68fe7d84cbd05c3c32e1e31b35931a691d59df16</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:03] ✅ HLS.js soportado en este navegador</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:04] 🔄 loadstart - Iniciando carga del video</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:05] 📊 loadedmetadata - Metadatos cargados</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:06] 📦 loadeddata - Datos del video cargados</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:07] ▶️ canplay - Listo para reproducir</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:08] ▶️ play - Reproduciendo</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:09] 🎬 MANIFEST_PARSED - Manifesto HLS cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:10] 📺 LEVEL_LOADED - Nivel de calidad cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:11] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:12] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:13] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:14] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:15] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:16] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:17] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:18] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:19] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:20] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:21] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:22] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:23] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:24] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:25] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:26] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:27] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:28] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:29] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:30] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:31] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:32] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:33] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:34] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:35] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:36] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:37] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:38] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:39] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:40] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:41] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:42] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:43] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:44] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:45] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:46] 📊 STATS - Estadísticas del player</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:47] 🔄 FRAG_LOADED - Fragmento cargado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:48] ⚡ BUFFER_APPENDED - Buffer actualizado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:49] 🎯 FRAG_PARSED - Fragmento parseado</div>
              <div className="hls-debug-log hls-debug-log-info">[12:00:50] 📊 STATS - Estadísticas del player</div>
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

// Comentario: Componente de debug HLS.js creado con Cursor
// - Player con hls.js para máxima compatibilidad
// - Debug completo de eventos HLS.js y video
// - Configuración optimizada para streams en vivo
// - Headers personalizados para CORS
// - Fallback a HLS nativo en Safari/Edge
