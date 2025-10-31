import { redis } from '@/lib/redis';

export const runtime = 'edge';

// TTL por canal (memoria local en Edge)
const lastTTLRefresh: Record<string, number> = {};

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  // 🔸 1. Si viene ?disconnect=1 (cuando el viewer cierra la pestaña)
  const url = new URL(req.url);
  const disconnect = url.searchParams.get('disconnect');

  if (disconnect === '1') {
    try {
      await redis.decr(`viewers:${username}`);
      console.log(`👋 Viewer desconectado de ${username}`);
      return new Response('disconnected', { status: 200 });
    } catch (error) {
      console.error('Error al decrementar viewer:', error);
      return new Response('error', { status: 500 });
    }
  }

  // 🔸 2. Stream SSE normal (cuando el viewer entra)
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  };

  const stream = new ReadableStream({
    async start() {
      try {
        // 🔼 Nuevo viewer conectado
        await redis.incr(`viewers:${username}`);
        await redis.expire(`viewers:${username}`, 40); // TTL inicial (40s)

        // 🔁 Renovar TTL global cada 20s solo una vez por canal
        const interval = setInterval(async () => {
          const now = Date.now();
          if (!lastTTLRefresh[username] || now - lastTTLRefresh[username] > 20000) {
            await redis.expire(`viewers:${username}`, 40);
            lastTTLRefresh[username] = now;
          }
        }, 10000);

        // ❌ Si el navegador cierra la conexión
        req.signal.addEventListener('abort', async () => {
          clearInterval(interval);
          try {
            await redis.decr(`viewers:${username}`);
            console.log(`❌ Viewer salió de ${username}`);
          } catch (error) {
            console.error('Error al decrementar viewer en abort:', error);
          }
        });
      } catch (error) {
        console.error('Error en SSE viewers:', error);
      }
    },
  });

  return new Response(stream, { headers });
}
