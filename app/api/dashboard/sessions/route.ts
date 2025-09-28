import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../../lib/supabase';
export async function GET(_request: NextRequest) {
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
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }

    // Obtener todas las sesiones del usuario (activas e inactivas)
    const { data: userSessions, error: sessionsError } = await supabase
      .from('iblups_user_sessions')
      .select(`
        id,
        session_token,
        device_info,
        ip_address,
        user_agent,
        expires_at,
        is_active,
        created_at,
        last_activity_at
      `)
      .eq('user_id', session.user_id)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching user sessions:', sessionsError);
      return NextResponse.json({ error: 'Error al cargar sesiones' }, { status: 500 });
    }

    // Procesar las sesiones para incluir información adicional
    const processedSessions = userSessions.map(session => {
      // Determinar el país basado en la IP (simplificado)
      const getCountryFromIP = (ip: string) => {
        if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown') {
          return 'Local';
        }
        // Aquí podrías integrar un servicio de geolocalización real
        return 'Desconocido';
      };

      // Determinar el dispositivo y navegador
      const getDeviceInfo = (userAgent: string, deviceInfo: unknown) => {
        if ((deviceInfo as unknown)?.platform) {
          return (deviceInfo as unknown).platform;
        }
        
        if (userAgent.includes('Windows')) return 'Windows';
        if (userAgent.includes('Mac')) return 'macOS';
        if (userAgent.includes('Linux')) return 'Linux';
        if (userAgent.includes('Android')) return 'Android';
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
        return 'Desconocido';
      };

      const getBrowserInfo = (userAgent: string) => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Desconocido';
      };

      return {
        id: session.id,
        session_token: session.session_token.substring(0, 8) + '...', // Solo mostrar primeros 8 caracteres
        device: getDeviceInfo(session.user_agent || '', session.device_info),
        browser: getBrowserInfo(session.user_agent || ''),
        country: getCountryFromIP(session.ip_address || ''),
        ip_address: session.ip_address,
        is_active: session.is_active,
        created_at: session.created_at,
        last_activity_at: session.last_activity_at,
        expires_at: session.expires_at,
        is_current: session.session_token === sessionToken
      };
    });

    return NextResponse.json({ sessions: processedSessions });

  } catch {
    console.error('Error en /api/dashboard/sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario esté autenticado
    const { data: currentSession, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !currentSession) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'ID de sesión requerido' }, { status: 400 });
    }

    // Verificar que la sesión pertenece al usuario actual
    const { data: targetSession, error: targetError } = await supabase
      .from('iblups_user_sessions')
      .select('user_id, session_token')
      .eq('id', sessionId)
      .eq('user_id', currentSession.user_id)
      .single();

    if (targetError || !targetSession) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 });
    }

    // No permitir cerrar la sesión actual
    if (targetSession.session_token === sessionToken) {
      return NextResponse.json({ error: 'No puedes cerrar tu sesión actual' }, { status: 400 });
    }

    // Marcar la sesión como inactiva
    const { error: updateError } = await supabase
      .from('iblups_user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error cerrando sesión:', updateError);
      return NextResponse.json({ error: 'Error cerrando sesión' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });

  } catch {
    console.error('Error en DELETE /api/dashboard/sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
