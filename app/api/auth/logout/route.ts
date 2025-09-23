import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (sessionToken) {
      // Marcar sesión como inactiva
      await supabase
        .from('iblups_user_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken);
    }

    // Eliminar cookie
    cookieStore.delete('iblups_session');

    return NextResponse.json({ 
      success: true, 
      message: 'Sesión cerrada correctamente' 
    });

  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para cerrar sesión creada con Cursor
// - Marca sesión como inactiva en BD
// - Elimina cookie del navegador
// - Maneja errores apropiadamente
