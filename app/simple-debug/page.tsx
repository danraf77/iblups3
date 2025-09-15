'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function SimpleDebugPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const hlsBaseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/dev';
  const streamId = '68fe7d84cbd05c3c32e1e31b35931a691d59df16';
  const hlsUrl = `${hlsBaseUrl}/${streamId}.m3u8`;

  const addDebugInfo = (info: string) => {
    console.log('SIMPLE DEBUG:', info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    if (!videoRef.current) {
      addDebugInfo('❌ Video element not found');
      return;
    }

    addDebugInfo('✅ Video element found');
    addDebugInfo(`🌐 HLS Base URL: ${hlsBaseUrl}`);
    addDebugInfo(`🆔 Stream ID: ${streamId}`);
    addDebugInfo(`📺 Source URL: ${hlsUrl}`);

    // Configuración mínima de Video.js
    const options = {
      controls: true,
      autoplay: false,
      muted: true,
      fluid: true,
      responsive: true,
      preload: 'auto'
    };

    addDebugInfo('⚙️ Video.js options configured');

    try {
      addDebugInfo('🚀 Initializing Video.js...');
      const player = videojs(videoRef.current, options);
      addDebugInfo('✅ Video.js player created');

      player.ready(() => {
        addDebugInfo('🎯 Player ready event fired');
        
        // Configurar fuente
        addDebugInfo('📡 Setting video source...');
        player.src(hlsUrl);
        addDebugInfo('✅ Video source set');
        
        // Forzar carga
        addDebugInfo('🔄 Forcing video load...');
        player.load();
        addDebugInfo('✅ Video load called');
      });

      // Eventos de debug
      player.on('loadstart', () => addDebugInfo('🔄 loadstart event'));
      player.on('loadedmetadata', () => addDebugInfo('📊 loadedmetadata event'));
      player.on('loadeddata', () => addDebugInfo('📦 loadeddata event'));
      player.on('canplay', () => addDebugInfo('▶️ canplay event'));
      player.on('canplaythrough', () => addDebugInfo('🎬 canplaythrough event'));
      player.on('play', () => addDebugInfo('▶️ play event'));
      player.on('pause', () => addDebugInfo('⏸️ pause event'));
      player.on('error', () => {
        const error = player.error();
        addDebugInfo(`❌ ERROR: ${JSON.stringify(error)}`);
      });

      // Cleanup
      return () => {
        addDebugInfo('🧹 Cleaning up player');
        player.dispose();
      };

    } catch (error) {
      addDebugInfo(`❌ Exception: ${error}`);
    }
  }, [hlsUrl]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl mb-6">Video.js Player Debug</h1>
        
        <div className="bg-gray-800 p-4 rounded mb-6">
          <h2 className="text-white text-lg mb-2">Environment Variables:</h2>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400">NEXT_PUBLIC_HLS_BASE_URL:</span>
              <p className="text-green-400 font-mono text-sm break-all">{hlsBaseUrl}</p>
            </div>
            <div>
              <span className="text-blue-400">Stream ID:</span>
              <p className="text-yellow-400 font-mono text-sm">{streamId}</p>
            </div>
            <div>
              <span className="text-blue-400">Final HLS URL:</span>
              <p className="text-green-400 font-mono text-sm break-all">{hlsUrl}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-white text-lg mb-4">Video.js Player:</h2>
          <div className="relative w-full max-w-4xl mx-auto">
            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              preload="auto"
              muted
              style={{ width: '100%', height: '400px' }}
            />
            
            {/* Debug Info */}
            <div className="mt-4 bg-black text-white p-4 rounded max-h-64 overflow-y-auto text-sm">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              {debugInfo.length === 0 ? (
                <p className="text-gray-400">Waiting for initialization...</p>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} className="mb-1 font-mono text-xs">{info}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
