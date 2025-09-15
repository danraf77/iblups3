'use client';

import { useEffect, useRef, useState } from 'react';

interface DebugHlsPlayerProps {
  hlsUrl: string;
  streamId: string;
  hlsBaseUrl: string;
}

export default function DebugHlsPlayer({ hlsUrl, streamId, hlsBaseUrl }: DebugHlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [networkState, setNetworkState] = useState<number | null>(null);
  const [readyState, setReadyState] = useState<number | null>(null);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[HLS Debug] ${message}`);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    addDebugLog('Inicializando player de debug...');
    addDebugLog(`HLS URL: ${hlsUrl}`);
    addDebugLog(`Stream ID: ${streamId}`);
    addDebugLog(`HLS Base URL: ${hlsBaseUrl}`);

    // Eventos del video
    const handleLoadStart = () => {
      addDebugLog('🔄 loadstart - Iniciando carga del video');
    };

    const handleLoadedMetadata = () => {
      addDebugLog('📊 loadedmetadata - Metadatos cargados');
      setDuration(video.duration);
      addDebugLog(`Duración: ${video.duration} segundos`);
    };

    const handleLoadedData = () => {
      addDebugLog('📦 loadeddata - Datos del video cargados');
    };

    const handleCanPlay = () => {
      addDebugLog('▶️ canplay - Video listo para reproducir');
      setReadyState(video.readyState);
    };

    const handleCanPlayThrough = () => {
      addDebugLog('✅ canplaythrough - Video listo para reproducir sin interrupciones');
    };

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
    };

    const handleError = (e: Event) => {
      const error = video.error;
      if (error) {
        let errorMessage = `❌ Error del video: ${error.code}`;
        switch (error.code) {
          case 1:
            errorMessage += ' - MEDIA_ERR_ABORTED (Operación abortada)';
            break;
          case 2:
            errorMessage += ' - MEDIA_ERR_NETWORK (Error de red)';
            break;
          case 3:
            errorMessage += ' - MEDIA_ERR_DECODE (Error de decodificación)';
            break;
          case 4:
            errorMessage += ' - MEDIA_ERR_SRC_NOT_SUPPORTED (Fuente no soportada)';
            break;
        }
        addDebugLog(errorMessage);
        setError(errorMessage);
      }
    };

    const handleWaiting = () => {
      addDebugLog('⏳ waiting - Esperando datos del video');
    };

    const handleStalled = () => {
      addDebugLog('🔄 stalled - Descarga del video estancada');
    };

    const handleSuspend = () => {
      addDebugLog('⏸️ suspend - Descarga del video suspendida');
    };

    const handleAbort = () => {
      addDebugLog('❌ abort - Descarga del video abortada');
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        addDebugLog(`📈 progress - Buffer: ${bufferedEnd.toFixed(2)}s`);
      }
    };

    const handleRateChange = () => {
      addDebugLog(`⚡ ratechange - Velocidad de reproducción: ${video.playbackRate}x`);
    };

    const handleVolumeChange = () => {
      addDebugLog(`🔊 volumechange - Volumen: ${video.volume}, Muted: ${video.muted}`);
    };

    const handleSeeking = () => {
      addDebugLog('🔍 seeking - Buscando posición en el video');
    };

    const handleSeeked = () => {
      addDebugLog('✅ seeked - Búsqueda completada');
    };

    const handleEnded = () => {
      addDebugLog('🏁 ended - Video terminado');
      setIsPlaying(false);
    };

    const handleEmptied = () => {
      addDebugLog('🗑️ emptied - Video vaciado');
    };

    const handleLoadStart2 = () => {
      addDebugLog('🔄 loadstart (2) - Iniciando carga del video (segunda vez)');
    };

    // Agregar todos los event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('suspend', handleSuspend);
    video.addEventListener('abort', handleAbort);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('emptied', handleEmptied);

    // Intentar reproducir automáticamente
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

    // Esperar un poco y luego intentar autoplay
    const timeoutId = setTimeout(tryAutoplay, 1000);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('suspend', handleSuspend);
      video.removeEventListener('abort', handleAbort);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('emptied', handleEmptied);
    };
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
    <div className="w-full">
      {/* Video Player */}
      <div className="relative bg-black mb-4">
        <video
          ref={videoRef}
          className="w-full h-auto"
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
          style={{ aspectRatio: '16/9' }}
        >
          <source src={hlsUrl} type="application/x-mpegURL" />
          <p className="text-white p-4 text-center">
            Tu navegador no soporta la reproducción de video HLS.
          </p>
        </video>
      </div>

      {/* Debug Panel */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">🔍 Debug del Player</h3>
          <button
            onClick={clearDebug}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Limpiar Logs
          </button>
        </div>

        {/* Status Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Estado:</div>
            <div className="text-white">{isPlaying ? '▶️ Reproduciendo' : '⏸️ Pausado'}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Tiempo:</div>
            <div className="text-white">{currentTime.toFixed(1)}s / {duration.toFixed(1)}s</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Network State:</div>
            <div className="text-white">{networkState !== null ? networkState : 'N/A'}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Ready State:</div>
            <div className="text-white">{readyState !== null ? readyState : 'N/A'}</div>
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
        <div className="bg-black rounded p-3 max-h-64 overflow-y-auto">
          <div className="text-green-400 text-xs font-mono">
            {debugInfo.length === 0 ? (
              <div className="text-gray-500">Esperando eventos del player...</div>
            ) : (
              debugInfo.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manual Play Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handlePlayClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ▶️ Reproducir Manualmente
          </button>
        </div>
      </div>
    </div>
  );
}

// Comentario: Componente de debug creado con Cursor
// - Player HTML5 con eventos de debug completos
// - Logs en tiempo real de todos los eventos del video
// - Información de estado del player
// - Botón de reproducción manual
// - Panel de debug con scroll para logs largos
