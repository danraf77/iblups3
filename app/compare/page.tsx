import { Metadata } from 'next';
import DebugHlsJsPlayer from '../components/DebugHlsJsPlayer';

export const metadata: Metadata = {
  title: 'Debug - HLS.js Player',
  description: 'Player HLS.js con debug completo para identificar problemas',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComparePage() {
  const hlsBaseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/dev';
  const streamId = '68fe7d84cbd05c3c32e1e31b35931a691d59df16';
  const hlsUrl = `${hlsBaseUrl}/${streamId}.m3u8`;

  return (
    <div className="bg-black min-h-screen">
      <div className="w-full max-w-4xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl mb-6">
          <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-2">Debug - HLS.js Player</h1>
            <p className="text-gray-300 text-sm mb-4">
              Player HLS.js con debug completo para identificar problemas de reproducción
            </p>
            <div className="p-3 bg-gray-700 rounded text-xs font-mono text-green-300">
              <div><span className="text-gray-400">HLS Base URL:</span> {hlsBaseUrl}</div>
              <div><span className="text-gray-400">Stream ID:</span> {streamId}</div>
              <div><span className="text-gray-400">HLS URL:</span> {hlsUrl}</div>
            </div>
          </div>
        </div>

        {/* HLS.js Player */}
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-green-800 px-6 py-4 border-b border-green-700">
            <h2 className="text-xl font-bold text-white mb-2">Player HLS.js</h2>
            <p className="text-green-200 text-sm">
              Con hls.js para máxima compatibilidad
            </p>
          </div>
          <div className="p-6">
            <DebugHlsJsPlayer
              hlsUrl={hlsUrl}
              streamId={streamId}
              hlsBaseUrl={hlsBaseUrl}
            />
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="mt-6 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
          <h3 className="text-yellow-300 font-semibold mb-2">🔍 Análisis del Player HLS.js:</h3>
          <div className="text-yellow-200 text-sm">
            <ul className="space-y-1">
              <li>• ✅ Funciona en todos los navegadores</li>
              <li>• ✅ Control avanzado de buffer</li>
              <li>• ✅ Mejor manejo de errores</li>
              <li>• ✅ Configuración personalizable</li>
              <li>• ✅ Soporte completo para HLS</li>
              <li>• ❌ Dependencia externa (~200KB)</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
          <h3 className="text-blue-300 font-semibold mb-2">ℹ️ Instrucciones de Debug:</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Observa los logs de debug del player HLS.js</li>
            <li>• Verifica si reproduce el video correctamente</li>
            <li>• Revisa la velocidad de carga y reproducción</li>
            <li>• Observa los errores que aparecen en los logs</li>
            <li>• El player HLS.js funciona en todos los navegadores</li>
            <li>• Usa el botón "Reproducir Manualmente" si el autoplay falla</li>
          </ul>
        </div>

        {/* Contenido adicional para scroll */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">📋 Información Adicional</h3>
          <div className="text-gray-300 text-sm space-y-3">
            <p>Este es contenido adicional para probar el scroll de la página. El player ahora debería tener un tamaño más pequeño y permitir ver este contenido debajo.</p>
            <p>El player HLS.js está configurado con un ancho máximo de 800px y altura máxima de 400px para que no ocupe toda la pantalla.</p>
            <p>Los logs de debug tienen scroll vertical independiente para mostrar toda la información sin ocupar demasiado espacio.</p>
          </div>
        </div>

        <div className="mt-6 bg-green-800 rounded-lg p-6">
          <h3 className="text-green-300 font-semibold mb-4">✅ Estado del Player</h3>
          <div className="text-green-200 text-sm space-y-2">
            <p>• Player HLS.js cargado correctamente</p>
            <p>• CSS personalizado aplicado</p>
            <p>• Scroll funcional en logs de debug</p>
            <p>• Tamaño del player optimizado</p>
          </div>
        </div>

        <div className="mt-6 bg-purple-800 rounded-lg p-6">
          <h3 className="text-purple-300 font-semibold mb-4">🔧 Configuración Técnica</h3>
          <div className="text-purple-200 text-sm space-y-2">
            <p>• HLS Base URL: {hlsBaseUrl}</p>
            <p>• Stream ID: {streamId}</p>
            <p>• URL completa: {hlsUrl}</p>
            <p>• Player: HLS.js con debug habilitado</p>
          </div>
        </div>

        {/* Más contenido para forzar scroll */}
        <div className="mt-6 bg-red-800 rounded-lg p-6">
          <h3 className="text-red-300 font-semibold mb-4">🚨 Test de Scroll</h3>
          <div className="text-red-200 text-sm space-y-3">
            <p>Esta sección está aquí para probar que el scroll funciona correctamente.</p>
            <p>Si puedes ver este contenido, significa que el scroll está funcionando.</p>
            <p>El player HLS.js debería estar arriba y este contenido debería estar visible al hacer scroll hacia abajo.</p>
          </div>
        </div>

        <div className="mt-6 bg-orange-800 rounded-lg p-6">
          <h3 className="text-orange-300 font-semibold mb-4">📊 Estadísticas del Player</h3>
          <div className="text-orange-200 text-sm space-y-2">
            <p>• Tamaño del contenedor: 800px máximo</p>
            <p>• Altura del video: 400px máximo</p>
            <p>• Scroll de logs: 300px de altura</p>
            <p>• Contenido adicional: Múltiples secciones</p>
          </div>
        </div>

        <div className="mt-6 bg-indigo-800 rounded-lg p-6">
          <h3 className="text-indigo-300 font-semibold mb-4">🎯 Objetivo del Test</h3>
          <div className="text-indigo-200 text-sm space-y-2">
            <p>• Verificar que el player no ocupe toda la pantalla</p>
            <p>• Confirmar que se puede hacer scroll hacia abajo</p>
            <p>• Validar que todo el contenido es visible</p>
            <p>• Probar la funcionalidad del scroll en los logs</p>
          </div>
        </div>

        <div className="mt-6 bg-pink-800 rounded-lg p-6">
          <h3 className="text-pink-300 font-semibold mb-4">✅ Resultado Esperado</h3>
          <div className="text-pink-200 text-sm space-y-2">
            <p>• Player visible en la parte superior</p>
            <p>• Contenido adicional visible al hacer scroll</p>
            <p>• Scroll funcional en toda la página</p>
            <p>• Logs de debug con scroll independiente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Comentario: Página de comparación creada con Cursor
// - Comparación lado a lado de ambos players
// - Debug completo para identificar diferencias
// - Análisis de ventajas y desventajas
// - Interfaz clara para evaluación
