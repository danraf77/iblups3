import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { channelId, channelUsername, channelName } = await request.json();

    if (!channelId || !channelUsername || !channelName) {
      return NextResponse.json({ error: 'Datos del canal requeridos' }, { status: 400 });
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
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    // Verificar si ya sigue el canal
    const { data: existingFollow } = await supabase
      .from('iblups_channel_follows')
      .select('id')
      .eq('user_id', session.user_id)
      .eq('channel_id', channelId)
      .single();

    if (existingFollow) {
      return NextResponse.json({ error: 'Ya sigues este canal' }, { status: 400 });
    }

    // Seguir canal
    const { error: followError } = await supabase
      .from('iblups_channel_follows')
      .insert({
        user_id: session.user_id,
        channel_id: channelId,
        channel_username: channelUsername,
        channel_name: channelName,
        notifications_enabled: true
      });

    if (followError) {
      console.error('Error siguiendo canal:', followError);
      return NextResponse.json({ error: 'Error siguiendo canal' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Canal seguido correctamente' 
    });

  } catch {
    console.error('Error en follow channel:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    // Dejar de seguir canal
    const { error: unfollowError } = await supabase
      .from('iblups_channel_follows')
      .delete()
      .eq('user_id', session.user_id)
      .eq('channel_id', channelId);

    if (unfollowError) {
      console.error('Error dejando de seguir canal:', unfollowError);
      return NextResponse.json({ error: 'Error dejando de seguir canal' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Canal dejado de seguir correctamente' 
    });

  } catch {
    console.error('Error en unfollow channel:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para seguir/dejar de seguir canales creada con Cursor
// - Valida autenticación por sesión
// - Previene duplicados
// - Maneja errores apropiadamente
// - Optimizada para rendimiento
