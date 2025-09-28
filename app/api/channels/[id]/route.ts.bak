import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sampleChannels } from '../../../data/sampleChannels';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChannelDetail {
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
  description?: string;
  created_at?: string;
  modified?: string;
  enabled_search?: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: channelId } = await params;

    if (!channelId) {
      return NextResponse.json(
        { error: 'ID de canal requerido' },
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
        description,
        created_at,
        modified,
        enabled_search,
        channels_category!category_id(name)
      `)
      .eq('id', channelId)
      .eq('enabled_search', true)
      .single();

    let channelDetail: ChannelDetail | null = null;

    if (error || !data) {
      // Buscar en datos de ejemplo si no se encuentra en la base de datos
      const sampleChannel = sampleChannels.find(channel => channel.id === channelId);
      
      if (sampleChannel) {
        channelDetail = {
          ...sampleChannel,
          name: sampleChannel.name.toLowerCase(),
          cover: sampleChannel.stream_id ? `https://thumbnail.iblups.com/thumb/live/${sampleChannel.stream_id}.png` : undefined,
          category: sampleChannel.category,
          description: `Canal de ${sampleChannel.category?.name || 'entretenimiento'}`,
          created_at: new Date().toISOString(),
          modified: new Date().toISOString(),
          enabled_search: true
        };
      }
    } else {
      // Usar datos de la base de datos
      channelDetail = {
        ...data,
        name: data.name.toLowerCase(),
        cover: data.stream_id ? `https://thumbnail.iblups.com/thumb/live/${data.stream_id}.png` : undefined,
        category: {
          name: data.channels_category && data.channels_category.length > 0 
            ? data.channels_category[0].name 
            : 'Sin categoría'
        }
      };
    }

    if (!channelDetail) {
      return NextResponse.json(
        { error: 'Canal no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(channelDetail);

  } catch (error) {
    console.error('Error en API de detalle de canal:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
