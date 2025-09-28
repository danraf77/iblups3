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

    const { channelId } = await req.json();

    if (!channelId) {
      return NextResponse.json(
        { error: 'ID del canal requerido' },
        { status: 400 }
      );
    }

    // Eliminar el follow
    const { error: unfollowError } = await supabase
      .from('iblups_channel_follows')
      .delete()
      .eq('user_id', userId)
      .eq('channel_id', channelId);

    if (unfollowError) {
      console.error('Error eliminando follow:', unfollowError);
      return NextResponse.json(
        { error: 'Error dejando de seguir el canal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dejaste de seguir el canal'
    });

  } catch (error) {
    console.error('Error en /api/channel/unfollow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
