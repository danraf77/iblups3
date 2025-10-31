// /app/api/viewers/get/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const keys = await redis.keys('viewers:*:*');
  const channels = new Map<string, number>();

  for (const key of keys) {
    const parts = key.split(':');
    if (parts.length < 3) continue;
    const channel = parts[1];

    // solo contar sesiones aún válidas
    const ttl = await redis.ttl(key);
    if (ttl > 0) {
      channels.set(channel, (channels.get(channel) || 0) + 1);
    }
  }

  const data = Array.from(channels.entries()).map(([username, viewers]) => ({
    username,
    viewers,
  }));

  return NextResponse.json({ data });
}
