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
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verificar JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);
    
    const { userId, sessionToken } = payload as { userId: string; sessionToken: string };

    // Marcar sesión como inactiva
    await supabase
      .from('iblups_user_sessions')
      .update({ 
        is_active: false,
        closed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('session_token', sessionToken);

    // Limpiar cookie
    cookieStore.delete('auth-token');

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Error in /api/auth/logout:', error);
    
    // Limpiar cookie incluso si hay error
    const cookieStore = cookies();
    cookieStore.delete('auth-token');
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Comentario: API route para logout creada con Cursor
// Invalida sesión en base de datos y limpia cookies de autenticación
