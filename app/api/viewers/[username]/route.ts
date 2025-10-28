// /app/api/viewers/[username]/route.ts
import { redis } from '@/lib/redis';

export const runtime = 'edge';

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 🔼 Aumentar contador al conectar
        await redis.incr(`viewers:${username}`);
        await redis.expire(`viewers:${username}`, 20); // TTL de 20s

        // 🔁 Mientras la conexión esté viva, renovamos TTL cada 10s
        const renew = setInterval(async () => {
          await redis.expire(`viewers:${username}`, 20);
        }, 10000);

        // ❌ Si la conexión se cierra manualmente
        req.signal.addEventListener('abort', async () => {
          clearInterval(renew);
          await redis.decr(`viewers:${username}`);
        });

      } catch (err) {
        console.error('Error SSE viewers:', err);
      }
    },
  });

  return new Response(stream, { headers });
}
