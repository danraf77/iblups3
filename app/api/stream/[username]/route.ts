import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateEncryptedHlsUrl } from '../../../utils/encryption';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Buscar canal por username en Supabase
    const { data: channel, error } = await supabase
      .from('channels_channel')
      .select('stream_id, name, username')
      .eq('username', username)
      .single();

    if (error || !channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    if (!channel.stream_id) {
      return NextResponse.json({ error: 'Stream ID not found' }, { status: 404 });
    }

    // Generar URL HLS encriptada
    const hlsUrl = generateEncryptedHlsUrl(channel.stream_id);

    return NextResponse.json({
      username: channel.username,
      name: channel.name,
      stream_id: channel.stream_id,
      hls_url: hlsUrl
    });

  } catch (error) {
    console.error('Error en API de stream:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Comentario: API de stream encriptado creada con Cursor
// - Búsqueda de canal por username
// - Generación de URL HLS encriptada
// - Respuesta con datos del stream
