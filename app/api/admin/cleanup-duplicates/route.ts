import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
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

    // Obtener todos los follows del usuario
    const { data: allFollows, error: fetchError } = await supabase
      .from('iblups_channel_follows')
      .select('*')
      .eq('user_id', userId)
      .order('followed_at', { ascending: false });

    if (fetchError) {
      console.error('Error obteniendo follows:', fetchError);
      return NextResponse.json(
        { error: 'Error obteniendo follows' },
        { status: 500 }
      );
    }

    // Agrupar por channel_id para encontrar duplicados - Cursor
    const followsByChannel = new Map<string, { id: string; followed_at: string }>();
    const duplicates: string[] = [];

    allFollows?.forEach(follow => {
      const channelId = follow.channel_id;
      if (followsByChannel.has(channelId)) {
        // Es un duplicado, mantener el más reciente - Cursor
        const existing = followsByChannel.get(channelId);
        if (existing && new Date(follow.followed_at) > new Date(existing.followed_at)) {
          duplicates.push(existing.id);
          followsByChannel.set(channelId, follow);
        } else {
          duplicates.push(follow.id);
        }
      } else {
        followsByChannel.set(channelId, follow);
      }
    });

    // Eliminar duplicados
    if (duplicates.length > 0) {
      const { error: deleteError } = await supabase
        .from('iblups_channel_follows')
        .delete()
        .in('id', duplicates);

      if (deleteError) {
        console.error('Error eliminando duplicados:', deleteError);
        return NextResponse.json(
          { error: 'Error eliminando duplicados' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${duplicates.length} follows duplicados`,
      duplicatesRemoved: duplicates.length,
      totalFollows: followsByChannel.size
    });

  } catch (error) {
    console.error('Error en /api/admin/cleanup-duplicates:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
