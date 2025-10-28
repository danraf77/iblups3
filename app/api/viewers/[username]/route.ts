// /app/api/viewers/[username]/route.ts
import { redis } from '@/lib/redis';

export const runtime = 'edge';

// ⚙️ Configuración
const CONFIG = {
  HEARTBEAT_INTERVAL: 15000,      // 15s - Renueva presencia
  VIEWER_TIMEOUT: 35000,          // 35s - Timeout para considerar viewer inactivo
  CLEANUP_INTERVAL: 20000,        // 20s - Limpia viewers zombies
  COUNT_UPDATE_INTERVAL: 10000,   // 10s - Envía conteo actualizado
  INITIAL_HEARTBEAT: 5000,        // 5s - Primer heartbeat rápido
} as const;

// 🎯 Tipos
interface ViewerCountData {
  count: number;
  timestamp: number;
}

interface PingData {
  timestamp: number;
}

type SSEData = ViewerCountData | PingData;

/**
 * Genera un ID de sesión único y corto
 */
function generateSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Limpia viewers inactivos (zombies) de Redis
 */
async function cleanupZombieViewers(username: string): Promise<number> {
  try {
    const key = `viewers:${username}`;
    const cutoff = Date.now() - CONFIG.VIEWER_TIMEOUT;
    
    // Elimina viewers con timestamp anterior al cutoff
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

/**
 * Obtiene el conteo actual de viewers activos
 */
async function getActiveViewerCount(username: string): Promise<number> {
  try {
    const key = `viewers:${username}`;
    
    // Limpia zombies antes de contar
    await cleanupZombieViewers(username);
    
    // Cuenta viewers activos
    const count = await redis.zcard(key);
    
    return count;
  } catch (error) {
    console.error(`❌ [${username}] Error obteniendo conteo:`, error);
    return 0;
  }
}

/**
 * Registra o actualiza el timestamp de un viewer
 */
async function updateViewerPresence(username: string, sessionId: string): Promise<void> {
  try {
    const key = `viewers:${username}`;
    const timestamp = Date.now();
    
    // Usa ZADD para agregar/actualizar con timestamp como score
    await redis.zadd(key, { score: timestamp, member: sessionId });
    
    // Expira la key completa después de 1 hora de inactividad total
    await redis.expire(key, 3600);
  } catch (error) {
    console.error(`❌ [${username}/${sessionId}] Error actualizando presencia:`, error);
  }
}

/**
 * Elimina un viewer específico
 */
async function removeViewer(username: string, sessionId: string): Promise<void> {
  try {
    const key = `viewers:${username}`;
    await redis.zrem(key, sessionId);
    console.log(`👋 [${username}/${sessionId}] Viewer eliminado`);
  } catch (error) {
    console.error(`❌ [${username}/${sessionId}] Error eliminando viewer:`, error);
  }
}

/**
 * Maneja la conexión SSE de un viewer
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const sessionId = generateSessionId();
  
  console.log(`👁️ [${username}/${sessionId}] Nuevo viewer conectado`);

  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Desactiva buffering en nginx
  };

  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      // 📊 Timers
      let heartbeatTimer: NodeJS.Timeout | null = null;
      let cleanupTimer: NodeJS.Timeout | null = null;
      let countUpdateTimer: NodeJS.Timeout | null = null;

      /**
       * Envía un mensaje SSE al cliente
       */
      const sendMessage = (event: string, data: SSEData): void => {
        if (isClosed) return;
        
        try {
          const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          console.error(`❌ [${username}/${sessionId}] Error enviando mensaje:`, error);
        }
      };

      /**
       * Envía conteo actualizado de viewers
       */
      const sendViewerCount = async (): Promise<void> => {
        const count = await getActiveViewerCount(username);
        sendMessage('count', { count, timestamp: Date.now() });
      };

      /**
       * Limpieza completa de recursos
       */
      const cleanup = async (): Promise<void> => {
        if (isClosed) return;
        isClosed = true;

        console.log(`🧹 [${username}/${sessionId}] Iniciando cleanup`);

        // Limpia timers
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        if (cleanupTimer) clearInterval(cleanupTimer);
        if (countUpdateTimer) clearInterval(countUpdateTimer);

        // Elimina viewer de Redis
        await removeViewer(username, sessionId);

        // Envía conteo final actualizado (para otros viewers)
        try {
          const finalCount = await getActiveViewerCount(username);
          console.log(`📊 [${username}] Viewers restantes: ${finalCount}`);
        } catch (error) {
          console.error(`❌ [${username}] Error obteniendo conteo final:`, error);
        }

        // Cierra el stream
        try {
          controller.close();
        } catch {
          // Stream ya cerrado
        }
      };

      try {
        // 🎬 Registra viewer inicial
        await updateViewerPresence(username, sessionId);
        
        // 📊 Envía conteo inicial inmediatamente
        await sendViewerCount();

        // 💓 Heartbeat inicial rápido (5s)
        setTimeout(async () => {
          await updateViewerPresence(username, sessionId);
        }, CONFIG.INITIAL_HEARTBEAT);

        // 💓 Heartbeat periódico (15s) - Mantiene viewer activo
        heartbeatTimer = setInterval(async () => {
          if (isClosed) return;
          
          await updateViewerPresence(username, sessionId);
          
          // Envía ping para mantener conexión viva
          sendMessage('ping', { timestamp: Date.now() });
        }, CONFIG.HEARTBEAT_INTERVAL);

        // 🧹 Cleanup periódico de zombies (20s)
        cleanupTimer = setInterval(async () => {
          if (isClosed) return;
          
          const removed = await cleanupZombieViewers(username);
          
          // Si se limpiaron zombies, envía conteo actualizado
          if (removed > 0) {
            await sendViewerCount();
          }
        }, CONFIG.CLEANUP_INTERVAL);

        // 📊 Actualización periódica de conteo (10s)
        countUpdateTimer = setInterval(async () => {
          if (isClosed) return;
          await sendViewerCount();
        }, CONFIG.COUNT_UPDATE_INTERVAL);

        // 📴 Listener de desconexión del cliente
        req.signal.addEventListener('abort', () => {
          console.log(`📴 [${username}/${sessionId}] Cliente desconectado`);
          cleanup();
        });

      } catch (error) {
        console.error(`❌ [${username}/${sessionId}] Error en start:`, error);
        cleanup();
      }
    },

    // Se ejecuta cuando el stream se cancela
    cancel() {
      console.log(`🚫 [${username}/${sessionId}] Stream cancelado`);
      isClosed = true;
    }
  });

  return new Response(stream, { headers });
}

/**
 * Endpoint opcional para obtener conteo sin SSE
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    const count = await getActiveViewerCount(username);
    
    return Response.json({ 
      username,
      count,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error en POST viewers:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}