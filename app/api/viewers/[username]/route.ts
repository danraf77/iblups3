import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  context: { params: Promise<{ username: string }> } // 👈 Next 15 ahora pasa Promise
) {
  try {
    const { username } = await context.params; // 👈 se resuelve con await

    if (!username) {
      return NextResponse.json({ viewers: 0 });
    }

    const count = Number(await redis.get(`viewers:${username}`)) || 0;
    return NextResponse.json({ viewers: count });
  } catch (error) {
    console.error('❌ Error obteniendo viewers:', error);
    return NextResponse.json({ viewers: 0 }, { status: 500 });
  }
}
