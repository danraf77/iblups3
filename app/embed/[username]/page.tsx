import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import VideojsHls from '../../components/VideojsHls';
import { getHlsUrlServerSide } from '../../utils/getHlsUrl';

interface EmbedPageProps {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    autoplay?: string;
    muted?: string;
    controls?: string;
    poster?: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  
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
      robots: {
        index: false,
        follow: false,
      },
      other: {
        'referrer': 'no-referrer',
      },
    };
  } catch (error) {
    return {
      title: `${username} - Live Stream`,
      description: `Stream en vivo de ${username}`,
      robots: {
        index: false,
        follow: false,
      },
      other: {
        'referrer': 'no-referrer',
      },
    };
  }
}

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { username } = await params;
  const { autoplay, muted, controls, poster } = await searchParams;

  // Parsear query parameters con defaults
  const autoplayEnabled = autoplay !== 'false';
  const mutedEnabled = muted !== 'false';
  const controlsEnabled = controls !== 'false';
  const posterUrl = poster || undefined;

  let hlsUrl: string;

  try {
    // Obtener URL HLS encriptada del servidor
    const streamData = await getHlsUrlServerSide(username);
    hlsUrl = streamData.hlsUrl;
  } catch (error) {
    console.error('Error fetching channel data:', error);
    notFound();
  }

  return (
    <div className="w-full h-screen bg-black">
      <VideojsHls
        src={hlsUrl}
        autoplay={autoplayEnabled}
        muted={mutedEnabled}
        controls={controlsEnabled}
        poster={posterUrl}
      />
    </div>
  );
}

// Comentario: Página de embed creada con Cursor
// - Soporte completo para query parameters (autoplay, muted, controls, poster)
// - Integración con VideojsHls component
// - Manejo server-side del cifrado de streamId
// - Optimizada para uso en iframe
