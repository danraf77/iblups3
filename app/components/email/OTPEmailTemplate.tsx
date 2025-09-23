import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OTPEmailTemplateProps {
  otpCode: string;
  email: string;
}

export function OTPEmailTemplate({ otpCode }: OTPEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu código de acceso a iblups</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg"
              alt="iblups"
              style={logo}
            />
          </Section>
          
          <Heading style={h1}>Código de acceso</Heading>
          
          <Text style={text}>
            Hola,
          </Text>
          
          <Text style={text}>
            Tu código de acceso para iblups es:
          </Text>
          
          <Section style={codeContainer}>
            <Text style={codeText}>{otpCode}</Text>
          </Section>
          
          <Text style={text}>
            Este código expira en 10 minutos. Si no solicitaste este código, puedes ignorar este email.
          </Text>
          
          <Text style={text}>
            ¡Gracias por usar iblups!
          </Text>
          
          <Section style={footer}>
            <Text style={footerText}>
              © 2024 iblups. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  height: '40px',
  width: 'auto',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const text = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px',
};

const codeContainer = {
  backgroundColor: '#f8f9fa',
  border: '2px solid #e9ecef',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const codeText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#007bff',
  letterSpacing: '4px',
  margin: '0',
  fontFamily: 'monospace',
};

const footer = {
  borderTop: '1px solid #eee',
  marginTop: '32px',
  paddingTop: '16px',
};

const footerText = {
  color: '#999',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
};

// Comentario: Template de email OTP creado con Cursor
// - Diseño profesional y responsive
// - Código OTP destacado visualmente
// - Branding de iblups
// - Estructura clara y legible
