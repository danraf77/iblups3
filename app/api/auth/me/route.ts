import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase, queryConfig, sanitizeUser, renewSessionIfNeeded, SESSION_CONFIG } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // Verificar y renovar sesión si es necesario
    const sessionValid = await renewSessionIfNeeded(sessionToken);
    if (!sessionValid) {
      return NextResponse.json({ user: null });
    }

    // Buscar sesión válida con configuración optimizada
    const { data: session, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select(`
        *,
        iblups_users_viewers!inner(*)
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: sanitizeUser(session.iblups_users_viewers)
    });

  } catch (error) {
    console.error('Error en /api/auth/me:', error);
    return NextResponse.json({ user: null });
  }
}

// Comentario: API para obtener usuario actual creada con Cursor
// - Valida sesión por cookie
// - Retorna información del usuario
// - Maneja sesiones expiradas
// - Optimizada con JOIN para mejor rendimiento
