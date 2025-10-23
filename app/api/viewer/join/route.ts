import { NextRequest, NextResponse } from 'next/server';
import { addViewer } from '@/utils/redis/viewerCounter';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json();
    
    if (!channelId) {
      return NextResponse.json(
        { error: 'channelId es requerido' },
        { status: 400 }
      );
    }
    
    const viewerId = uuidv4();
    await addViewer(channelId, viewerId);
    
    console.log(`[VIEWER] Join - Canal: ${channelId}, Viewer: ${viewerId}`);
    
    return NextResponse.json({
      success: true,
      viewerId,
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error('[ERROR] Join:', error);
    return NextResponse.json(
      { error: 'Error al unirse' },
      { status: 500 }
    );
  }
}
