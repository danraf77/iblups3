import { redis } from './client';
import { REDIS_CONFIG } from './config';

// ============================================
// CACHE EN MEMORIA (Crítico para reducir ops)
// ============================================
interface CacheEntry {
  count: number;
  timestamp: number;
}

const countCache = new Map<string, CacheEntry>();
const lastCleanupTime = new Map<string, number>();

// ============================================
// BATCH QUEUE (Agrupar operaciones)
// ============================================
interface BatchOperation {
  channelId: string;
  viewerId: string;
  operation: 'add' | 'remove' | 'update';
  timestamp: number;
}

const batchQueue: BatchOperation[] = [];
let batchTimer: NodeJS.Timeout | null = null;
const BATCH_DELAY = 5000; // Procesar batch cada 5 segundos

/**
 * Procesar batch de operaciones
 */
async function processBatch() {
  if (batchQueue.length === 0) return;

  const operations = [...batchQueue];
  batchQueue.length = 0;

  try {
    // Agrupar por canal
    const channelOps = new Map<string, BatchOperation[]>();
    
    for (const op of operations) {
      const ops = channelOps.get(op.channelId) || [];
      ops.push(op);
      channelOps.set(op.channelId, ops);
    }

    // Procesar cada canal en pipeline
    for (const [channelId, ops] of channelOps) {
      const key = `channel:${channelId}:viewers`;
      const pipeline = redis.pipeline();

      for (const op of ops) {
        if (op.operation === 'add' || op.operation === 'update') {
          pipeline.zadd(key, { score: op.timestamp, member: op.viewerId });
        } else if (op.operation === 'remove') {
          pipeline.zrem(key, op.viewerId);
        }
      }

      // Ejecutar pipeline
      await pipeline.exec();
      
      // Invalidar cache
      countCache.delete(channelId);
    }
  } catch (error) {
    console.error('[BATCH] Error procesando batch:', error);
  }
}

/**
 * Agregar operación al batch
 */
function addToBatch(operation: BatchOperation) {
  batchQueue.push(operation);

  // Programar procesamiento
  if (batchTimer) {
    clearTimeout(batchTimer);
  }
  batchTimer = setTimeout(processBatch, BATCH_DELAY);
}

/**
 * Agregar un viewer (con batching)
 */
export async function addViewer(
  channelId: string,
  viewerId: string
): Promise<void> {
  addToBatch({
    channelId,
    viewerId,
    operation: 'add',
    timestamp: Date.now(),
  });
  
  // Invalidar cache
  countCache.delete(channelId);
}

/**
 * Remover un viewer (inmediato, es crítico)
 */
export async function removeViewer(
  channelId: string,
  viewerId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  await redis.zrem(key, viewerId);
  
  // Invalidar cache
  countCache.delete(channelId);
}

/**
 * Actualizar heartbeat (con batching)
 */
export async function updateViewerHeartbeat(
  channelId: string,
  viewerId: string
): Promise<void> {
  addToBatch({
    channelId,
    viewerId,
    operation: 'update',
    timestamp: Date.now(),
  });
}

/**
 * Limpiar viewers inactivos (solo cuando sea necesario)
 */
async function cleanupInactiveViewers(channelId: string): Promise<void> {
  const now = Date.now();
  const lastCleanup = lastCleanupTime.get(channelId) || 0;
  
  // Solo limpiar si pasó el intervalo
  if (now - lastCleanup < REDIS_CONFIG.CLEANUP_INTERVAL) {
    return;
  }

  const key = `channel:${channelId}:viewers`;
  const cutoffTime = now - (REDIS_CONFIG.TIMEOUT * 1000);
  
  try {
    await redis.zremrangebyscore(key, 0, cutoffTime);
    lastCleanupTime.set(channelId, now);
  } catch (error) {
    console.error('[CLEANUP] Error:', error);
  }
}

/**
 * Obtener count de viewers (CON CACHE AGRESIVO)
 */
export async function getActiveViewerCount(
  channelId: string
): Promise<number> {
  const now = Date.now();
  
  // 1. Verificar cache
  const cached = countCache.get(channelId);
  if (cached && (now - cached.timestamp < REDIS_CONFIG.CACHE_TTL)) {
    return cached.count;
  }

  // 2. Limpiar viewers inactivos (solo cada X tiempo)
  await cleanupInactiveViewers(channelId);

  // 3. Obtener count real
  const key = `channel:${channelId}:viewers`;
  let count = 0;
  
  try {
    count = await redis.zcard(key) || 0;
  } catch (error) {
    console.error('[COUNT] Error:', error);
    // Retornar cache antiguo si hay error
    if (cached) return cached.count;
  }

  // 4. Guardar en cache
  countCache.set(channelId, {
    count,
    timestamp: now,
  });

  return count;
}

/**
 * Limpiar todos los viewers de un canal
 */
export async function clearChannelViewers(
  channelId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  await redis.del(key);
  
  // Limpiar caches
  countCache.delete(channelId);
  lastCleanupTime.delete(channelId);
}

/**
 * Obtener estadísticas del cache (útil para debugging)
 */
export function getCacheStats() {
  return {
    cachedChannels: countCache.size,
    cleanupTracked: lastCleanupTime.size,
    batchQueueSize: batchQueue.length,
  };
}