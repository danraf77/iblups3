import { NextResponse } from 'next/server';
import { geolocation } from '@vercel/edge';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // 📍 Obtener la ubicación directamente desde la Edge Network de Vercel
    // Cambio realizado por Cursor: geolocation() requiere el Request como argumento
    const geo = geolocation(request);

    const data = {
      country: geo.country || '??',
      region: geo.region || '',
      city: geo.city || '',
      latitude: geo.latitude ?? null,
      longitude: geo.longitude ?? null,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('❌ Error en /api/geo:', err);
    // Cambio realizado por Cursor: incluir latitude y longitude en respuesta de error para consistencia
    return NextResponse.json(
      { country: '??', region: '', city: '', latitude: null, longitude: null },
      { status: 200 }
    );
  }
}
