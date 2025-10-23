import { redis } from './client';

const VIEWER_TIMEOUT = 60; // 60 segundos

export async function addViewer(
  channelId: string,
  viewerId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  const timestamp = Date.now();
  
  await redis.zadd(key, { score: timestamp, member: viewerId });
  await redis.expire(key, 300);
}

export async function removeViewer(
  channelId: string,
  viewerId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  await redis.zrem(key, viewerId);
}

export async function updateViewerHeartbeat(
  channelId: string,
  viewerId: string
): Promise<void> {
  await addViewer(channelId, viewerId);
}

export async function getActiveViewerCount(
  channelId: string
): Promise<number> {
  const key = `channel:${channelId}:viewers`;
  const now = Date.now();
  const cutoffTime = now - (VIEWER_TIMEOUT * 1000);
  
  await redis.zremrangebyscore(key, 0, cutoffTime);
  const count = await redis.zcard(key);
  
  return count || 0;
}

export async function clearChannelViewers(
  channelId: string
): Promise<void> {
  const key = `channel:${channelId}:viewers`;
  await redis.del(key);
}
