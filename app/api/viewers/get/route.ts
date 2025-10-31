// /app/api/viewers/get/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Obtener todas las keys de viewers
    const keys = await redis.keys('viewers:*');
    const data = await Promise.all(
      keys.map(async (key) => {
        const username = key.replace('viewers:', '');
        const count = Number(await redis.get(key)) || 0;
        return { username, viewers: count };
      })
    );

    // Filtrar canales con viewers > 0
    const filtered = data.filter((item) => item.viewers > 0);

    return NextResponse.json({ data: filtered });
  } catch (err) {
    console.error('Error obteniendo viewers:', err);
    return NextResponse.json({ data: [] });
  }
}
