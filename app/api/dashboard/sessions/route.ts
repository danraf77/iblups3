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
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);
    const { userId } = payload as { userId: string };

    // Obtener sesiones del usuario
    const { data: sessions, error: sessionsError } = await supabase
      .from('iblups_user_sessions')
      .select('id, session_token, created_at, last_activity_at, expires_at, is_active, device_info, ip_address')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json(
        { error: 'Error obteniendo sesiones' },
        { status: 500 }
      );
    }

    // Obtener estadísticas de sesiones
    const { count: totalSessions, error: totalError } = await supabase
      .from('iblups_user_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: activeSessions, error: activeError } = await supabase
      .from('iblups_user_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (totalError || activeError) {
      console.error('Error counting sessions:', totalError || activeError);
    }

    return NextResponse.json({ 
      sessions: sessions || [],
      stats: {
        total: totalSessions || 0,
        active: activeSessions || 0
      }
    });

  } catch (error) {
    console.error('Error in /api/dashboard/sessions:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
