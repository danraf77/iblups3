import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Generar código OTP de 4 dígitos
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Verificar si el usuario existe
    const { data: existingUser, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select('id, email, display_name')
      .eq('email', email)
      .single();

    let userName: string | undefined;

    if (userError && userError.code === 'PGRST116') {
      // Usuario no existe, crear nuevo usuario
      const { error: createError } = await supabase
        .from('iblups_users_viewers')
        .insert({
          email: email,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creando usuario:', createError);
        return NextResponse.json(
          { error: 'Error creando usuario' },
          { status: 500 }
        );
      }

      userName = email.split('@')[0]; // Usar parte antes del @ como nombre
    } else if (userError) {
      console.error('Error verificando usuario:', userError);
      return NextResponse.json(
        { error: 'Error verificando usuario' },
        { status: 500 }
      );
    } else {
      // Usuario existe
      userName = existingUser.display_name || existingUser.email.split('@')[0];
    }

    // Eliminar códigos OTP anteriores para este usuario
    await supabase
      .from('iblups_otp_codes')
      .delete()
      .eq('email', email);

    // Guardar nuevo código OTP
    const { error: otpError } = await supabase
      .from('iblups_otp_codes')
      .insert({
        email: email,
        code: otpCode,
        type: 'login',
        expires_at: expiresAt.toISOString(),
        is_used: false,
        attempts: 0
      });

    if (otpError) {
      console.error('Error guardando OTP:', otpError);
      return NextResponse.json(
        { error: 'Error guardando código OTP' },
        { status: 500 }
      );
    }

    // Enviar email con OTP
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'iBluPS <noreply@email.iblups.com>',
        to: [email],
        subject: 'Tu código de verificación - iBluPS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">iBluPS</h1>
                <p style="color: #666; font-size: 16px; margin: 0;">Tu código de verificación</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px dashed #007bff;">
                <p style="color: #333; font-size: 18px; margin: 0 0 15px 0; font-weight: 500;">Hola ${userName || 'Usuario'},</p>
                <p style="color: #666; font-size: 16px; margin: 0 0 20px 0;">Usa este código para iniciar sesión:</p>
                <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; background-color: white; padding: 15px 25px; border-radius: 8px; border: 2px solid #007bff; display: inline-block; font-family: monospace;">
                  ${otpCode}
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border: 1px solid #ffeaa7;">
                <p style="color: #856404; font-size: 14px; margin: 0; font-weight: 500;">⚠️ Este código expira en 10 minutos</p>
                <p style="color: #856404; font-size: 12px; margin: 10px 0 0 0;">Si no solicitaste este código, puedes ignorar este email.</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">© 2024 iBluPS. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        `,
      });

      if (emailError) {
        console.error('Error enviando email:', emailError);
        return NextResponse.json(
          { error: 'Error enviando email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Código OTP enviado correctamente',
        emailId: emailData?.id
      });

    } catch (emailError: unknown) {
      console.error('Error en servicio de email:', emailError);
      return NextResponse.json(
        { error: `Error en servicio de email: ${emailError instanceof Error ? emailError.message : String(emailError)}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error en send-otp:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Comentario: API route para enviar OTP creada con Cursor
// Maneja creación automática de usuarios y envío de códigos de verificación por email
