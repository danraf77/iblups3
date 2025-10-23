// utils/redis/config.ts
export const REDIS_CONFIG = {
  // Intervalos (en milisegundos)
  HEARTBEAT_INTERVAL: parseInt(process.env.VIEWER_HEARTBEAT_INTERVAL || '120000'),
  TIMEOUT: parseInt(process.env.VIEWER_TIMEOUT || '180'),
  UPDATE_INTERVAL: parseInt(process.env.VIEWER_COUNT_UPDATE_INTERVAL || '20000'),
  CLEANUP_INTERVAL: parseInt(process.env.CLEANUP_INTERVAL || '60000'),
  CACHE_TTL: parseInt(process.env.VIEWER_COUNT_CACHE_TTL || '15000'),
} as const;

// Validación
if (REDIS_CONFIG.HEARTBEAT_INTERVAL < 60000) {
  console.warn('⚠️ HEARTBEAT_INTERVAL muy bajo, mínimo recomendado: 60000ms (60s)');
}

if (REDIS_CONFIG.UPDATE_INTERVAL < 10000) {
  console.warn('⚠️ UPDATE_INTERVAL muy bajo, mínimo recomendado: 10000ms (10s)');
}

if (process.env.NODE_ENV === 'development') {
  console.log('📊 Redis Config:', {
    heartbeat: `${REDIS_CONFIG.HEARTBEAT_INTERVAL / 1000}s`,
    timeout: `${REDIS_CONFIG.TIMEOUT}s`,
    updateInterval: `${REDIS_CONFIG.UPDATE_INTERVAL / 1000}s`,
    cleanupInterval: `${REDIS_CONFIG.CLEANUP_INTERVAL / 1000}s`,
    cacheTTL: `${REDIS_CONFIG.CACHE_TTL / 1000}s`,
  });
}