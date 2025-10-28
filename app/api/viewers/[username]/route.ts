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
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Incrementar viewers
        await redis.incr(`viewers:${username}`);
        await redis.expire(`viewers:${username}`, 30); // TTL de 30 s

        // 🔁 Cada 10 s renueva el TTL mientras la conexión esté viva
        const ttlInterval = setInterval(async () => {
          await redis.expire(`viewers:${username}`, 30);
        }, 10000);

        // Cuando el navegador cierra o recarga, el abort debería dispararse
        req.signal.addEventListener('abort', async () => {
          clearInterval(ttlInterval);
          await redis.decr(`viewers:${username}`);
        });
      } catch (error) {
        console.error('Error SSE viewers:', error);
      }
    },
  });

  return new Response(stream, { headers });
}
