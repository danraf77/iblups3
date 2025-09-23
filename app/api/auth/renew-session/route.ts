import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { renewSessionIfNeeded } from '../../../lib/supabase';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 });
    }

    // Renovar sesión si es necesario
    const renewed = await renewSessionIfNeeded(sessionToken);
    
    if (!renewed) {
      return NextResponse.json({ error: 'Sesión no válida o expirada' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sesión renovada correctamente' 
    });

  } catch (error) {
    console.error('Error renovando sesión:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: Endpoint para renovar sesiones creado con Cursor
// - Verifica sesión actual
// - Renueva automáticamente si es necesario
// - Maneja errores de sesión
// - Optimizado para persistencia de sesión
