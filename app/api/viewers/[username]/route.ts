import { redis } from '@/lib/redis';

export const runtime = 'edge';

const CONFIG = {
  HEARTBEAT_INTERVAL: 5000,       // 5s - Renueva presencia
  VIEWER_TIMEOUT: 12000,          // 12s - Timeout
  CLEANUP_INTERVAL: 3000,         // 3s - Limpia zombies
  KEEPALIVE_INTERVAL: 15000,      // 15s - Mensaje keepalive
} as const;

interface ViewerCountData {
  count: number;
  timestamp: number;
}

interface PingData {
  timestamp: number;
}

type SSEData = ViewerCountData | PingData;

function generateSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

async function cleanupZombieViewers(username: string): Promise<number> {
  try {
    const key = `viewers:${username}`;
    const cutoff = Date.now() - CONFIG.VIEWER_TIMEOUT;
    const removed = await redis.zremrangebyscore(key, 0, cutoff);
    
    if (removed > 0) {
      console.log(`🧹 [${username}] Limpiados ${removed} viewers zombies`);
    }
    
    return removed;
  } catch (error) {
    console.error(`❌ [${username}] Error limpiando zombies:`, error);
    return 0;
  }
}

async function getActiveViewerCount(username: string): Promise<number> {
  try {
    const key = `viewers:${username}`;
    await cleanupZombieViewers(username);
    const count = await redis.zcard(key);
    return count;
  } catch (error) {
    console.error(`❌ [${username}] Error obteniendo conteo:`, error);
    return 0;
  }
}

async function updateViewerPresence(username: string, sessionId: string): Promise<boolean> {
  try {
    const key = `viewers:${username}`;
    const timestamp = Date.now();
    await redis.zadd(key, { score: timestamp, member: sessionId });
    await redis.expire(key, 3600);
    return true;
  } catch (error) {
    console.error(`❌ [${username}/${sessionId}] Error actualizando:`, error);
    return false;
  }
}

async function removeViewer(username: string, sessionId: string): Promise<boolean> {
  try {
    const key = `viewers:${username}`;
    const result = await redis.zrem(key, sessionId);
    
    if (result > 0) {
      console.log(`👋 [${username}/${sessionId}] Viewer eliminado`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error eliminando:`, error);
    return false;
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const sessionId = generateSessionId();
  
  console.log(`👁️ [${username}/${sessionId}] Conectado`);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      let lastHeartbeat = Date.now();
      let lastCleanup = Date.now();
      let lastCount = 0;

      const sendMessage = (event: string, data: SSEData): void => {
        if (isClosed) return;
        try {
          const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          console.error(`❌ Error enviando:`, error);
          isClosed = true;
        }
      };

      const sendKeepAlive = (): void => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch (error) {
          isClosed = true;
        }
      };

      const sendViewerCount = async (force = false): Promise<void> => {
        const count = await getActiveViewerCount(username);
        if (force || count !== lastCount) {
          lastCount = count;
          sendMessage('count', { count, timestamp: Date.now() });
          console.log(`📊 [${username}/${sessionId}] Count: ${count}`);
        }
      };

      const cleanup = async (): Promise<void> => {
        if (isClosed) return;
        isClosed = true;
        console.log(`🧹 [${username}/${sessionId}] Cleanup final`);
        await removeViewer(username, sessionId);
        try {
          controller.close();
        } catch {
          // Ya cerrado
        }
      };

      // Registra viewer inicial
      await updateViewerPresence(username, sessionId);
      await sendViewerCount(true);

      // Cleanup en desconexión
      req.signal.addEventListener('abort', cleanup);

      // 🔥 LOOP PRINCIPAL - Mantiene la conexión viva
      try {
        while (!isClosed && !req.signal.aborted) {
          const now = Date.now();

          // 💓 Heartbeat cada 5s
          if (now - lastHeartbeat >= CONFIG.HEARTBEAT_INTERVAL) {
            const success = await updateViewerPresence(username, sessionId);
            if (success) {
              sendMessage('ping', { timestamp: now });
            }
            lastHeartbeat = now;
          }

          // 🧹 Cleanup cada 3s
          if (now - lastCleanup >= CONFIG.CLEANUP_INTERVAL) {
            const removed = await cleanupZombieViewers(username);
            if (removed > 0) {
              await sendViewerCount(true);
            } else {
              await sendViewerCount(false);
            }
            lastCleanup = now;
          }

          // 📡 Keepalive cada 15s
          sendKeepAlive();

          // Espera 1 segundo antes del siguiente ciclo
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error en loop:`, error);
      } finally {
        cleanup();
      }
    },

    cancel() {
      console.log(`🚫 Stream cancelado`);
    }
  });

  return new Response(stream, { headers });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    await cleanupZombieViewers(username);
    const count = await getActiveViewerCount(username);
    
    return Response.json({ 
      username,
      count,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error en POST:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}