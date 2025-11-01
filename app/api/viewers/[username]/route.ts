import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// ✅ Si tu proyecto usa App Router, usa este tipo de firma
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  context: { params: { username: string } } // ← quitar Promise<>
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
    return NextResponse.json({ viewers: 0 }, { status: 500 });
  }
}
