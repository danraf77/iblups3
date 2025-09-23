import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email y código son requeridos' }, { status: 400 });
    }

    // Verificar OTP
    const { data: otpData, error: otpError } = await supabase
      .from('iblups_otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: 'Código inválido o expirado' }, { status: 400 });
    }

    // Marcar OTP como usado
    await supabase
      .from('iblups_otp_codes')
      .update({ is_used: true })
      .eq('id', otpData.id);

    // Buscar o crear usuario
    let { data: user } = await supabase
      .from('iblups_users_viewers')
      .select('*')
      .eq('email', email)
      .single();
    
    const { error: userError } = await supabase
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
          first_name: '',
          last_name: '',
          country: '',
          city: '',
          date_of_birth: null
        });
    } else if (userError) {
      console.error('Error buscando usuario:', userError);
      return NextResponse.json({ error: 'Error de autenticación' }, { status: 500 });
    }

    // Actualizar último login
    await supabase
      .from('iblups_users_viewers')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // Crear sesión
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 días

    // Obtener IP de los headers
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || '127.0.0.1';

    await supabase
      .from('iblups_user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: ip,
        user_agent: req.headers.get('user-agent') || 'unknown',
        device_info: {
          platform: req.headers.get('sec-ch-ua-platform') || 'unknown',
          browser: req.headers.get('user-agent') || 'unknown'
        }
      });

    // Crear cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set('iblups_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 días
      path: '/'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name
      }
    });

  } catch (error) {
    console.error('Error en verify-otp:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para verificar OTP creada con Cursor
// - Valida código OTP
// - Crea o actualiza usuario
// - Genera sesión con cookie HTTP-only
// - Maneja perfiles de usuario
