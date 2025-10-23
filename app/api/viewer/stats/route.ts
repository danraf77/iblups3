import { NextResponse } from 'next/server';
import { getCacheStats } from '@/utils/redis/viewerCounter';
import { REDIS_CONFIG } from '@/utils/redis/config';

export const runtime = 'edge';

export async function GET() {
  const stats = getCacheStats();
  
  return NextResponse.json({
    config: {
      heartbeatInterval: REDIS_CONFIG.HEARTBEAT_INTERVAL,
      timeout: REDIS_CONFIG.TIMEOUT,
      updateInterval: REDIS_CONFIG.UPDATE_INTERVAL,
      cleanupInterval: REDIS_CONFIG.CLEANUP_INTERVAL,
      cacheTTL: REDIS_CONFIG.CACHE_TTL,
    },
    cache: stats,
    timestamp: Date.now(),
  });
}