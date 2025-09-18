import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import VideoJS from '../../components/Player';
import { getHlsUrlServerSide } from '../../utils/getHlsUrl';

interface EmbedPageProps {
  params: {
    username: string;
  };
  searchParams: {
    autoplay?: string;
    muted?: string;
    controls?: string;
    poster?: string;
    volume?: string;
    fluid?: string;
    liveui?: string;
    responsive?: string;
    preload?: string;
    playsinline?: string;
  };
}

// Generación de metadatos con política de Referer que SÍ envía encabezado
export async function generateMetadata(
  { params }: { params: { username: string } }
): Promise<Metadata> {
  const { username } = params;

  try {
    // Obtener nombre del canal para metadata
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: channel } = await supabase
      .from('channels_channel')
      .select('name')
      .eq('username', username)
      .single();

    const channelName = channel?.name || username;

    return {
      title: `${channelName} - Live Stream`,
      description: `Stream en vivo de ${channelName}`,
      robots: { index: false, follow: false },
      referrer: 'strict-origin-when-cross-origin', // ✅ clave para que Nginx reciba Referer
    };
  } catch {
    return {
      title: `${username} - Live Stream`,
      description: `Stream en vivo de ${username}`,
      robots: { index: false, follow: false },
      referrer: 'strict-origin-when-cross-origin', // ✅ también en el fallback
    };
  }
}

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { username } = params;
  const { 
    autoplay, 
    muted, 
    controls, 
    poster, 
    volume, 
    fluid, 
    liveui, 
    responsive, 
    preload, 
    playsinline 
  } = searchParams ?? {};

  // Parsear query parameters con defaults - Cursor
  const autoplayEnabled = autoplay === 'true';
  const mutedEnabled = muted !== 'false';
  const controlsEnabled = controls !== 'false';
  const fluidEnabled = fluid !== 'false';
  const liveuiEnabled = liveui !== 'false';
  const responsiveEnabled = responsive !== 'false';
  const playsinlineEnabled = playsinline !== 'false';
  const volumeValue = volume ? parseFloat(volume) : 0.5;
  const preloadValue = (preload as 'auto' | 'metadata' | 'none') || 'auto';

  let hlsUrl = '';
  let posterUrl = '';

  try {
    // Obtener URL HLS encriptada del servidor
    const streamData = await getHlsUrlServerSide(username);
    hlsUrl = streamData.hlsUrl;
    // Usar poster del query parameter si se proporciona, sino usar el generado automáticamente
    posterUrl = poster || streamData.posterUrl;
  } catch (error) {
    console.error('Error fetching channel data:', error);
    notFound();
  }

  // Configuración del Player2 - Cursor
  const playerConfig = {
    streamUrl: hlsUrl,
    thumbnailUrl: posterUrl,
    autoplay: autoplayEnabled,
    muted: mutedEnabled,
    controls: controlsEnabled,
    fluid: fluidEnabled,
    liveui: liveuiEnabled,
    responsive: responsiveEnabled,
    preload: preloadValue,
    playsinline: playsinlineEnabled,
    volume: volumeValue,
    className: 'embed-player'
  };

  return (
    <>
      {/* Preload del poster para carga más rápida */}
      {posterUrl ? (
        <>
          <link rel="preload" as="image" href={posterUrl} fetchPriority="high" />
          <link rel="dns-prefetch" href="https://thumbnail.iblups.com" />
          <link rel="preconnect" href="https://thumbnail.iblups.com" crossOrigin="" />
        </>
      ) : null}

      <div className="embed-page w-full h-screen bg-black">
        <VideoJS {...playerConfig} />
      </div>
    </>
  );
}

// Comentario: Página de embed actualizada con Player2 - Cursor
// - Soporte completo para query parameters (autoplay, muted, controls, poster, volume, etc.)
// - Integración con Player2 component (Video.js moderno)
// - Manejo server-side del cifrado de streamId
// - Optimizada para uso en iframe
// - Logo de iBlups con hover automático
// - Volumen por defecto al 50%
