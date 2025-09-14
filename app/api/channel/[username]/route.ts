import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sampleChannels } from '../../../data/sampleChannels';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Channel {
  id: string;
  name: string;
  username: string;
  stream_id?: string;
  is_on_live: boolean;
  icon?: string;
  cover?: string;
  category_id?: number;
  category?: {
    name: string;
  };
  channels_category?: {
    name: string;
  }[];
  viewer_count?: number;
  is_4k?: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Intentar obtener canal de Supabase
    console.log(`Buscando canal con username: ${username}`);
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('channels_channel')
      .select(`
        id,
        name,
        username,
        stream_id,
        is_on_live,
        icon,
        cover,
        category_id,
        channels_category!category_id(name)
      `)
      .eq('username', username)
      .single();
    
    console.log('Resultado de Supabase:', { supabaseData, supabaseError });

    let channel: Channel | null = null;

    if (supabaseError || !supabaseData) {
      console.log(`Canal no encontrado en Supabase para username: ${username}`, supabaseError);
      // Buscar en datos de ejemplo si no se encuentra en Supabase
      const sampleChannel = sampleChannels.find(c => c.username === username);
      
      if (sampleChannel) {
        console.log(`Canal encontrado en datos de ejemplo: ${sampleChannel.name}`);
        channel = {
          ...sampleChannel,
          cover: sampleChannel.cover || `https://thumbnail.iblups.com/thumb/live/${sampleChannel.stream_id}.png`,
          category: sampleChannel.category || { name: 'Sin categoría' }
        };
      } else {
        console.log(`Canal no encontrado en datos de ejemplo para username: ${username}`);
      }
    } else {
      // Usar datos de Supabase
      console.log(`Canal encontrado en Supabase: ${supabaseData.name}`);
      channel = {
        ...supabaseData,
        name: supabaseData.name.toLowerCase(),
        cover: supabaseData.stream_id ? `https://thumbnail.iblups.com/thumb/live/${supabaseData.stream_id}.png` : undefined,
        category: {
          name: supabaseData.channels_category && supabaseData.channels_category.length > 0 
            ? supabaseData.channels_category[0].name 
            : 'Sin categoría'
        }
      };
    }

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    return NextResponse.json({ channel });

  } catch (error) {
    console.error('Error en API de canal por username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Comentario: API de canal por username creada con Cursor
// - Búsqueda dinámica por username en Supabase y datos de ejemplo
// - Manejo de errores y fallbacks
// - Respuesta consistente con estructura de canal
