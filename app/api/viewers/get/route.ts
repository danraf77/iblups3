// /app/api/viewers/get/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const keys = await redis.keys('viewers:*');
  const data = await Promise.all(
    keys.map(async (key) => {
      const username = key.replace('viewers:', '');
      const count = Number(await redis.get(key)) || 0;
      return { username, viewers: count };
    })
  );
  return NextResponse.json({ data: data.filter(d => d.viewers > 0) });
}
