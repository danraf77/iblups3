import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  
  // Rutas de API que requieren autenticación
  const protectedApiRoutes = ['/api/user', '/api/sessions'];
  
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute || isProtectedApiRoute) {
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      } else {
        // Redirigir a la página principal para rutas protegidas
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Comentario: Middleware de autenticación creado con Cursor
// Protege rutas específicas y maneja redirecciones para usuarios no autenticados
