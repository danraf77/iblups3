import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ isFollowing: false });
    }

    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json({ error: 'ID del canal requerido' }, { status: 400 });
    }

    // Verificar sesión válida
    const { data: session, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ isFollowing: false });
    }

    // Verificar si sigue el canal
    const { data: follow } = await supabase
      .from('iblups_channel_follows')
      .select('id')
      .eq('user_id', session.user_id)
      .eq('channel_id', channelId)
      .single();

    return NextResponse.json({ 
      isFollowing: !!follow 
    });

  } catch {
    console.error('Error en is-following:', error);
    return NextResponse.json({ isFollowing: false });
  }
}

// Comentario: API para verificar si usuario sigue canal creada con Cursor
// - Verifica autenticación
// - Consulta optimizada
// - Retorna boolean simple
// - Maneja errores silenciosamente
