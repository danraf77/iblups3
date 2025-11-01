import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getHlsUrlServerSide } from '../../utils/getHlsUrl';
import EmbedPlayer from './EmbedPlayer';

// Modificado por Cursor: uso de componente cliente separado en lugar de dynamic con ssr: false

interface EmbedPageProps {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{
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
  }>;
}

/* 🧠 Metadata: título dinámico + política Referer */
// Modificado por Cursor: params ahora es una Promise en Next.js 15, se debe hacer await
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;

  try {
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
      referrer: 'strict-origin-when-cross-origin',
    };
  } catch {
    return {
      title: `${username} - Live Stream`,
      description: `Stream en vivo de ${username}`,
      robots: { index: false, follow: false },
      referrer: 'strict-origin-when-cross-origin',
    };
  }
}

/* 🧩 Página principal del embed */
// Modificado por Cursor: params y searchParams ahora son Promises en Next.js 15, se debe hacer await
export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { username } = await params;
  const resolvedSearchParams = await (searchParams || Promise.resolve({})) as {
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

  // Extraer parámetros de búsqueda
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
    playsinline,
  } = resolvedSearchParams;

  // Defaults seguros
  const autoplayEnabled = autoplay === 'true';
  const mutedEnabled = muted !== 'false';
  const controlsEnabled = controls !== 'false';
  const fluidEnabled = fluid !== 'false';
  const liveuiEnabled = liveui !== 'false';
  const responsiveEnabled = responsive !== 'false';
  const playsinlineEnabled = playsinline !== 'false';
  const volumeValue = volume ? parseFloat(volume) : 0.5;
  const preloadValue = (preload as 'auto' | 'metadata' | 'none') || 'auto';

  // 🔹 Obtener URL HLS cifrada + poster
  let hlsUrl = '';
  let posterUrl = '';

  try {
    const streamData = await getHlsUrlServerSide(username);
    hlsUrl = streamData.hlsUrl;
    posterUrl = poster || streamData.posterUrl;
  } catch (error) {
    console.error('❌ Error al obtener el HLS:', error);
    notFound();
  }

  // Configuración final para el Player
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
    className: 'embed-player',
  };

  return (
    <>
      {/* Preload del poster */}
      {posterUrl && (
        <>
          <link rel="preload" as="image" href={posterUrl} fetchPriority="high" />
          <link rel="dns-prefetch" href="https://thumbnail.iblups.com" />
          <link rel="preconnect" href="https://thumbnail.iblups.com" crossOrigin="" />
        </>
      )}

      <div className="embed-page w-full h-screen bg-black">
        <EmbedPlayer {...playerConfig} />
      </div>
    </>
  );
}
