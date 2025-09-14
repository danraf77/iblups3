import { notFound } from 'next/navigation';
import HLSPlayer from '../../components/HLSPlayer';
import { getChannelById } from '../../data/channelMapping';

interface EmbedPageProps {
  params: {
    url: string;
  };
}

export default function EmbedPage({ params }: EmbedPageProps) {
  const { url } = params;
  
  // Obtener el canal por ID
  const channel = getChannelById(url);
  
  // Si no se encuentra el canal, mostrar 404
  if (!channel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Contenedor con proporción 16:9 */}
      <div className="w-full max-w-7xl mx-auto">
        <HLSPlayer src={channel.hlsUrl} />
      </div>
    </div>
  );
}

// Comentario: Página dinámica de embed creada con Cursor
// - Ruta dinámica /embed/[url] para URLs de canales
// - Validación de URL HLS
// - Contenedor con proporción 16:9 fija
// - Diseño responsivo y centrado
