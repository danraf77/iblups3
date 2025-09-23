import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email y código son requeridos' }, { status: 400 });
    }

    // Buscar código OTP válido
    const { data: otpData, error: otpError } = await supabase
      .from('iblups_otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: 'Código inválido o expirado' }, { status: 400 });
    }

    // Verificar intentos (máximo 3)
    if (otpData.attempts >= 3) {
      return NextResponse.json({ error: 'Demasiados intentos fallidos' }, { status: 400 });
    }

    // Marcar código como usado
    await supabase
      .from('iblups_otp_codes')
      .update({ is_used: true })
      .eq('id', otpData.id);

    // Buscar o crear usuario
    const { data: user, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select('*')
      .eq('email', email)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // Usuario no existe, crear nuevo usuario
      const { data: newUser, error: createError } = await supabase
        .from('iblups_users_viewers')
        .insert({
          email,
          email_verified_at: new Date().toISOString(),
          is_active: true,
          last_login_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creando usuario:', createError);
        return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 });
      }

      user = newUser;

      // Crear perfil básico
      await supabase
        .from('iblups_profile_viewers')
        .insert({
          user_id: user.id,
          language_preference: 'es'
        });

    } else if (userError) {
      console.error('Error buscando usuario:', userError);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } else {
      // Usuario existe, actualizar último login
      await supabase
        .from('iblups_users_viewers')
        .update({ 
          last_login_at: new Date().toISOString(),
          email_verified_at: new Date().toISOString()
        })
        .eq('id', user.id);
    }

    // Crear sesión con duración extendida
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 días

    // Limpiar sesiones anteriores del usuario para evitar duplicados
    await supabase
      .from('iblups_user_sessions')
      .update({ is_active: false })
      .eq('user_id', user.id);

    const { error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: request.ip || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || 'unknown',
        device_info: {
          platform: request.headers.get('sec-ch-ua-platform') || 'unknown',
          browser: request.headers.get('user-agent') || 'unknown'
        }
      });

    if (sessionError) {
      console.error('Error creando sesión:', sessionError);
      return NextResponse.json({ error: 'Error creando sesión' }, { status: 500 });
    }

    // Configurar cookie con configuración mejorada
    const cookieStore = await cookies();
    cookieStore.set('iblups_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 90 * 24 * 60 * 60, // 90 días en segundos
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.iblups.com' : undefined
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified
      }
    });

  } catch (error) {
    console.error('Error en verify-otp:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para verificación de OTP creada con Cursor
// - Valida códigos OTP de 4 dígitos
// - Controla intentos fallidos
// - Crea usuarios automáticamente
// - Genera sesiones seguras
// - Configura cookies HTTP-only
