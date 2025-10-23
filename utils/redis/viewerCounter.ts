import { redis } from './client';
import { REDIS_CONFIG } from './config';

// ============================================
// CACHE EN MEMORIA (Reducir lecturas)
// ============================================
interface CacheEntry {
  count: number;
  timestamp: number;
}

const countCache = new Map<string, CacheEntry>();
const lastCleanupTime = new Map<string, number>();

/**
 * Agregar un viewer (ESCRITURA DIRECTA - SIN BATCHING)
 */
export async function addViewer(
  channelId: string,
  viewerId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  const timestamp = Date.now();
  
  console.log(`[REDIS] Adding viewer ${viewerId} to ${channelId}`);
  
  try {
    // Escribir DIRECTAMENTE a Redis
    await redis.pipeline()
      .zadd(key, { score: timestamp, member: viewerId })
      .expire(key, 600) // 10 minutos
      .exec();
    
    // Invalidar cache
    countCache.delete(channelId);
    
    console.log(`[REDIS] Viewer added successfully`);
  } catch (error) {
    console.error(`[REDIS] Error adding viewer:`, error);
    throw error;
  }
}

/**
 * Remover un viewer
 */
export async function removeViewer(
  channelId: string,
  viewerId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  
  console.log(`[REDIS] Removing viewer ${viewerId} from ${channelId}`);
  
  try {
    await redis.zrem(key, viewerId);
    
    // Invalidar cache
    countCache.delete(channelId);
    
    console.log(`[REDIS] Viewer removed successfully`);
  } catch (error) {
    console.error(`[REDIS] Error removing viewer:`, error);
  }
}

/**
 * Actualizar heartbeat (ESCRITURA DIRECTA - SIN BATCHING)
 */
export async function updateViewerHeartbeat(
  channelId: string,
  viewerId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  const timestamp = Date.now();
  
  try {
    // Escribir DIRECTAMENTE a Redis (solo actualizar score)
    await redis.zadd(key, { score: timestamp, member: viewerId });
  } catch (error) {
    console.error(`[REDIS] Error updating heartbeat:`, error);
  }
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
    const removed = await redis.zremrangebyscore(key, 0, cutoffTime);
    lastCleanupTime.set(channelId, now);
    
    if (removed > 0) {
      console.log(`[REDIS] Cleaned up ${removed} inactive viewers from ${channelId}`);
    }
  } catch (error) {
    console.error('[CLEANUP] Error:', error);
  }
}

/**
 * Obtener count de viewers (CON CACHE)
 */
export async function getActiveViewerCount(
  channelId: string
): Promise<number> {
  const now = Date.now();
  
  // 1. Verificar cache
  const cached = countCache.get(channelId);
  if (cached && (now - cached.timestamp < REDIS_CONFIG.CACHE_TTL)) {
    console.log(`[REDIS] Cache hit for ${channelId}: ${cached.count}`);
    return cached.count;
  }

  // 2. Limpiar viewers inactivos (solo cada X tiempo)
  await cleanupInactiveViewers(channelId);

  // 3. Obtener count real
  const key = `channel:${channelId}:viewers`;
  let count = 0;
  
  try {
    count = await redis.zcard(key) || 0;
    console.log(`[REDIS] Count for ${channelId}: ${count}`);
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
  
  try {
    await redis.del(key);
    
    // Limpiar caches
    countCache.delete(channelId);
    lastCleanupTime.delete(channelId);
    
    console.log(`[REDIS] Cleared all viewers from ${channelId}`);
  } catch (error) {
    console.error('[REDIS] Error clearing viewers:', error);
  }
}

/**
 * Obtener estadísticas del cache
 */
export function getCacheStats() {
  return {
    cachedChannels: countCache.size,
    cleanupTracked: lastCleanupTime.size,
    batchQueueSize: 0, // No hay batch
  };
}