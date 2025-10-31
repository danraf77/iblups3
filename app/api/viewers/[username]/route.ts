import { redis } from '@/lib/redis';

export const runtime = 'edge';

// 🔹 Crea un ID único por viewer
function genSessionId() {
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const url = new URL(req.url);
  const disconnect = url.searchParams.get('disconnect');

  // 🚪 Si viene disconnect=1 → elimina la sesión inmediatamente
  if (disconnect === '1') {
    const session = url.searchParams.get('session');
    if (session) {
      await redis.del(`viewers:${username}:${session}`);
    }
    return new Response('disconnected', { status: 200 });
  }

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  };

  const sessionId = genSessionId();
  const key = `viewers:${username}:${sessionId}`;

  const stream = new ReadableStream({
    async start() {
      try {
        // 👁️ Registrar viewer (expira en 40 s)
        await redis.set(key, 1, { ex: 40 });

        // ♻️ Renovar TTL cada 20 s mientras siga conectado
        const refresh = setInterval(async () => {
          await redis.expire(key, 40);
        }, 20000);

        req.signal.addEventListener('abort', async () => {
          clearInterval(refresh);
          await redis.del(key);
        });
      } catch (error) {
        console.error('Error en viewers SSE:', error);
      }
    },
  });

  return new Response(stream, { headers });
}
