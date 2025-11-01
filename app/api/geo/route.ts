import { NextResponse } from 'next/server';
import { geolocation } from '@vercel/edge';

export const runtime = 'edge';

export async function GET() {
  try {
    // 📍 Obtener la ubicación directamente desde la Edge Network de Vercel
    const geo = geolocation();

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
    return NextResponse.json(
      { country: '??', region: '', city: '' },
      { status: 200 }
    );
  }
}
