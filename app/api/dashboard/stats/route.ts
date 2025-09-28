import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);
    const { userId } = payload as { userId: string };

    // Obtener número de canales seguidos
    const { count: totalFollowing, error: followingError } = await supabase
      .from('iblups_channel_follows')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (followingError) {
      console.error('Error counting followed channels:', followingError);
      return NextResponse.json(
        { error: 'Error obteniendo estadísticas' },
        { status: 500 }
      );
    }

    // Obtener actividad reciente (últimos 7 días)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: recentActivity, error: activityError } = await supabase
      .from('iblups_channel_follows')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo);

    if (activityError) {
      console.error('Error counting recent activity:', activityError);
      return NextResponse.json(
        { error: 'Error obteniendo estadísticas' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      totalFollowing: totalFollowing || 0,
      recentActivity: recentActivity || 0
    });

  } catch (error) {
    console.error('Error in /api/dashboard/stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
