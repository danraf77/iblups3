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

    // Verificar si ya sigue el canal
    const { data: existingFollow, error: checkError } = await supabase
      .from('iblups_channel_follows')
      .select('id')
      .eq('user_id', userId)
      .eq('channel_id', channelId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error verificando follow:', checkError);
      return NextResponse.json(
        { error: 'Error verificando seguimiento' },
        { status: 500 }
      );
    }

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Ya sigues este canal' },
        { status: 400 }
      );
    }

    // Crear el follow
    const { error: followError } = await supabase
      .from('iblups_channel_follows')
      .insert({
        user_id: userId,
        channel_id: channelId,
        channel_username: channelUsername,
        channel_name: channelName,
        followed_at: new Date().toISOString(),
        notifications_enabled: true
      });

    if (followError) {
      console.error('Error creando follow:', followError);
      return NextResponse.json(
        { error: 'Error siguiendo el canal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Canal seguido exitosamente'
    });

  } catch (error) {
    console.error('Error en /api/channel/follow:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
