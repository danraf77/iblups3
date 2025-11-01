import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // ⚡ Súper rápido (se ejecuta en el edge)

export async function GET(req: NextRequest) {
  try {
    // 🧭 Detectar IP real del visitante
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';

    // 🌎 API pública gratuita (sin API key)
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!geoRes.ok) {
      throw new Error(`Error al consultar IP: ${geoRes.statusText}`);
    }

    const data = await geoRes.json();

    const geo = {
      ip,
      country: data.country_code || '??',
      region: data.region || '',
      city: data.city || '',
      org: data.org || '',
      asn: data.asn || '',
      timezone: data.timezone || '',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };

    return NextResponse.json(geo);
  } catch (err: any) {
    console.error('❌ Error en /api/geo:', err);
    return NextResponse.json(
      { error: 'Geo lookup failed', country: '??' },
      { status: 200 }
    );
  }
}
