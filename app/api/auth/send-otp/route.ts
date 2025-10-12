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
    const { email, action = 'login', language = 'es' } = await request.json();

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

    let userName: string | undefined;

    if (action === 'change_email') {
      // Para cambio de email, no crear usuario, solo verificar que el email no esté en uso
      const { data: existingUser, error: userError } = await supabase
        .from('iblups_users_viewers')
        .select('id, email')
        .eq('email', email)
        .single();

      if (!userError && existingUser) {
        return NextResponse.json(
          { error: 'Este email ya está en uso por otra cuenta' },
          { status: 400 }
        );
      }

      userName = email.split('@')[0]; // Usar parte antes del @ como nombre
    } else {
      // Lógica original para login
      const { data: existingUser, error: userError } = await supabase
        .from('iblups_users_viewers')
        .select('id, email, display_name')
        .eq('email', email)
        .single();

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
        type: action,
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

    // Traducciones del email según el idioma
    const emailTranslations = {
      en: {
        verificationCode: "Your verification code",
        hello: "Hello",
        useThisCode: "Use this code to log in:",
        codeExpires: "This code expires in 10 minutes",
        ignoreEmail: "If you didn't request this code, you can ignore this email.",
        copyright: "© 2025 iblups. All rights reserved.",
        subject: action === 'change_email' ? 'Email change verification code - iblups' : 'Your verification code - iblups',
        purpose: action === 'change_email' ? 'change your email address' : 'log in'
      },
      es: {
        verificationCode: "Tu código de verificación",
        hello: "Hola",
        useThisCode: "Usa este código para iniciar sesión:",
        codeExpires: "Este código expira en 10 minutos",
        ignoreEmail: "Si no solicitaste este código, puedes ignorar este email.",
        copyright: "© 2025 iblups. Todos los derechos reservados.",
        subject: action === 'change_email' ? 'Código de verificación para cambio de email - iblups' : 'Tu código de verificación - iblups',
        purpose: action === 'change_email' ? 'cambiar tu dirección de email' : 'iniciar sesión'
      },
      zh: {
        verificationCode: "您的验证码",
        hello: "您好",
        useThisCode: "使用此代码登录：",
        codeExpires: "此代码将在10分钟后过期",
        ignoreEmail: "如果您没有请求此代码，可以忽略此邮件。",
        copyright: "© 2025 iblups. 保留所有权利。",
        subject: action === 'change_email' ? '邮箱更改验证码 - iblups' : '您的验证码 - iblups',
        purpose: action === 'change_email' ? '更改您的邮箱地址' : '登录'
      },
      de: {
        verificationCode: "Ihr Bestätigungscode",
        hello: "Hallo",
        useThisCode: "Verwenden Sie diesen Code zum Anmelden:",
        codeExpires: "Dieser Code läuft in 10 Minuten ab",
        ignoreEmail: "Wenn Sie diesen Code nicht angefordert haben, können Sie diese E-Mail ignorieren.",
        copyright: "© 2025 iblups. Alle Rechte vorbehalten.",
        subject: action === 'change_email' ? 'E-Mail-Änderung Bestätigungscode - iblups' : 'Ihr Bestätigungscode - iblups',
        purpose: action === 'change_email' ? 'Ihre E-Mail-Adresse ändern' : 'sich anmelden'
      },
      ja: {
        verificationCode: "認証コード",
        hello: "こんにちは",
        useThisCode: "このコードでログインしてください：",
        codeExpires: "このコードは10分で期限切れになります",
        ignoreEmail: "このコードをリクエストしていない場合は、このメールを無視できます。",
        copyright: "© 2025 iblups. 全著作権所有。",
        subject: action === 'change_email' ? 'メール変更認証コード - iblups' : '認証コード - iblups',
        purpose: action === 'change_email' ? 'メールアドレスを変更する' : 'ログインする'
      },
      fr: {
        verificationCode: "Votre code de vérification",
        hello: "Bonjour",
        useThisCode: "Utilisez ce code pour vous connecter :",
        codeExpires: "Ce code expire dans 10 minutes",
        ignoreEmail: "Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail.",
        copyright: "© 2025 iblups. Tous droits réservés.",
        subject: action === 'change_email' ? 'Code de vérification pour changement d\'email - iblups' : 'Votre code de vérification - iblups',
        purpose: action === 'change_email' ? 'changer votre adresse email' : 'vous connecter'
      },
      ar: {
        verificationCode: "رمز التحقق الخاص بك",
        hello: "مرحبا",
        useThisCode: "استخدم هذا الرمز لتسجيل الدخول:",
        codeExpires: "ينتهي هذا الرمز خلال 10 دقائق",
        ignoreEmail: "إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد الإلكتروني.",
        copyright: "© 2025 iblups. جميع الحقوق محفوظة.",
        subject: action === 'change_email' ? 'رمز التحقق لتغيير البريد الإلكتروني - iblups' : 'رمز التحقق الخاص بك - iblups',
        purpose: action === 'change_email' ? 'تغيير عنوان بريدك الإلكتروني' : 'تسجيل الدخول'
      },
      pt: {
        verificationCode: "Seu código de verificação",
        hello: "Olá",
        useThisCode: "Use este código para fazer login:",
        codeExpires: "Este código expira em 10 minutos",
        ignoreEmail: "Se você não solicitou este código, pode ignorar este e-mail.",
        copyright: "© 2025 iblups. Todos os direitos reservados.",
        subject: action === 'change_email' ? 'Código de verificação para mudança de email - iblups' : 'Seu código de verificação - iblups',
        purpose: action === 'change_email' ? 'alterar seu endereço de email' : 'fazer login'
      },
      it: {
        verificationCode: "Il tuo codice di verifica",
        hello: "Ciao",
        useThisCode: "Usa questo codice per accedere:",
        codeExpires: "Questo codice scade tra 10 minuti",
        ignoreEmail: "Se non hai richiesto questo codice, puoi ignorare questa e-mail.",
        copyright: "© 2025 iblups. Tutti i diritti riservati.",
        subject: action === 'change_email' ? 'Codice di verifica per cambio email - iblups' : 'Il tuo codice di verifica - iblups',
        purpose: action === 'change_email' ? 'cambiare il tuo indirizzo email' : 'accedere'
      },
      ko: {
        verificationCode: "인증 코드",
        hello: "안녕하세요",
        useThisCode: "이 코드로 로그인하세요:",
        codeExpires: "이 코드는 10분 후 만료됩니다",
        ignoreEmail: "이 코드를 요청하지 않았다면 이 이메일을 무시할 수 있습니다.",
        copyright: "© 2025 iblups. 모든 권리 보유.",
        subject: action === 'change_email' ? '이메일 변경 인증 코드 - iblups' : '인증 코드 - iblups',
        purpose: action === 'change_email' ? '이메일 주소를 변경하는' : '로그인하는'
      },
      hi: {
        verificationCode: "आपका सत्यापन कोड",
        hello: "नमस्ते",
        useThisCode: "लॉग इन करने के लिए इस कोड का उपयोग करें:",
        codeExpires: "यह कोड 10 मिनट में समाप्त हो जाएगा",
        ignoreEmail: "यदि आपने इस कोड का अनुरोध नहीं किया है, तो आप इस ईमेल को नजरअंदाज कर सकते हैं।",
        copyright: "© 2025 iblups. सभी अधिकार सुरक्षित।",
        subject: action === 'change_email' ? 'ईमेल परिवर्तन सत्यापन कोड - iblups' : 'आपका सत्यापन कोड - iblups',
        purpose: action === 'change_email' ? 'अपना ईमेल पता बदलने के लिए' : 'लॉग इन करने के लिए'
      },
      pl: {
        verificationCode: "Twój kod weryfikacyjny",
        hello: "Cześć",
        useThisCode: "Użyj tego kodu, aby się zalogować:",
        codeExpires: "Ten kod wygasa za 10 minut",
        ignoreEmail: "Jeśli nie prosiłeś o ten kod, możesz zignorować ten e-mail.",
        copyright: "© 2025 iblups. Wszelkie prawa zastrzeżone.",
        subject: action === 'change_email' ? 'Kod weryfikacyjny do zmiany emaila - iblups' : 'Twój kod weryfikacyjny - iblups',
        purpose: action === 'change_email' ? 'zmienić swój adres email' : 'zalogować się'
      },
      ru: {
        verificationCode: "Ваш код подтверждения",
        hello: "Привет",
        useThisCode: "Используйте этот код для входа:",
        codeExpires: "Этот код истекает через 10 минут",
        ignoreEmail: "Если вы не запрашивали этот код, можете проигнорировать это письмо.",
        copyright: "© 2025 iblups. Все права защищены.",
        subject: action === 'change_email' ? 'Код подтверждения для смены email - iblups' : 'Ваш код подтверждения - iblups',
        purpose: action === 'change_email' ? 'изменить ваш email адрес' : 'войти в систему'
      },
      tr: {
        verificationCode: "Doğrulama kodunuz",
        hello: "Merhaba",
        useThisCode: "Giriş yapmak için bu kodu kullanın:",
        codeExpires: "Bu kod 10 dakika içinde sona erer",
        ignoreEmail: "Bu kodu talep etmediyseniz, bu e-postayı yok sayabilirsiniz.",
        copyright: "© 2025 iblups. Tüm hakları saklıdır.",
        subject: action === 'change_email' ? 'E-posta değişikliği doğrulama kodu - iblups' : 'Doğrulama kodunuz - iblups',
        purpose: action === 'change_email' ? 'e-posta adresinizi değiştirmek için' : 'giriş yapmak için'
      }
    };

    const t = emailTranslations[language as keyof typeof emailTranslations] || emailTranslations.es;

    // Enviar email con OTP
    try {

      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'iblups <noreply@email.iblups.com>',
        to: [email],
        subject: t.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background-color: #f8f9fa;">
            <div style="background-color: white; padding: 40px 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <!-- Header minimalista -->
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #6b7280; font-size: 24px; margin: 0 0 8px 0; font-weight: 300; letter-spacing: 1px;">iblups</h1>
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">${t.verificationCode}</p>
              </div>
              
              <!-- Código OTP -->
              <div style="text-align: center; margin: 40px 0;">
                <p style="color: #6b7280; font-size: 16px; margin: 0 0 20px 0; font-weight: 400;">${userName ? `${t.hello} ${userName},` : `${t.hello},`}</p>
                <p style="color: #9ca3af; font-size: 14px; margin: 0 0 30px 0;">${t.useThisCode}</p>
                <div style="font-size: 36px; font-weight: 600; color: #2c73ff; letter-spacing: 12px; background-color: #f8f9fa; padding: 20px 30px; border-radius: 6px; display: inline-block; font-family: monospace; border: 1px solid #e5e7eb;">
                  ${otpCode}
                </div>
              </div>
              
              <!-- Información de expiración -->
              <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0; font-weight: 500;">${t.codeExpires}</p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">${t.ignoreEmail}</p>
              </div>
              
              <!-- Footer minimalista -->
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">${t.copyright}</p>
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
