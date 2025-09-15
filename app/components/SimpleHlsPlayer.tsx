'use client';

import { useEffect, useRef, useState } from 'react';

interface SimpleHlsPlayerProps {
  hlsUrl: string;
  streamId: string;
  hlsBaseUrl: string;
}

export default function SimpleHlsPlayer({ hlsUrl, streamId, hlsBaseUrl }: SimpleHlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMessage].slice(-20)); // Mantener solo los últimos 20 logs
    console.log(`[SimpleHLS] ${message}`);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    addLog('🚀 Inicializando player simple...');
    addLog(`📡 HLS URL: ${hlsUrl}`);
    addLog(`🆔 Stream ID: ${streamId}`);

    // Eventos del video
    const handleLoadStart = () => addLog('🔄 loadstart - Iniciando carga');
    const handleLoadedMetadata = () => addLog('📊 loadedmetadata - Metadatos cargados');
    const handleLoadedData = () => addLog('📦 loadeddata - Datos cargados');
    const handleCanPlay = () => addLog('▶️ canplay - Listo para reproducir');
    const handlePlay = () => {
      addLog('▶️ play - Reproduciendo');
      setIsPlaying(true);
    };
    const handlePause = () => {
      addLog('⏸️ pause - Pausado');
      setIsPlaying(false);
    };
    const handleError = (e: Event) => {
      const error = (e.target as HTMLVideoElement)?.error;
      let errorMessage = 'Error desconocido';
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = 'Reproducción abortada';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = 'Error de red';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = 'Error de decodificación';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Formato no soportado';
            break;
        }
      }
      addLog(`❌ error - ${errorMessage}`);
      setError(errorMessage);
    };

    // Agregar event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Intentar reproducir automáticamente
    const tryPlay = () => {
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        video.play().catch(err => {
          addLog(`⚠️ Autoplay falló: ${err.message}`);
        });
      }
    };

    // Intentar reproducir después de un breve delay
    const timeoutId = setTimeout(tryPlay, 1000);

    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [hlsUrl, streamId]);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(err => {
        addLog(`❌ Error al reproducir: ${err.message}`);
      });
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🧹 Logs limpiados');
  };

  return (
    <div className="w-full">
      {/* Video Player */}
      <div className="relative bg-black mb-4 rounded-lg overflow-hidden">
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
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">🔍 Debug Simple</h3>
          <div className="flex gap-2">
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Limpiar
            </button>
            <button
              onClick={handleManualPlay}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              ▶️ Play
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Estado:</div>
            <div className="text-white">{isPlaying ? '▶️ Reproduciendo' : '⏸️ Pausado'}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Error:</div>
            <div className="text-white">{error || 'Ninguno'}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Stream ID:</div>
            <div className="text-white text-xs">{streamId}</div>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <div className="text-gray-400">Logs:</div>
            <div className="text-white">{logs.length}</div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-black rounded p-3 max-h-64 overflow-y-auto">
          <div className="text-green-400 text-xs font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500">Esperando eventos...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
