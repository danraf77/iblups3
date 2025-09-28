import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            await jwtVerify(token.value, secret);
            // Verificar autenticación pero no necesitamos userId para países - Cursor

    // Obtener lista de países desde channels_country - Cursor
    const { data: countries, error: countriesError } = await supabase
      .from('channels_country')
      .select('id, name')
      .order('name', { ascending: true });

    if (countriesError) {
      console.error('Error fetching countries:', countriesError);
      return NextResponse.json(
        { error: 'Error obteniendo países' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      countries: countries || []
    });

  } catch (error) {
    console.error('Error en /api/dashboard/countries:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
