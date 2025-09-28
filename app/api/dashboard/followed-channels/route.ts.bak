import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar sesión válida
    const { data: session, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    // Buscar canales seguidos
    const { data: followedChannels, error: channelsError } = await supabase
      .from('iblups_channel_follows')
      .select(`
        id,
        channel_id,
        channel_username,
        channel_name,
        followed_at,
        notifications_enabled
      `)
      .eq('user_id', session.user_id)
      .order('followed_at', { ascending: false });

    if (channelsError) {
      console.error('Error buscando canales seguidos:', channelsError);
      return NextResponse.json({ error: 'Error obteniendo canales' }, { status: 500 });
    }

    return NextResponse.json(followedChannels || []);

  } catch (error) {
    console.error('Error en /api/dashboard/followed-channels:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para canales seguidos del dashboard creada con Cursor
// - Valida sesión del usuario
// - Retorna lista de canales seguidos
// - Ordenados por fecha de seguimiento
