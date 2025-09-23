import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    const sessionToken = request.cookies.get('iblups_session')?.value;

    if (!sessionToken) {
      // No hay sesión, redirigir a la página principal
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verificar si la sesión es válida
      const { data: session, error } = await supabase
        .from('iblups_user_sessions')
        .select('id, user_id, expires_at')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session) {
        // Sesión inválida o expirada, redirigir a la página principal
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Sesión válida, continuar
      return NextResponse.next();
    } catch (error) {
      console.error('Error verificando sesión en middleware:', error);
      // Error al verificar sesión, redirigir por seguridad
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Para otras rutas, continuar normalmente
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};

// Comentario: Middleware de protección de rutas creado con Cursor
// - Protege todas las rutas del dashboard
// - Verifica sesión válida en el servidor
// - Redirige automáticamente si no hay sesión
// - Manejo robusto de errores
