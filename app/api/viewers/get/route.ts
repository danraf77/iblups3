// /app/api/viewers/get/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  const keys = await redis.keys('viewers:*');
  const data = await Promise.all(
    keys.map(async (key) => {
      const username = key.replace('viewers:', '');
      const count = await redis.get(key);
      return { username, viewers: Number(count || 0) };
    })
  );
  return NextResponse.json({ data });
}
