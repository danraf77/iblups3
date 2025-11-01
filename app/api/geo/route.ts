import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // ⚡ Ideal para Vercel Edge Network

export async function GET(req: NextRequest) {
  try {
    // 🧭 Detectar IP real del visitante (optimizado para Vercel Edge) - Cursor
    // En Vercel, la IP del cliente está en diferentes headers según el contexto
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const vercelIp = req.headers.get('x-vercel-forwarded-for');
    
    let ip = '0.0.0.0';
    
    // Prioridad: vercel header > real-ip > forwarded-for > fallback - Cursor
    if (vercelIp) {
      ip = vercelIp.split(',')[0]?.trim() || ip;
    } else if (realIp) {
      ip = realIp;
    } else if (forwardedFor) {
      ip = forwardedFor.split(',')[0]?.trim() || ip;
    }

    // Validar que la IP no sea privada o local - Cursor
    const isPrivateIP = ip.startsWith('127.') || 
                       ip.startsWith('192.168.') || 
                       ip.startsWith('10.') ||
                       ip.startsWith('172.16.') ||
                       ip === '::1' ||
                       ip === '0.0.0.0';

    // Evitar llamadas innecesarias a ipapi.co en desarrollo local - Cursor
    if (isPrivateIP) {
      return NextResponse.json({
        ip,
        country: 'PE',
        country_name: 'Peru',
        region: 'Lima',
        city: 'Lima',
        org: 'Local Dev',
        asn: '',
        timezone: 'America/Lima',
        latitude: null,
        longitude: null,
      });
    }

    // 🌎 Llamada a ipapi.co (gratis hasta 30K requests/día) - Cursor
    // Crear AbortController para timeout (compatible con Edge Runtime) - Cursor
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos máximo
    
    let geoRes;
    try {
      geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: { 
          'User-Agent': 'iblups-geo-lookup',
          'Accept': 'application/json',
        },
        // En Edge Runtime, usar no-store para evitar caché - Cursor
        cache: 'no-store',
        // Timeout para evitar que se cuelgue - Cursor
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Si el fetch falla (timeout, red, etc.) - Cursor
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.warn(`⚠️ Geo lookup timeout for IP: ${ip}`);
      } else {
        console.warn(`⚠️ Geo lookup fetch error for IP: ${ip}:`, fetchError);
      }
      return NextResponse.json({
        ip,
        country: '??',
        country_name: 'Unknown',
        region: '',
        city: '',
        org: '',
        asn: '',
        timezone: '',
        latitude: null,
        longitude: null,
        error: 'Geo lookup request failed',
      }, { status: 200 }); // Status 200 para que el frontend no falle - Cursor
    }
    
    clearTimeout(timeoutId);

    if (!geoRes.ok) {
      // Si el servicio está caído, devolver un fallback - Cursor
      console.warn(`⚠️ Geo lookup failed (${geoRes.status}) for IP: ${ip}`);
      return NextResponse.json({
        ip,
        country: '??',
        country_name: 'Unknown',
        region: '',
        city: '',
        org: '',
        asn: '',
        timezone: '',
        latitude: null,
        longitude: null,
        error: 'Geo lookup service unavailable',
      }, { status: 200 }); // Status 200 para que el frontend no falle - Cursor
    }

    const data = await geoRes.json();

    // Manejar errores de ipapi.co (puede devolver error en el JSON) - Cursor
    if (data.error) {
      console.warn(`⚠️ ipapi.co error: ${data.reason || 'Unknown error'} for IP: ${ip}`);
      return NextResponse.json({
        ip,
        country: '??',
        country_name: 'Unknown',
        region: '',
        city: '',
        org: '',
        asn: '',
        timezone: '',
        latitude: null,
        longitude: null,
        error: data.reason || 'Geo lookup error',
      }, { status: 200 });
    }

    // Construir respuesta con datos normalizados - Cursor
    const geo = {
      ip,
      country: data.country_code ?? '??',
      country_name: data.country_name ?? '',
      region: data.region ?? '',
      city: data.city ?? '',
      org: data.org ?? '',
      asn: data.asn ?? '',
      timezone: data.timezone ?? '',
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    };

    return NextResponse.json(geo, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache por 1 hora - Cursor
      },
    });
  } catch (err) {
    // Manejo de errores mejorado - Cursor
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Error en /api/geo:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Geo lookup failed',
        country: '??',
        country_name: 'Unknown',
        ip: '0.0.0.0',
        region: '',
        city: '',
        org: '',
        asn: '',
        timezone: '',
        latitude: null,
        longitude: null,
      },
      { status: 200 } // Status 200 para que el frontend no falle - Cursor
    );
  }
}
