import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { error: 'ID del canal requerido' },
        { status: 400 }
      );
    }

    // Contar seguidores del canal
    const { count, error: countError } = await supabase
      .from('iblups_channel_follows')
      .select('*', { count: 'exact', head: true })
      .eq('channel_id', channelId);

    if (countError) {
      console.error('Error contando seguidores:', countError);
      return NextResponse.json(
        { error: 'Error obteniendo número de seguidores' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      followersCount: count || 0
    });

  } catch (error) {
    console.error('Error en /api/channel/followers-count:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
