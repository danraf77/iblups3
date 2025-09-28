import { NextRequest, NextResponse } from 'next/server';
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

    // Obtener datos del usuario y perfil extendido - Cursor
    const { data: user, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select('id, email, display_name, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Error obteniendo usuario' },
        { status: 500 }
      );
    }

    // Obtener datos del perfil extendido - Cursor
    const { data: profileData, error: profileError } = await supabase
      .from('iblups_profile_viewers')
      .select(`
        first_name,
        last_name,
        date_of_birth,
        city,
        country
      `)
      .eq('user_id', userId)
      .single();

    // El país se almacena directamente como string - Cursor
    const countryName = profileData?.country || null;

    // Combinar datos del usuario con datos del perfil - Cursor
    const profile = {
      ...user,
      first_name: profileData?.first_name || null,
      last_name: profileData?.last_name || null,
      date_of_birth: profileData?.date_of_birth || null,
      city: profileData?.city || null,
      country_id: null, // No se usa country_id, se usa country directamente
      country_name: countryName
    };

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Error obteniendo perfil' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Error in /api/dashboard/profile:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const { 
      display_name, 
      first_name, 
      last_name, 
      date_of_birth,
      city, 
      country_name 
    } = await req.json();

    // Debug: Log los datos recibidos - Cursor
    const logData = {
      timestamp: new Date().toISOString(),
      userId,
      display_name,
      first_name,
      last_name,
      date_of_birth,
      city,
      country_name
    };
    
    console.log('Datos recibidos en API:', logData);
    
    // Escribir a archivo de log
    const fs = await import('fs');
    const logEntry = `[${logData.timestamp}] API Profile PUT - User: ${userId}\n` +
      `Data: ${JSON.stringify(logData, null, 2)}\n` +
      `---\n`;
    
    try {
      (await fs).appendFileSync('/Users/danraf77/Documents/iblups2024/iblups3/debug-profile.log', logEntry);
    } catch (logError) {
      console.error('Error writing to log file:', logError);
    }

    // Actualizar datos básicos del usuario - Cursor
    const { data: user, error: userUpdateError } = await supabase
      .from('iblups_users_viewers')
      .update({
        display_name: display_name || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, email, display_name, avatar_url, created_at, updated_at')
      .single();

    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
      return NextResponse.json(
        { error: 'Error actualizando usuario' },
        { status: 500 }
      );
    }

    // Verificar si existe un perfil para este usuario - Cursor
    const { data: existingProfile } = await supabase
      .from('iblups_profile_viewers')
      .select('id')
      .eq('user_id', userId)
      .single();

    let profileData, profileUpdateError;

    if (existingProfile) {
      // Actualizar perfil existente - Cursor
      const { data, error } = await supabase
        .from('iblups_profile_viewers')
        .update({
          first_name: first_name && first_name.trim() !== '' ? first_name : null,
          last_name: last_name && last_name.trim() !== '' ? last_name : null,
          date_of_birth: date_of_birth && date_of_birth.trim() !== '' ? date_of_birth : null,
          city: city && city.trim() !== '' ? city : null,
          country: country_name && country_name.trim() !== '' ? country_name : null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select(`
          first_name,
          last_name,
          date_of_birth,
          city,
          country
        `)
        .single();
      
      profileData = data;
      profileUpdateError = error;
    } else {
      // Crear nuevo perfil - Cursor
      const { data, error } = await supabase
        .from('iblups_profile_viewers')
        .insert({
          user_id: userId,
          first_name: first_name && first_name.trim() !== '' ? first_name : null,
          last_name: last_name && last_name.trim() !== '' ? last_name : null,
          date_of_birth: date_of_birth && date_of_birth.trim() !== '' ? date_of_birth : null,
          city: city && city.trim() !== '' ? city : null,
          country: country_name && country_name.trim() !== '' ? country_name : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select(`
          first_name,
          last_name,
          date_of_birth,
          city,
          country
        `)
        .single();
      
      profileData = data;
      profileUpdateError = error;
    }

    if (profileUpdateError) {
      const errorData = {
        timestamp: new Date().toISOString(),
        error: profileUpdateError,
        userId,
        dataSent: {
          user_id: userId,
          first_name: first_name && first_name.trim() !== '' ? first_name : null,
          last_name: last_name && last_name.trim() !== '' ? last_name : null,
          date_of_birth: date_of_birth && date_of_birth.trim() !== '' ? date_of_birth : null,
          city: city && city.trim() !== '' ? city : null,
          country: country_name && country_name.trim() !== '' ? country_name : null,
        }
      };
      
      console.error('Error updating profile:', errorData);
      
      // Escribir error a archivo de log
      const errorLogEntry = `[${errorData.timestamp}] ERROR - Profile Update Failed\n` +
        `User: ${userId}\n` +
        `Error: ${JSON.stringify(profileUpdateError, null, 2)}\n` +
        `Data Sent: ${JSON.stringify(errorData.dataSent, null, 2)}\n` +
        `---\n`;
      
      try {
        (await fs).appendFileSync('/Users/danraf77/Documents/iblups2024/iblups3/debug-profile.log', errorLogEntry);
      } catch (logError) {
        console.error('Error writing error to log file:', logError);
      }
      
      return NextResponse.json(
        { error: 'Error actualizando perfil' },
        { status: 500 }
      );
    }

    // El país se almacena directamente como string - Cursor
    const countryName = profileData?.country || null;

    // Combinar datos actualizados - Cursor
    const profile = {
      ...user,
      first_name: profileData?.first_name || null,
      last_name: profileData?.last_name || null,
      date_of_birth: profileData?.date_of_birth || null,
      city: profileData?.city || null,
      country_id: null, // No se usa country_id, se usa country directamente
      country_name: countryName
    };

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Error in /api/dashboard/profile PUT:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
