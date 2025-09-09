import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sampleChannels } from '../../../data/sampleChannels';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface LiveCountResponse {
  totalLiveChannels: number;
  totalChannels: number;
}

export async function GET() {
  try {
    // Intentar obtener datos de Supabase
    const { data, error } = await supabase
      .from('channels_channel')
      .select('id, is_on_live')
      .eq('enabled_search', true);

    let totalChannels = 0;
    let totalLiveChannels = 0;

    if (error || !data || data.length === 0) {
      // Usar datos de ejemplo si no hay datos de la base de datos
      totalChannels = sampleChannels.length;
      totalLiveChannels = sampleChannels.filter(channel => channel.is_on_live).length;
    } else {
      // Usar datos de la base de datos
      totalChannels = data.length;
      totalLiveChannels = data.filter(channel => channel.is_on_live).length;
    }

    const response: LiveCountResponse = {
      totalLiveChannels,
      totalChannels
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en API de conteo de canales en vivo:', error);
    
    // En caso de error, devolver datos de ejemplo
    const totalChannels = sampleChannels.length;
    const totalLiveChannels = sampleChannels.filter(channel => channel.is_on_live).length;

    const response: LiveCountResponse = {
      totalLiveChannels,
      totalChannels
    };

    return NextResponse.json(response);
  }
}
