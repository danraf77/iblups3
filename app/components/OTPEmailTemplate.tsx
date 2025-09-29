import * as React from 'react';

interface OTPEmailTemplateProps {
  otpCode: string;
  userName?: string;
  language?: string;
  translations?: {
    verificationCode: string;
    hello: string;
    useThisCode: string;
    codeExpires: string;
    ignoreEmail: string;
    copyright: string;
  };
}

export function OTPEmailTemplate({ otpCode, userName, translations }: OTPEmailTemplateProps) {
  // Fallback translations en español si no se proporcionan
  const t = translations || {
    verificationCode: "Tu código de verificación",
    hello: "Hola",
    useThisCode: "Usa este código para iniciar sesión:",
    codeExpires: "Este código expira en 10 minutos",
    ignoreEmail: "Si no solicitaste este código, puedes ignorar este email.",
    copyright: "© 2025 iblups. Todos los derechos reservados."
  };
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '40px 20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px 30px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* Header minimalista */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            color: '#6b7280', 
            fontSize: '24px', 
            margin: '0 0 8px 0',
            fontWeight: '300',
            letterSpacing: '1px'
          }}>
            iblups
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0' }}>
            {t.verificationCode}
          </p>
        </div>
        
        {/* Código OTP */}
        <div style={{ 
          textAlign: 'center', 
          margin: '40px 0'
        }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '16px', 
            margin: '0 0 20px 0',
            fontWeight: '400'
          }}>
            {userName ? `${t.hello} ${userName},` : `${t.hello},`}
          </p>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '14px', 
            margin: '0 0 30px 0' 
          }}>
            {t.useThisCode}
          </p>
          <div style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#2c73ff',
            letterSpacing: '12px',
            backgroundColor: '#f8f9fa',
            padding: '20px 30px',
            borderRadius: '6px',
            display: 'inline-block',
            fontFamily: 'monospace',
            border: '1px solid #e5e7eb'
          }}>
            {otpCode}
          </div>
        </div>
        
        {/* Información de expiración */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '13px', 
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            {t.codeExpires}
          </p>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '12px', 
            margin: '0' 
          }}>
            {t.ignoreEmail}
          </p>
        </div>
        
        {/* Footer minimalista */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '11px', 
            margin: '0' 
          }}>
            {t.copyright}
          </p>
        </div>
      </div>
    </div>
  );
}

// Comentario: Template de email para OTP creado con Cursor
// Incluye diseño responsive y profesional para el envío de códigos de verificación
