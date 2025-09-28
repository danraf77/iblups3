import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode } = await request.json();

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: 'Email y código OTP son requeridos' },
        { status: 400 }
      );
    }

    // Buscar código OTP válido
    const { data: otpData, error: otpError } = await supabase
      .from('iblups_otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', otpCode)
      .eq('is_used', false)
      .eq('type', 'login')
      .single();

    if (otpError || !otpData) {
      return NextResponse.json(
        { error: 'Código OTP inválido o expirado' },
        { status: 400 }
      );
    }

    // Verificar si el código ha expirado
    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    
    if (now > expiresAt) {
      // Marcar como usado para evitar reutilización
      await supabase
        .from('iblups_otp_codes')
        .update({ is_used: true })
        .eq('id', otpData.id);

      return NextResponse.json(
        { error: 'Código OTP expirado' },
        { status: 400 }
      );
    }

    // Obtener información del usuario
    const { data: user, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select('id, email, display_name, avatar_url, is_active')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Cuenta desactivada' },
        { status: 403 }
      );
    }

    // Marcar código OTP como usado
    await supabase
      .from('iblups_otp_codes')
      .update({ is_used: true })
      .eq('id', otpData.id);

    // Crear sesión
    const sessionToken = crypto.randomUUID();
    const expiresAtSession = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días

    // Guardar sesión en la base de datos
    const { error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAtSession.toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
        device_info: {
          userAgent: request.headers.get('user-agent') || '',
          platform: 'web'
        },
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
      });

    if (sessionError) {
      console.error('Error creando sesión:', sessionError);
      return NextResponse.json(
        { error: 'Error creando sesión' },
        { status: 500 }
      );
    }

    // Actualizar último login del usuario
    await supabase
      .from('iblups_users_viewers')
      .update({ 
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    // Crear JWT token para la sesión
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const jwt = await new SignJWT({ 
      userId: user.id, 
      email: user.email,
      sessionToken: sessionToken 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);

    // Configurar cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set('auth-token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 días
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url
      },
      sessionToken: sessionToken
    });

  } catch (error) {
    console.error('Error en verify-otp:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Comentario: API route para verificar OTP creada con Cursor
// Maneja verificación de códigos, creación de sesiones y autenticación de usuarios
