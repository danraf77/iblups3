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
    async start() {
      try {
        // 🔼 Incrementar el contador de viewers del canal
        await redis.incr(`viewers:${username}`);
        // ⏳ Establecer TTL de 30s (autoelimación si no se renueva)
        await redis.expire(`viewers:${username}`, 30);

        // ❌ Cuando el usuario cierre el player o pestaña
        req.signal.addEventListener('abort', async () => {
          try {
            await redis.decr(`viewers:${username}`);
          } catch (err) {
            console.error('Error al decrementar viewer:', err);
          }
        });
      } catch (err) {
        console.error('Error en viewers SSE:', err);
      }
    },
  });

  return new Response(stream, { headers });
}
