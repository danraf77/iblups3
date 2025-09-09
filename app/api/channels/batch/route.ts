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

interface BatchChannelsResponse {
  channels: Channel[];
  totalFound: number;
}

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Array de IDs requerido' },
        { status: 400 }
      );
    }

    // Intentar obtener datos de Supabase
    const { data, error } = await supabase
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
      .in('id', ids)
      .eq('enabled_search', true);

    let channels: Channel[] = [];

    if (error || !data || data.length === 0) {
      // Buscar en datos de ejemplo
      channels = sampleChannels
        .filter(channel => ids.includes(channel.id))
        .map(channel => ({
          ...channel,
          name: channel.name.toLowerCase(),
          cover: channel.stream_id ? `https://thumbnail.iblups.com/thumb/live/${channel.stream_id}.png` : undefined,
          category: channel.category
        }));
    } else {
      // Usar datos de la base de datos
      channels = data.map(channel => ({
        ...channel,
        name: channel.name.toLowerCase(),
        cover: channel.stream_id ? `https://thumbnail.iblups.com/thumb/live/${channel.stream_id}.png` : undefined,
        category: {
          name: channel.channels_category && channel.channels_category.length > 0 
            ? channel.channels_category[0].name 
            : 'Sin categoría'
        }
      }));
    }

    const response: BatchChannelsResponse = {
      channels,
      totalFound: channels.length
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en API de canales por lotes:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
