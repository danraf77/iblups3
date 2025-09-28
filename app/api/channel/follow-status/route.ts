import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { isFollowing: false },
        { status: 200 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);
    
    const { userId } = payload as { userId: string };

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json(
        { error: 'ID del canal requerido' },
        { status: 400 }
      );
    }

    // Verificar si sigue el canal
    const { data: follow, error: followError } = await supabase
      .from('iblups_channel_follows')
      .select('id')
      .eq('user_id', userId)
      .eq('channel_id', channelId)
      .single();

    if (followError && followError.code !== 'PGRST116') {
      console.error('Error verificando follow:', followError);
      return NextResponse.json(
        { error: 'Error verificando seguimiento' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      isFollowing: !!follow
    });

  } catch (error) {
    console.error('Error en /api/channel/follow-status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
