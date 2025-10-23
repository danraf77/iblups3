import { NextRequest, NextResponse } from 'next/server';
import { getActiveViewerCount } from '@/utils/redis/viewerCounter';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const { channelId } = params;
    
    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId es requerido' },
        { status: 400 }
      );
    }
    
    const count = await getActiveViewerCount(channelId);
    
    return NextResponse.json({
      channelId,
      viewerCount: count,
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('[ERROR] Get count:', error);
    return NextResponse.json(
      { error: 'Error al obtener contador' },
      { status: 500 }
    );
  }
}
