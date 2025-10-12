import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
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

    const { newEmail, otpCode } = await request.json();

    if (!newEmail || !otpCode) {
      return NextResponse.json(
        { error: 'Email y código OTP son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Verificar que el nuevo email no esté en uso
    const { data: existingUser, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select('id')
      .eq('email', newEmail)
      .single();

    if (!userError && existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está en uso por otra cuenta' },
        { status: 400 }
      );
    }

    // Verificar código OTP
    const { data: otpData, error: otpError } = await supabase
      .from('iblups_otp_codes')
      .select('*')
      .eq('email', newEmail)
      .eq('code', otpCode)
      .eq('type', 'change_email')
      .eq('is_used', false)
      .single();

    if (otpError || !otpData) {
      return NextResponse.json(
        { error: 'Código de verificación inválido o expirado' },
        { status: 400 }
      );
    }

    // Verificar que el código no haya expirado
    const now = new Date();
    const expiresAt = new Date(otpData.expires_at);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Código de verificación expirado' },
        { status: 400 }
      );
    }

    // Obtener usuario actual
    const { data: currentUser, error: currentUserError } = await supabase
      .from('iblups_users_viewers')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (currentUserError || !currentUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar email del usuario
    const { error: updateError } = await supabase
      .from('iblups_users_viewers')
      .update({
        email: newEmail,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating email:', updateError);
      return NextResponse.json(
        { error: 'Error actualizando email' },
        { status: 500 }
      );
    }

    // Marcar código OTP como usado
    await supabase
      .from('iblups_otp_codes')
      .update({ is_used: true })
      .eq('id', otpData.id);

    // Eliminar otros códigos OTP para este email
    await supabase
      .from('iblups_otp_codes')
      .delete()
      .eq('email', newEmail);

    return NextResponse.json({
      success: true,
      message: 'Email actualizado correctamente',
      newEmail: newEmail
    });

  } catch (error) {
    console.error('Error in change-email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
