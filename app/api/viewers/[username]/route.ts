// /app/api/viewers/[username]/route.ts
import { redis } from '@/lib/redis';

// Edge runtime compatible
export const runtime = 'edge';

function randomSessionId() {
  // Genera ID corto tipo "a1b2c3d4"
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const sessionId = randomSessionId(); // ID único por viewer

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  };

  const key = `viewers:${username}:${sessionId}`;

  const stream = new ReadableStream({
    async start() {
      try {
        // 👁️ Marca esta sesión como activa por 25 s
        await redis.set(key, 1, { ex: 25 });

        // ♻️ Mientras siga conectada, renueva TTL cada 10 s
        const interval = setInterval(async () => {
          await redis.expire(key, 25);
        }, 10000);

        // 📴 Si el cliente se desconecta
        req.signal.addEventListener('abort', async () => {
          clearInterval(interval);
          await redis.del(key); // elimina inmediatamente
        });
      } catch (err) {
        console.error('Error en viewers SSE:', err);
      }
    },
  });

  return new Response(stream, { headers });
}
