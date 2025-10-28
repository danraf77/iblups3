// /app/api/viewers/[username]/route.ts
import { redis } from '@/lib/redis';

export const runtime = 'edge';

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> } // 👈 ahora es Promise
) {
  const { username } = await context.params; // 👈 await aquí

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
        await redis.expire(`viewers:${username}`, 60);

        // Mantener conexión viva y renovar TTL
        const interval = setInterval(async () => {
          await redis.expire(`viewers:${username}`, 60);
        }, 20000);

        req.signal.addEventListener('abort', async () => {
          clearInterval(interval);
          await redis.decr(`viewers:${username}`);
        });
      } catch (error) {
        console.error('Error SSE viewers:', error);
      }
    },
  });

  return new Response(stream, { headers });
}
