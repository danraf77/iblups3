import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verificar JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);
    
    const { userId, sessionToken } = payload as { userId: string; sessionToken: string };

    // Verificar sesión en la base de datos
    const { data: session, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Verificar si la sesión ha expirado
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      // Marcar sesión como inactiva
      await supabase
        .from('iblups_user_sessions')
        .update({ is_active: false })
        .eq('id', session.id);

      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Obtener información del usuario
    const { data: user, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select('id, email, display_name, avatar_url, is_active')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account deactivated' },
        { status: 403 }
      );
    }

    // Actualizar última actividad
    await supabase
      .from('iblups_user_sessions')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', session.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Comentario: API route para verificar sesión actual creada con Cursor
// Valida JWT y sesión en base de datos, retorna información del usuario autenticado
