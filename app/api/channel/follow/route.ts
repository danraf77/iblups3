import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);
    
    const { userId } = payload as { userId: string };

    const { channelId, channelUsername, channelName } = await req.json();

    if (!channelId || !channelUsername || !channelName) {
      return NextResponse.json(
        { error: 'Datos del canal requeridos' },
        { status: 400 }
      );
    }

    // Usar UPSERT para prevenir duplicados - Cursor
    const { data: followData, error: followError } = await supabase
      .from('iblups_channel_follows')
      .upsert({
        user_id: userId,
        channel_id: channelId,
        channel_username: channelUsername,
        channel_name: channelName,
        followed_at: new Date().toISOString(),
        notifications_enabled: true
      }, {
        onConflict: 'user_id,channel_id',
        ignoreDuplicates: false
      })
      .select();

    if (followError) {
      console.error('Error creando follow:', followError);
      return NextResponse.json(
        { error: 'Error siguiendo el canal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Canal seguido exitosamente',
      isNewFollow: followData && followData.length > 0
    });

  } catch (error) {
    console.error('Error en /api/channel/follow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
