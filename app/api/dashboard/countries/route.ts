import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Buscar países activos
    const { data: countries, error: countriesError } = await supabase
      .from('channels_country')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (countriesError) {
      console.error('Error buscando países:', countriesError);
      return NextResponse.json({ error: 'Error obteniendo países' }, { status: 500 });
    }

    return NextResponse.json(countries || []);

  } catch (error) {
    console.error('Error en /api/dashboard/countries:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para países del dashboard creada con Cursor
// - Retorna lista de países activos
// - Ordenados alfabéticamente
// - Para uso en formularios de perfil
