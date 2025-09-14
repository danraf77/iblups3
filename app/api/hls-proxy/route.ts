import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hlsUrl = searchParams.get('url');

  if (!hlsUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Headers correctos que funcionan con el servidor HLS
    const response = await fetch(hlsUrl, {
      headers: {
        'Referer': 'https://iblups.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'application/vnd.apple.mpegurl,application/x-mpegURL,*/*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://iblups.com'
      }
    });

    if (!response.ok) {
      console.error(`HLS Proxy Error: ${response.status} ${response.statusText} for URL: ${hlsUrl}`);
      return NextResponse.json(
        { 
          error: `Failed to fetch HLS stream: ${response.status} ${response.statusText}`,
          url: hlsUrl,
          details: 'The HLS server returned an error. This might be due to authentication, CORS, or the stream being unavailable.'
        },
        { status: response.status }
      );
    }

    const data = await response.text();
    
    // Devolver el contenido HLS con headers CORS apropiados
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range, Accept-Encoding',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('HLS proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during HLS proxy',
        details: error instanceof Error ? error.message : 'Unknown error',
        url: hlsUrl
      },
      { status: 500 }
    );
  }
}

// Comentario: Proxy HLS creado con Cursor
// - Evita problemas de CORS con streams HLS
// - Headers apropiados para el servidor HLS
// - Manejo de errores robusto
