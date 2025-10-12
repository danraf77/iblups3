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

    const { data: channels, error: channelsError } = await supabase
      .from('iblups_channel_follows')
      .select('id, channel_id, channel_username, channel_name, followed_at')
      .eq('user_id', userId)
      .order('followed_at', { ascending: false });

    if (channelsError) {
      console.error('Error fetching followed channels:', channelsError);
      return NextResponse.json(
        { error: 'Error obteniendo canales seguidos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      channels: channels || [],
      total: channels?.length || 0
    });

  } catch (error) {
    console.error('Error in /api/dashboard/following:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
