import { NextRequest, NextResponse } from 'next/server';
import { removeViewer } from '@/utils/redis/viewerCounter';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { channelId, viewerId } = await request.json();
    
    if (!channelId || !viewerId) {
      return NextResponse.json(
        { error: 'channelId y viewerId son requeridos' },
        { status: 400 }
      );
    }
    
    await removeViewer(channelId, viewerId);
    
    console.log(`[VIEWER] Leave - Canal: ${channelId}, Viewer: ${viewerId}`);
    
    return NextResponse.json({
      success: true,
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('[ERROR] Leave:', error);
    return NextResponse.json(
      { error: 'Error al salir' },
      { status: 500 }
    );
  }
}
