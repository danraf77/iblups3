import { NextRequest } from 'next/server';
import { getActiveViewerCount } from '@/utils/redis/viewerCounter';
import { REDIS_CONFIG } from '@/utils/redis/config';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await context.params;
  
  if (!channelId) {
    return new Response('channelId es requerido', { status: 400 });
  }

  const encoder = new TextEncoder();
  let lastCount = -1; // Para evitar enviar el mismo valor
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const count = await getActiveViewerCount(channelId);
          
          // Solo enviar si el count cambió
          if (count !== lastCount) {
            lastCount = count;
            
            const data = JSON.stringify({
              channelId,
              viewerCount: count,
              timestamp: Date.now()
            });
            
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        } catch (error) {
          console.error('[SSE] Error:', error);
        }
      };
      
      // Primera actualización inmediata
      await sendUpdate();
      
      // Actualizaciones periódicas según config
      const intervalId = setInterval(sendUpdate, REDIS_CONFIG.UPDATE_INTERVAL);
      
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}