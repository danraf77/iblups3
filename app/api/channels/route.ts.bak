import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sampleChannels } from '../../data/sampleChannels';

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

interface ChannelsResponse {
  channels: Channel[];
  totalChannels: number;
  totalLiveChannels: number;
  currentPage: number;
  totalPages: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '16');
    const search = searchParams.get('search') || '';
    const tab = searchParams.get('tab') || 'todos';

    // Intentar obtener datos de Supabase
    let query = supabase
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
      .eq('enabled_search', true);

    // Aplicar filtros según la pestaña activa
    if (tab === 'populares') {
      query = query.order('is_on_live', { ascending: false }).order('name');
    } else if (tab === 'recientes') {
      query = query.order('modified', { ascending: false });
    } else {
      query = query.order('is_on_live', { ascending: false }).order('name');
    }

    // Aplicar búsqueda si existe
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    let allChannels: Channel[] = [];

    if (error || !data || data.length === 0) {
      // Usar datos de ejemplo si no hay datos de la base de datos
      console.log('Usando datos de ejemplo');
      
      // Filtrar datos de ejemplo según búsqueda
      let filteredChannels = sampleChannels;
      if (search) {
        filteredChannels = sampleChannels.filter(channel => 
          channel.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Ordenar según la pestaña activa
      if (tab === 'populares') {
        filteredChannels = [...filteredChannels].sort((a, b) => {
          if (a.is_on_live !== b.is_on_live) {
            return b.is_on_live ? 1 : -1;
          }
          return a.name.localeCompare(b.name);
        });
      } else if (tab === 'recientes') {
        // Para recientes, mantener el orden original
        filteredChannels = [...filteredChannels];
      } else {
        // Todos: ordenar por en vivo primero
        filteredChannels = [...filteredChannels].sort((a, b) => {
          if (a.is_on_live !== b.is_on_live) {
            return b.is_on_live ? 1 : -1;
          }
          return a.name.localeCompare(b.name);
        });
      }

      allChannels = filteredChannels;
    } else {
      // Usar datos de la base de datos
      allChannels = data.map(channel => ({
        ...channel,
        name: channel.name.toLowerCase(), // Convertir nombres a minúsculas
        cover: channel.stream_id ? `https://thumbnail.iblups.com/thumb/live/${channel.stream_id}.png` : undefined,
        category: {
          name: channel.channels_category && channel.channels_category.length > 0 
            ? channel.channels_category[0].name 
            : 'Sin categoría'
        }
      }));
    }

    // Calcular totales
    const totalChannels = allChannels.length;
    const totalLiveChannels = allChannels.filter(channel => channel.is_on_live).length;
    const totalPages = Math.ceil(totalChannels / limit);

    // Aplicar paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChannels = allChannels.slice(startIndex, endIndex);

    const response: ChannelsResponse = {
      channels: paginatedChannels,
      totalChannels,
      totalLiveChannels,
      currentPage: page,
      totalPages
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en API de canales:', error);
    
    // En caso de error, devolver datos de ejemplo
    const totalChannels = sampleChannels.length;
    const totalLiveChannels = sampleChannels.filter(channel => channel.is_on_live).length;
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '16');
    const totalPages = Math.ceil(totalChannels / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChannels = sampleChannels.slice(startIndex, endIndex);

    const response: ChannelsResponse = {
      channels: paginatedChannels,
      totalChannels,
      totalLiveChannels,
      currentPage: page,
      totalPages
    };

    return NextResponse.json(response);
  }
}
