import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // ⚡ Súper rápido (Vercel Edge)

export async function GET(req: NextRequest) {
  try {
    // 🧭 Detectar IP real del visitante
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';

    // 🌎 Consultar geolocalización
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!geoRes.ok) {
      throw new Error(`Geo lookup failed (${geoRes.status})`);
    }

    const data: {
      country_code?: string;
      region?: string;
      city?: string;
      org?: string;
      asn?: string;
      timezone?: string;
      latitude?: number;
      longitude?: number;
    } = await geoRes.json();

    const geo = {
      ip,
      country: data.country_code ?? '??',
      region: data.region ?? '',
      city: data.city ?? '',
      org: data.org ?? '',
      asn: data.asn ?? '',
      timezone: data.timezone ?? '',
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };

    return NextResponse.json(geo);
  } catch (err: unknown) {
    console.error('❌ Error en /api/geo:', err);
    return NextResponse.json(
      { error: 'Geo lookup failed', country: '??' },
      { status: 200 }
    );
  }
}
