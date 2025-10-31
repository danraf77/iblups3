// /app/api/viewers/get/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const keys = await redis.keys('viewers:*:*');
  const channels = new Map<string, number>();

  for (const key of keys) {
    const [, channel] = key.split(':');
    if (!channel) continue;
    channels.set(channel, (channels.get(channel) || 0) + 1);
  }

  const data = Array.from(channels.entries()).map(([username, viewers]) => ({
    username,
    viewers,
  }));

  return NextResponse.json({ data });
}
