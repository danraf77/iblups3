import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar sesión válida
    const { data: session, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select(`
        user_id,
        iblups_users_viewers (
          id,
          email,
          username,
          display_name,
          avatar_url,
          is_verified,
          is_active,
          created_at
        )
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    // Buscar perfil extendido
    const { data: profile } = await supabase
      .from('iblups_profile_viewers')
      .select('*')
      .eq('user_id', session.user_id)
      .single();

    const user = session.iblups_users_viewers;
    const userProfile = {
      ...user,
      profile: profile || null
    };

    return NextResponse.json(userProfile);

  } catch (error) {
    console.error('Error en /api/dashboard/profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('iblups_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar sesión válida
    const { data: session, error: sessionError } = await supabase
      .from('iblups_user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    const { first_name, last_name, country, city, date_of_birth } = await request.json();

    // Limpiar y validar datos antes de procesar
    const cleanData = {
      first_name: first_name?.trim() || null,
      last_name: last_name?.trim() || null,
      country: country?.trim() || null,
      city: city?.trim() || null,
      date_of_birth: date_of_birth && date_of_birth.trim() !== '' ? date_of_birth : null
    };

    console.log('Datos recibidos:', { first_name, last_name, country, city, date_of_birth });
    console.log('Datos limpios:', cleanData);

    // Verificar si ya existe un perfil
    const { error: checkError } = await supabase
      .from('iblups_profile_viewers')
      .select('id')
      .eq('user_id', session.user_id)
      .single();

    let profile, profileError;

    if (checkError && checkError.code === 'PGRST116') {
      // No existe perfil, crear uno nuevo
      const { data: newProfile, error: createError } = await supabase
        .from('iblups_profile_viewers')
        .insert({
          user_id: session.user_id,
          first_name: cleanData.first_name,
          last_name: cleanData.last_name,
          country: cleanData.country,
          city: cleanData.city,
          date_of_birth: cleanData.date_of_birth
        })
        .select()
        .single();
      
      profile = newProfile;
      profileError = createError;
    } else if (checkError) {
      // Error al verificar
      console.error('Error verificando perfil existente:', checkError);
      return NextResponse.json({ error: 'Error verificando perfil' }, { status: 500 });
    } else {
      // Existe perfil, actualizarlo
      const { data: updatedProfile, error: updateError } = await supabase
        .from('iblups_profile_viewers')
        .update({
          first_name: cleanData.first_name,
          last_name: cleanData.last_name,
          country: cleanData.country,
          city: cleanData.city,
          date_of_birth: cleanData.date_of_birth
        })
        .eq('user_id', session.user_id)
        .select()
        .single();
      
      profile = updatedProfile;
      profileError = updateError;
    }

    if (profileError) {
      console.error('Error actualizando perfil:', profileError);
      
      // Manejar errores específicos de validación
      let errorMessage = 'Error actualizando perfil';
      if (profileError.code === '22007') {
        errorMessage = 'Formato de fecha inválido. Por favor, ingresa una fecha válida o déjala vacía.';
      } else if (profileError.message) {
        errorMessage = profileError.message;
      }
      
      return NextResponse.json({ 
        error: errorMessage, 
        details: profileError.message,
        code: profileError.code
      }, { status: 500 });
    }

    // Obtener datos completos del usuario con perfil
    const { data: user, error: userError } = await supabase
      .from('iblups_users_viewers')
      .select(`
        id,
        email,
        username,
        display_name,
        avatar_url,
        is_verified,
        is_active,
        created_at
      `)
      .eq('id', session.user_id)
      .single();

    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      return NextResponse.json({ error: 'Error obteniendo usuario' }, { status: 500 });
    }

    const userProfile = {
      ...user,
      profile: profile
    };

    console.log('Returning user profile:', userProfile);
    console.log('Profile data:', profile);
    console.log('User data:', user);
    
    if (!profile) {
      console.error('Profile is null or undefined');
      return NextResponse.json({ error: 'Error: Profile is null' }, { status: 500 });
    }
    
    if (!user) {
      console.error('User is null or undefined');
      return NextResponse.json({ error: 'Error: User is null' }, { status: 500 });
    }
    
    return NextResponse.json(userProfile);

  } catch (error) {
    console.error('Error en PUT /api/dashboard/profile:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// Comentario: API para perfil del dashboard creada con Cursor
// - Valida sesión del usuario
// - Retorna información completa del perfil
// - Incluye datos extendidos de la tabla profile
