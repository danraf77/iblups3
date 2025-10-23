import { NextRequest } from 'next/server';
import { getActiveViewerCount } from '@/utils/redis/viewerCounter';

export const runtime = 'edge';

const UPDATE_INTERVAL = 2000; // 2 segundos

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ channelId: string }> }
) {
  // Await params en Next.js 15
  const { channelId } = await context.params;
  
  if (!channelId) {
    return new Response('channelId es requerido', { status: 400 });
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const count = await getActiveViewerCount(channelId);
          
          const data = JSON.stringify({
            channelId,
            viewerCount: count,
            timestamp: Date.now()
          });
          
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (error) {
          console.error('[SSE] Error:', error);
        }
      };
      
      await sendUpdate();
      const intervalId = setInterval(sendUpdate, UPDATE_INTERVAL);
      
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
