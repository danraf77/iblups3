import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  context: { params: { username: string } }
) {
  try {
    const { username } = context.params;
    if (!username) {
      return NextResponse.json({ viewers: 0 });
    }

    const count = Number(await redis.get(`viewers:${username}`)) || 0;

    return NextResponse.json({ viewers: count });
  } catch (error) {
    console.error('❌ Error obteniendo viewers:', error);
    return NextResponse.json({ viewers: 0 });
  }
}
