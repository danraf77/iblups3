import { Metadata } from 'next';
import DebugEmbedPlayer from '../components/DebugEmbedPlayer';

export const metadata: Metadata = {
  title: 'Debug - Embed Player',
  description: 'Debug del player de embed con información detallada',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DebugEmbedPage() {
  const hlsBaseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/dev';
  const streamId = '68fe7d84cbd05c3c32e1e31b35931a691d59df16';
  const hlsUrl = `${hlsBaseUrl}/${streamId}.m3u8`;

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl mb-6">
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-2">Debug - Embed Player</h1>
            <p className="text-gray-300 text-sm mb-4">
              Debug del player de embed con información detallada y controles de prueba
            </p>
            <div className="p-3 bg-gray-700 rounded text-xs font-mono text-green-300">
              <div><span className="text-gray-400">HLS Base URL:</span> {hlsBaseUrl}</div>
              <div><span className="text-gray-400">Stream ID:</span> {streamId}</div>
              <div><span className="text-gray-400">HLS URL:</span> {hlsUrl}</div>
            </div>
          </div>
        </div>

        {/* Debug Player */}
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-blue-800 px-6 py-4 border-b border-blue-700">
            <h2 className="text-xl font-bold text-white mb-2">Player de Embed</h2>
            <p className="text-blue-200 text-sm">
              Player Video.js con HLS nativo para embed
            </p>
          </div>
          <div className="p-6">
            <DebugEmbedPlayer
              hlsUrl={hlsUrl}
              streamId={streamId}
              hlsBaseUrl={hlsBaseUrl}
            />
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="mt-6 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
          <h3 className="text-yellow-300 font-semibold mb-2">🔍 Análisis del Player de Embed:</h3>
          <div className="text-yellow-200 text-sm">
            <ul className="space-y-1">
              <li>• ✅ Usa Video.js como UI</li>
              <li>• ✅ HLS nativo para compatibilidad</li>
              <li>• ✅ Soporte para autoplay y controles</li>
              <li>• ✅ Optimizado para iframe</li>
              <li>• ✅ Manejo de errores robusto</li>
              <li>• ❌ Puede tener problemas de CORS</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
          <h3 className="text-blue-300 font-semibold mb-2">ℹ️ Instrucciones de Debug:</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Observa si el player se carga correctamente</li>
            <li>• Verifica si reproduce el video</li>
            <li>• Revisa los logs de debug del player</li>
            <li>• Prueba diferentes configuraciones de autoplay</li>
            <li>• Verifica que los controles funcionen</li>
            <li>• Observa si hay errores de CORS</li>
          </ul>
        </div>

        {/* Test de Scroll */}
        <div className="mt-6 bg-red-800 rounded-lg p-6">
          <h3 className="text-red-300 font-semibold mb-4">🧪 Test de Scroll</h3>
          <div className="text-red-200 text-sm space-y-2">
            <p>Esta sección es para probar que el scroll funcione correctamente.</p>
            <p>Si puedes ver este texto, el scroll está funcionando.</p>
            <p>El player de embed debería estar arriba y este contenido abajo.</p>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="mt-6 bg-green-800 rounded-lg p-6">
          <h3 className="text-green-300 font-semibold mb-4">📊 Información Adicional</h3>
          <div className="text-green-200 text-sm space-y-2">
            <p>• Player: Video.js + HLS nativo</p>
            <p>• Configuración: Autoplay habilitado, controles visibles</p>
            <p>• Compatibilidad: Todos los navegadores modernos</p>
            <p>• Optimización: Para uso en iframe</p>
          </div>
        </div>

        {/* Estadísticas del Player */}
        <div className="mt-6 bg-purple-800 rounded-lg p-6">
          <h3 className="text-purple-300 font-semibold mb-4">📈 Estadísticas del Player</h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>• Tamaño: Responsive 16:9</p>
            <p>• Carga: Lazy loading habilitado</p>
            <p>• Buffer: Configuración optimizada</p>
            <p>• Errores: Manejo automático de recuperación</p>
          </div>
        </div>

        {/* Configuración Técnica */}
        <div className="mt-6 bg-purple-800 rounded-lg p-6">
          <h3 className="text-purple-300 font-semibold mb-4">🔧 Configuración Técnica</h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>• HLS Base URL: {hlsBaseUrl}</p>
            <p>• Stream ID: {streamId}</p>
            <p>• URL completa: {hlsUrl}</p>
            <p>• Player: Video.js con HLS nativo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
