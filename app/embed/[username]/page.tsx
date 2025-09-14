import { notFound } from 'next/navigation';
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

export default async function EmbedPage({ params, searchParams }: EmbedPageProps) {
  const { username } = await params;
  const { autoplay, muted, controls, poster } = await searchParams;

  // Parsear query parameters con defaults
  const autoplayEnabled = autoplay !== 'false';
  const mutedEnabled = muted !== 'false';
  const controlsEnabled = controls !== 'false';
  const posterUrl = poster || undefined;

  let hlsUrl: string;
  let streamId: string;
  let channelName: string;

  try {
    // Obtener URL HLS encriptada y streamId del servidor
    const streamData = await getHlsUrlServerSide(username);
    hlsUrl = streamData.hlsUrl;
    streamId = streamData.streamId;
    
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

    channelName = channel?.name || username;
  } catch (error) {
    console.error('Error fetching channel data:', error);
    notFound();
  }

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${channelName} - Live Stream`}</title>
        <meta name="description" content={`Stream en vivo de ${channelName}`} />
        
        {/* Meta tags para iframe */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="embed-mode">
        <div className="w-full h-screen bg-black">
          <VideojsHls
            src={hlsUrl}
            autoplay={autoplayEnabled}
            muted={mutedEnabled}
            controls={controlsEnabled}
            poster={posterUrl}
          />
        </div>
      </body>
    </html>
  );
}

// Comentario: Página de embed creada con Cursor
// - Soporte completo para query parameters (autoplay, muted, controls, poster)
// - Integración con VideojsHls component
// - Manejo server-side del cifrado de streamId
// - Optimizada para uso en iframe
