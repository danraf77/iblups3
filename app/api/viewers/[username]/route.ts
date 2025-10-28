// /app/api/viewers/[username]/route.ts
import { redis } from '@/lib/redis';

export const runtime = 'edge';

// ⚙️ Configuración optimizada para detección rápida
const CONFIG = {
  HEARTBEAT_INTERVAL: 8000,       // 8s - Renueva presencia
  VIEWER_TIMEOUT: 20000,          // 20s - Timeout para considerar viewer inactivo (más agresivo)
  CLEANUP_INTERVAL: 6000,         // 6s - Limpia viewers zombies frecuentemente
  COUNT_BROADCAST_INTERVAL: 5000, // 5s - Envía conteo actualizado
  INITIAL_HEARTBEAT: 2000,        // 2s - Primer heartbeat rápido
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
 * Retorna el número de viewers eliminados
 */
async function cleanupZombieViewers(username: string): Promise<number> {
  try {
    const key = `viewers:${username}`;
    const cutoff = Date.now() - CONFIG.VIEWER_TIMEOUT;
    
    // Elimina viewers con timestamp anterior al cutoff
    const removed = await redis.zremrangebyscore(key, 0, cutoff);
    
    if (removed > 0) {
      console.log(`🧹 [${username}] Limpiados ${removed} viewers zombies (cutoff: ${new Date(cutoff).toISOString()})`);
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
async function updateViewerPresence(username: string, sessionId: string): Promise<boolean> {
  try {
    const key = `viewers:${username}`;
    const timestamp = Date.now();
    
    // Usa ZADD para agregar/actualizar con timestamp como score
    await redis.zadd(key, { score: timestamp, member: sessionId });
    
    // Expira la key completa después de 2 horas de inactividad total
    await redis.expire(key, 7200);
    
    return true;
  } catch (error) {
    console.error(`❌ [${username}/${sessionId}] Error actualizando presencia:`, error);
    return false;
  }
}

/**
 * Elimina un viewer específico
 */
async function removeViewer(username: string, sessionId: string): Promise<boolean> {
  try {
    const key = `viewers:${username}`;
    const result = await redis.zrem(key, sessionId);
    
    if (result > 0) {
      console.log(`👋 [${username}/${sessionId}] Viewer eliminado exitosamente`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ [${username}/${sessionId}] Error eliminando viewer:`, error);
    return false;
  }
}

/**
 * Obtiene todos los viewers activos (para debugging)
 */
async function getActiveViewers(username: string): Promise<string[]> {
  try {
    const key = `viewers:${username}`;
    const cutoff = Date.now() - CONFIG.VIEWER_TIMEOUT;
    
    // Obtiene solo viewers con timestamp reciente
    const viewers = await redis.zrangebyscore(key, cutoff, '+inf');
    
    return viewers;
  } catch (error) {
    console.error(`❌ [${username}] Error obteniendo viewers activos:`, error);
    return [];
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
  let lastCount = 0;

  const stream = new ReadableStream({
    async start(controller) {
      // 📊 Timers
      let heartbeatTimer: NodeJS.Timeout | null = null;
      let cleanupTimer: NodeJS.Timeout | null = null;
      let countBroadcastTimer: NodeJS.Timeout | null = null;

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
       * Envía conteo actualizado de viewers (solo si cambió)
       */
      const sendViewerCount = async (force = false): Promise<void> => {
        const count = await getActiveViewerCount(username);
        
        // Solo envía si el conteo cambió o es forzado
        if (force || count !== lastCount) {
          lastCount = count;
          sendMessage('count', { count, timestamp: Date.now() });
          console.log(`📊 [${username}/${sessionId}] Conteo actualizado: ${count} viewers`);
        }
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
        if (countBroadcastTimer) clearInterval(countBroadcastTimer);

        // Elimina viewer de Redis
        const removed = await removeViewer(username, sessionId);
        
        if (removed) {
          // Log viewers restantes
          const remainingViewers = await getActiveViewers(username);
          console.log(`📊 [${username}] Viewers activos: ${remainingViewers.length} - IDs: ${remainingViewers.join(', ')}`);
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
        await sendViewerCount(true);
        
        // Log de viewers activos inicial
        const activeViewers = await getActiveViewers(username);
        console.log(`✅ [${username}/${sessionId}] Registrado. Total viewers: ${activeViewers.length}`);

        // 💓 Heartbeat inicial rápido (2s)
        setTimeout(async () => {
          if (isClosed) return;
          const success = await updateViewerPresence(username, sessionId);
          if (!success) {
            console.error(`⚠️ [${username}/${sessionId}] Falló heartbeat inicial`);
          }
        }, CONFIG.INITIAL_HEARTBEAT);

        // 💓 Heartbeat periódico (8s) - Mantiene viewer activo
        heartbeatTimer = setInterval(async () => {
          if (isClosed) return;
          
          const success = await updateViewerPresence(username, sessionId);
          
          if (success) {
            // Envía ping para mantener conexión viva
            sendMessage('ping', { timestamp: Date.now() });
          } else {
            console.error(`⚠️ [${username}/${sessionId}] Falló actualización de presencia`);
            cleanup();
          }
        }, CONFIG.HEARTBEAT_INTERVAL);

        // 🧹 Cleanup periódico de zombies (6s) - MUY IMPORTANTE
        cleanupTimer = setInterval(async () => {
          if (isClosed) return;
          
          const removed = await cleanupZombieViewers(username);
          
          // Si se limpiaron zombies, envía conteo actualizado
          if (removed > 0) {
            await sendViewerCount(true);
          }
        }, CONFIG.CLEANUP_INTERVAL);

        // 📊 Broadcast periódico de conteo (5s)
        countBroadcastTimer = setInterval(async () => {
          if (isClosed) return;
          await sendViewerCount(false);
        }, CONFIG.COUNT_BROADCAST_INTERVAL);

        // 📴 Listener de desconexión del cliente (backup, no confiable en Edge)
        req.signal.addEventListener('abort', () => {
          console.log(`📴 [${username}/${sessionId}] Cliente desconectado (abort event)`);
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
 * Endpoint para obtener conteo sin SSE
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    
    // Limpia zombies antes de retornar
    await cleanupZombieViewers(username);
    
    const count = await getActiveViewerCount(username);
    const viewers = await getActiveViewers(username);
    
    return Response.json({ 
      username,
      count,
      viewers: viewers.length,
      timestamp: Date.now(),
      config: {
        heartbeat: CONFIG.HEARTBEAT_INTERVAL,
        timeout: CONFIG.VIEWER_TIMEOUT,
        cleanup: CONFIG.CLEANUP_INTERVAL,
      }
    });
  } catch (error) {
    console.error('Error en POST viewers:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}