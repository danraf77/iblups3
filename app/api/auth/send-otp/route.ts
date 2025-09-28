import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY!);

// Traducciones para emails - Implementado por Cursor
const emailTranslations = {
  en: {
    subject: "Your verification code",
    title: "Verification Code",
    subtitle: "Please use the following code to complete your verification:",
    codeLabel: "Verification Code",
    expiryText: "Expires in 10 minutes",
    securityText: "🔒 For security, never share this code with anyone. iblups will never ask you for your verification code.",
    footer: "This code will expire in 10 minutes. If you didn't request this code, please ignore this email.",
    copyright: "© 2025 iblups. All rights reserved.",
    autoEmail: "This is an automatic email, please do not reply.",
    company: "iblups"
  },
  es: {
    subject: "Tu código de verificación",
    title: "Código de Verificación",
    subtitle: "Por favor utiliza el siguiente código para completar tu verificación:",
    codeLabel: "Código de Verificación",
    expiryText: "Expira en 10 minutos",
    securityText: "🔒 Por seguridad, nunca compartas este código con nadie. iblups nunca te pedirá tu código de verificación.",
    footer: "Este código expirará en 10 minutos. Si no solicitaste este código, por favor ignora este email.",
    copyright: "© 2025 iblups. Todos los derechos reservados.",
    autoEmail: "Este es un email automático, por favor no respondas.",
    company: "iblups"
  },
  fr: {
    subject: "Votre code de vérification",
    title: "Code de Vérification",
    subtitle: "Veuillez utiliser le code suivant pour terminer votre vérification :",
    codeLabel: "Code de Vérification",
    expiryText: "Expire dans 10 minutes",
    securityText: "🔒 Pour la sécurité, ne partagez jamais ce code avec qui que ce soit. iblups ne vous demandera jamais votre code de vérification.",
    footer: "Ce code expirera dans 10 minutes. Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.",
    copyright: "© 2025 iblups. Tous droits réservés.",
    autoEmail: "Ceci est un e-mail automatique, veuillez ne pas répondre.",
    company: "iblups"
  },
  de: {
    subject: "Ihr Bestätigungscode",
    title: "Bestätigungscode",
    subtitle: "Bitte verwenden Sie den folgenden Code, um Ihre Bestätigung abzuschließen:",
    codeLabel: "Bestätigungscode",
    expiryText: "Läuft in 10 Minuten ab",
    securityText: "🔒 Aus Sicherheitsgründen teilen Sie diesen Code niemals mit jemandem. iblups wird Sie niemals nach Ihrem Bestätigungscode fragen.",
    footer: "Dieser Code läuft in 10 Minuten ab. Wenn Sie diesen Code nicht angefordert haben, ignorieren Sie bitte diese E-Mail.",
    copyright: "© 2025 iblups. Alle Rechte vorbehalten.",
    autoEmail: "Dies ist eine automatische E-Mail, bitte antworten Sie nicht.",
    company: "iblups"
  },
  
  zh: {
      subject: "您的验证码",
      title: "验证码",
      subtitle: "请使用以下代码完成验证：",
      codeLabel: "验证码",
      expiryText: "10分钟内有效",
      securityText: "🔒 为安全起见，切勿与任何人分享此代码。iblups 绝不会向您索取验证码。",
      footer: "此代码将在10分钟后过期。如果您没有请求此代码，请忽略此电子邮件。",
      copyright: "© 2025 iblups. 版权所有。",
      autoEmail: "这是一封自动发送的电子邮件，请勿回复。",
      company: "iblups"
    },
  ru: {
      subject: "Ваш проверочный код",
      title: "Проверочный код",
      subtitle: "Пожалуйста, используйте следующий код для завершения проверки:",
      codeLabel: "Проверочный код",
      expiryText: "Истекает через 10 минут",
      securityText: "🔒 В целях безопасности никогда никому не сообщайте этот код. iblups никогда не будет запрашивать у вас проверочный код.",
      footer: "Срок действия этого кода истечет через 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.",
      copyright: "© 2025 iblups. Все права защищены.",
      autoEmail: "Это автоматическое письмо, пожалуйста, не отвечайте на него.",
      company: "iblups"
    },
    ja: {
      subject: "認証コード",
      title: "認証コード",
      subtitle: "認証を完了するには、次のコードを使用してください：",
      codeLabel: "認証コード",
      expiryText: "10分後に有効期限が切れます",
      securityText: "🔒 セキュリティのため、このコードを誰とも共有しないでください。iblupsがお客様に認証コードを尋ねることは決してありません。",
      footer: "このコードは10分後に有効期限が切れます。このコードをリクエストしていない場合は、このメールを無視してください。",
      copyright: "© 2025 iblups. 無断複写・転載を禁じます。",
      autoEmail: "これは自動送信メールです。返信しないでください。",
      company: "iblups"
    },
    tr: {
      subject: "Doğrulama kodunuz",
      title: "Doğrulama Kodu",
      subtitle: "Doğrulamanızı tamamlamak için lütfen aşağıdaki kodu kullanın:",
      codeLabel: "Doğrulama Kodu",
      expiryText: "10 dakika içinde süresi dolar",
      securityText: "🔒 Güvenlik için bu kodu kimseyle paylaşmayın. iblups sizden asla doğrulama kodunuzu istemez.",
      footer: "Bu kodun süresi 10 dakika içinde dolacaktır. Bu kodu siz istemediyseniz, lütfen bu e-postayı dikkate almayın.",
      copyright: "© 2025 iblups. Tüm hakları saklıdır.",
      autoEmail: "Bu otomatik bir e-postadır, lütfen yanıtlamayın.",
      company: "iblups"
    },
    pl: {
      subject: "Twój kod weryfikacyjny",
      title: "Kod weryfikacyjny",
      subtitle: "Użyj poniższego kodu, aby zakończyć weryfikację:",
      codeLabel: "Kod weryfikacyjny",
      expiryText: "Wygasa za 10 minut",
      securityText: "🔒 Ze względów bezpieczeństwa nigdy nie udostępniaj tego kodu nikomu. iblups nigdy nie poprosi Cię o Twój kod weryfikacyjny.",
      footer: "Ten kod wygaśnie za 10 minut. Jeśli nie prosiłeś o ten kod, zignoruj tę wiadomość e-mail.",
      copyright: "© 2025 iblups. Wszelkie prawa zastrzeżone.",
      autoEmail: "To jest automatyczna wiadomość e-mail, prosimy na nią nie odpowiadać.",
      company: "iblups"
    },
    hi: {
      subject: "आपका सत्यापन कोड",
      title: "सत्यापन कोड",
      subtitle: "अपना सत्यापन पूरा करने के लिए कृपया निम्नलिखित कोड का उपयोग करें:",
      codeLabel: "सत्यापन कोड",
      expiryText: "10 मिनट में समाप्त हो जाएगा",
      securityText: "🔒 सुरक्षा के लिए, यह कोड किसी के साथ साझा न करें। iblups आपसे कभी भी आपका सत्यापन कोड नहीं पूछेगा।",
      footer: "यह कोड 10 मिनट में समाप्त हो जाएगा। यदि आपने इस कोड का अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें।",
      copyright: "© 2025 iblups. सर्वाधिकार सुरक्षित।",
      autoEmail: "यह एक स्वचालित ईमेल है, कृपया इसका उत्तर न दें।",
      company: "iblups"
    },
    pt: {
      subject: "Seu código de verificação",
      title: "Código de Verificação",
      subtitle: "Por favor, use o código a seguir para concluir sua verificação:",
      codeLabel: "Código de Verificação",
      expiryText: "Expira em 10 minutos",
      securityText: "🔒 Por segurança, nunca compartilhe este código com ninguém. O iblups nunca solicitará seu código de verificação.",
      footer: "Este código expirará em 10 minutos. Se você não solicitou este código, ignore este e-mail.",
      copyright: "© 2025 iblups. Todos os direitos reservados.",
      autoEmail: "Este é um e-mail automático, por favor, não responda.",
      company: "iblups"
    },
    ar: {
      subject: "رمز التحقق الخاص بك",
      title: "رمز التحقق",
      subtitle: "يرجى استخدام الرمز التالي لإكمال عملية التحقق الخاصة بك:",
      codeLabel: "رمز التحقق",
      expiryText: "ينتهي في غضون 10 دقائق",
      securityText: "🔒 للأمان، لا تشارك هذا الرمز مع أي شخص أبدًا. لن يطلب منك iblups رمز التحقق الخاص بك أبدًا.",
      footer: "سينتهي صلاحية هذا الرمز في غضون 10 دقائق. إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.",
      copyright: "© 2025 iblups. جميع الحقوق محفوظة.",
      autoEmail: "هذه رسالة بريد إلكتروني تلقائية، يرجى عدم الرد عليها.",
      company: "iblups"
    },
    it: {
      subject: "Il tuo codice di verifica",
      title: "Codice di verifica",
      subtitle: "Utilizza il seguente codice per completare la verifica:",
      codeLabel: "Codice di verifica",
      expiryText: "Scade tra 10 minuti",
      securityText: "🔒 Per sicurezza, non condividere mai questo codice con nessuno. iblups non ti chiederà mai il tuo codice di verifica.",
      footer: "Questo codice scadrà tra 10 minuti. Se non hai richiesto questo codice, ignora questa email.",
      copyright: "© 2025 iblups. Tutti i diritti riservati.",
      autoEmail: "Questa è un'email automatica, si prega di non rispondere.",
      company: "iblups"
    },
    ko: {
      subject: "인증 코드",
      title: "인증 코드",
      subtitle: "인증을 완료하려면 다음 코드를 사용하십시오:",
      codeLabel: "인증 코드",
      expiryText: "10분 후에 만료됩니다",
      securityText: "🔒 보안을 위해 이 코드를 다른 사람과 절대 공유하지 마십시오. iblups는 절대로 인증 코드를 묻지 않습니다.",
      footer: "이 코드는 10분 후에 만료됩니다. 이 코드를 요청하지 않으셨다면 이 이메일을 무시하십시오.",
      copyright: "© 2025 iblups. 모든 권리 보유.",
      autoEmail: "이것은 자동 발신 이메일이므로 회신하지 마십시오.",
      company: "iblups"
    }
  
};

// Función para generar HTML del email - Implementado por Cursor
function generateEmailHTML(code: string, language: string) {
  const translations = emailTranslations[language as keyof typeof emailTranslations] || emailTranslations.es;
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${translations.subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.4; color: #6b7280; background-color: #ffffff; }
    .email-container { max-width: 400px; margin: 0 auto; background-color: #ffffff; padding: 32px 20px; }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { width: 60px; height: auto; margin-bottom: 16px; }
    .title { font-size: 20px; font-weight: 500; color: #374151; margin-bottom: 8px; }
    .subtitle { font-size: 13px; color: #9ca3af; margin-bottom: 24px; }
    .code-container { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center; }
    .code-label { font-size: 11px; color: #9ca3af; font-weight: 400; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .verification-code { font-size: 32px; font-weight: 600; color: #2c73ff; letter-spacing: 3px; font-family: 'Courier New', monospace; }
    .expiry-info { background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; margin: 16px 0; text-align: center; }
    .expiry-text { color: #6b7280; font-size: 12px; font-weight: 400; }
    .security-note { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 8px; margin: 16px 0; }
    .security-text { color: #6b7280; font-size: 12px; font-weight: 400; }
    .footer { margin-top: 24px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
    .footer-text { font-size: 11px; color: #9ca3af; line-height: 1.3; margin-bottom: 8px; }
    .company-info { font-size: 10px; color: #d1d5db; }
    @media (max-width: 600px) { .email-container { padding: 24px 16px; } .verification-code { font-size: 28px; letter-spacing: 2px; } .title { font-size: 18px; } }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.png" alt="iblups" class="logo">
      <h1 class="title">${translations.title}</h1>
      <p class="subtitle">${translations.subtitle}</p>
    </div>
    <div class="code-container">
      <div class="code-label">${translations.codeLabel}</div>
      <div class="verification-code">${code}</div>
    </div>
    <div class="expiry-info">
      <span class="expiry-text">${translations.expiryText}</span>
    </div>
    <div class="security-note">
      <p class="security-text">${translations.securityText}</p>
    </div>
    <div class="footer">
      <p class="footer-text">${translations.footer}</p>
      <div class="company-info">
        <p>${translations.copyright}</p>
        <p>${translations.autoEmail}</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generar código OTP de 4 dígitos
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(_request: NextRequest) {
  try {
    const { email, language = 'es' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 });
    }

    // Generar código OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Limpiar códigos OTP expirados para este email
    await supabase
      .from('iblups_otp_codes')
      .delete()
      .eq('email', email)
      .lt('expires_at', new Date().toISOString());

    // Guardar código OTP en la base de datos
    const { error: otpError } = await supabase
      .from('iblups_otp_codes')
      .insert({
        email,
        code: otpCode,
        type: 'login',
        expires_at: expiresAt.toISOString(),
        is_used: false,
        attempts: 0
      });

    if (otpError) {
      console.error('Error guardando OTP:', otpError);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }

    // Obtener traducciones para el idioma
    const translations = emailTranslations[language as keyof typeof emailTranslations] || emailTranslations.es;

    // Generar HTML del email - Implementado por Cursor
    const emailHTML = generateEmailHTML(otpCode, language);

    // Enviar email con OTP
    try {
      await resend.emails.send({
        from: 'iblups <noreply@email.iblups.com>',
        to: [email],
        subject: translations.subject,
        html: emailHTML,
      });
    } catch {
      console.error('Error enviando email:', emailError);
      return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Código OTP enviado correctamente' 
    });

  } catch {
    console.error('Error en send-otp:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para envío de códigos OTP creada con Cursor
// - Genera códigos de 4 dígitos
// - Valida formato de email
// - Limpia códigos expirados
// - Envía email con diseño profesional
// - Maneja errores apropiadamente
