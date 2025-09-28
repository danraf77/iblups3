import * as React from 'react';

interface OTPEmailTemplateProps {
  otpCode: string;
  userName?: string;
}

export function OTPEmailTemplate({ otpCode, userName }: OTPEmailTemplateProps) {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#333', 
            fontSize: '28px', 
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            iBluPS
          </h1>
          <p style={{ color: '#666', fontSize: '16px', margin: '0' }}>
            Tu código de verificación
          </p>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          margin: '30px 0',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #007bff'
        }}>
          <p style={{ 
            color: '#333', 
            fontSize: '18px', 
            margin: '0 0 15px 0',
            fontWeight: '500'
          }}>
            {userName ? `Hola ${userName},` : 'Hola,'}
          </p>
          <p style={{ 
            color: '#666', 
            fontSize: '16px', 
            margin: '0 0 20px 0' 
          }}>
            Usa este código para iniciar sesión:
          </p>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#007bff',
            letterSpacing: '8px',
            backgroundColor: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            border: '2px solid #007bff',
            display: 'inline-block',
            fontFamily: 'monospace'
          }}>
            {otpCode}
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <p style={{ 
            color: '#856404', 
            fontSize: '14px', 
            margin: '0',
            fontWeight: '500'
          }}>
            ⚠️ Este código expira en 10 minutos
          </p>
          <p style={{ 
            color: '#856404', 
            fontSize: '12px', 
            margin: '10px 0 0 0' 
          }}>
            Si no solicitaste este código, puedes ignorar este email.
          </p>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <p style={{ 
            color: '#999', 
            fontSize: '12px', 
            margin: '0' 
          }}>
            © 2024 iBluPS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

// Comentario: Template de email para OTP creado con Cursor
// Incluye diseño responsive y profesional para el envío de códigos de verificación
