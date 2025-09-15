import { Metadata } from 'next';
import DebugHlsPlayer from '../components/DebugHlsPlayer';

export const metadata: Metadata = {
  title: 'Demo - HLS Player Debug',
  description: 'Demo de player HLS con debug completo para identificar problemas',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  const hlsBaseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/dev';
  const streamId = '68fe7d84cbd05c3c32e1e31b35931a691d59df16';
  const hlsUrl = `${hlsBaseUrl}/${streamId}.m3u8`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-2">Demo - HLS Player Debug</h1>
            <p className="text-gray-300 text-sm">
              Player HTML5 nativo con debug completo para identificar problemas
            </p>
            <div className="mt-3 p-3 bg-gray-700 rounded text-xs font-mono text-green-300">
              <div><span className="text-gray-400">HLS Base URL:</span> {hlsBaseUrl}</div>
              <div><span className="text-gray-400">Stream ID:</span> {streamId}</div>
              <div><span className="text-gray-400">HLS URL:</span> {hlsUrl}</div>
            </div>
          </div>

          {/* Debug Player */}
          <div className="p-6">
            <DebugHlsPlayer
              hlsUrl={hlsUrl}
              streamId={streamId}
              hlsBaseUrl={hlsBaseUrl}
            />
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                <span className="text-gray-500">Stream:</span> {streamId}
              </div>
              <div>
                <span className="text-gray-500">Formato:</span> HLS (.m3u8)
              </div>
              <div>
                <span className="text-gray-500">Player:</span> HTML5 + Debug
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
          <h3 className="text-blue-300 font-semibold mb-2">ℹ️ Instrucciones de Debug:</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Observa los logs en tiempo real en el panel de debug</li>
            <li>• Verifica si aparecen errores de red o decodificación</li>
            <li>• Revisa el estado del player (Network State, Ready State)</li>
            <li>• Usa el botón &quot;Reproducir Manualmente&quot; si el autoplay falla</li>
            <li>• Los logs se muestran en la consola del navegador también</li>
            <li>• Si no hay logs, el video no está cargando</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Comentario: Página de demo creada con Cursor
// - Player HTML5 nativo simple sin dependencias externas
// - Usa NEXT_PUBLIC_HLS_BASE_URL y stream ID fijo
// - Interfaz limpia con información de debug
// - Optimizada para demostrar reproducción HLS básica
