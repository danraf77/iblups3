import { redis } from '@/lib/redis';

export const runtime = 'edge';

function genSessionId() {
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const sessionId = genSessionId();

  // clave única por viewer
  const key = `viewers:${username}:${sessionId}`;

  // registrar sesión (expira en 40s)
  await redis.set(key, 1, { ex: 40 });

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  };

  // mantener viva la conexión y renovar TTL mientras siga activa
  const stream = new ReadableStream({
    async start() {
      const interval = setInterval(async () => {
        await redis.expire(key, 40);
      }, 20000);

      req.signal.addEventListener('abort', async () => {
        clearInterval(interval);
        // no hacemos DEL, dejamos que expire naturalmente
      });
    },
  });

  return new Response(stream, { headers });
}
