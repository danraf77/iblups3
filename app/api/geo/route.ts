import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // ⚡ Ideal para Vercel Edge Network

export async function GET(req: NextRequest) {
  try {
    // 🧭 Detectar IP real del visitante (compatibilidad total)
    const ip =
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      // En Vercel Edge, a veces está en req.ip
      // (no estándar pero manejado internamente)
      (req as any).ip ||
      '0.0.0.0';

    // Evitar llamadas innecesarias a ipapi.co en desarrollo local
    if (ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({
        ip,
        country: 'PE',
        region: 'Lima',
        city: 'Lima',
        org: 'Local Dev',
      });
    }

    // 🌎 Llamada a ipapi.co (gratis hasta 30K requests/día)
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'iblups-geo-lookup' },
      cache: 'no-store',
    });

    if (!geoRes.ok) {
      throw new Error(`Geo lookup failed (${geoRes.status})`);
    }

    const data = await geoRes.json();

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

    return NextResponse.json(geo, { status: 200 });
  } catch (err) {
    console.error('❌ Error en /api/geo:', err);
    return NextResponse.json(
      { error: 'Geo lookup failed', country: '??' },
      { status: 200 }
    );
  }
}
