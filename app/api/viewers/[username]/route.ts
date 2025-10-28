// /app/api/viewers/[username]/route.ts
import { redis } from '@/lib/redis';

export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  const stream = new ReadableStream({
    async start(controller) {
      // Sumar viewer
      await redis.incr(`viewers:${username}`);
      await redis.expire(`viewers:${username}`, 60); // auto cleanup

      // Mantener conexión abierta
      const interval = setInterval(async () => {
        await redis.expire(`viewers:${username}`, 60);
      }, 20000); // refresh TTL cada 20s

      // Cuando se cierra la conexión
      req.signal.addEventListener('abort', async () => {
        clearInterval(interval);
        await redis.decr(`viewers:${username}`);
      });
    },
  });

  return new Response(stream, { headers });
}
