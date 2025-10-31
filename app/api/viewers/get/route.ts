// /app/api/viewers/get/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

// ⚙️ Usa 'nodejs' runtime porque Upstash puede fallar en Edge en algunas regiones
export const runtime = 'nodejs';

export async function GET() {
  try {
    // 🔹 Buscar todas las claves que empiecen con "viewers:"
    const keys = await redis.keys('viewers:*');

    if (!keys || keys.length === 0) {
      return NextResponse.json({
        data: [],
        message: 'No hay canales en vivo actualmente.',
      });
    }

    // 🔹 Obtener los valores actuales de cada canal
    const data = await Promise.all(
      keys.map(async (key) => {
        const username = key.replace('viewers:', '');
        const count = Number(await redis.get(key)) || 0;
        return { username, viewers: count };
      })
    );

    // 🔹 Filtrar solo los que tienen viewers activos (>0)
    const active = data.filter((ch) => ch.viewers > 0);

    return NextResponse.json({
      data: active,
      totalChannels: active.length,
    });
  } catch (error) {
    console.error('❌ Error al obtener viewers:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener viewers' },
      { status: 500 }
    );
  }
}
