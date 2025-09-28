import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente de Supabase optimizado para el servidor
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cliente de Supabase para el cliente (solo lectura)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configuraciones optimizadas para consultas frecuentes
export const queryConfig = {
  // Configuración para canales
  channels: {
    select: `
      id,
      name,
      username,
      stream_id,
      is_on_live,
      icon,
      cover,
      category_id,
      channels_category(name),
      viewer_count,
      is_4k
    `,
    orderBy: 'is_on_live',
    ascending: false
  },
  
  // Configuración para usuarios
  users: {
    select: `
      id,
      email,
      username,
      display_name,
      avatar_url,
      is_verified,
      is_active,
      created_at
    `
  },
  
  // Configuración para sesiones
  sessions: {
    select: `
      user_id,
      expires_at,
      iblups_users_viewers (
        id,
        email,
        username,
        display_name,
        avatar_url,
        is_verified,
        is_active
      )
    `
  },
  
  // Configuración para seguimiento de canales
  channelFollows: {
    select: `
      id,
      channel_id,
      channel_username,
      channel_name,
      followed_at,
      notifications_enabled
    `
  }
};

// Función para limpiar datos sensibles
export function sanitizeUser(user: unknown) {
  if (!user) return null;
  
  const userObj = user as any;
  return {
    id: userObj.id,
    email: userObj.email,
    username: userObj.username,
    display_name: userObj.display_name,
    avatar_url: userObj.avatar_url,
    is_verified: userObj.is_verified
  };
}

// Función para limpiar datos de canal
export function sanitizeChannel(channel: unknown) {
  if (!channel) return null;
  
  const channelObj = channel as any;
  return {
    id: channelObj.id,
    name: channelObj.name,
    username: channelObj.username,
    stream_id: channelObj.stream_id,
    is_on_live: channelObj.is_on_live,
    icon: channelObj.icon,
    cover: channelObj.cover,
    category: channelObj.channels_category?.name,
    viewer_count: channelObj.viewer_count,
    is_4k: channelObj.is_4k
  };
}

// Configuración de sesiones
export const SESSION_CONFIG = {
  DURATION_DAYS: 90,
  RENEWAL_THRESHOLD_DAYS: 7, // Renovar si quedan menos de 7 días
  MAX_AGE_SECONDS: 90 * 24 * 60 * 60, // 90 días en segundos
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.iblups.com' : undefined
  }
};

// Función para renovar sesión automáticamente
export async function renewSessionIfNeeded(sessionToken: string) {
  try {
    const { data: session, error } = await supabase
      .from('iblups_user_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (error || !session) return false;

    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    const daysUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    // Si quedan menos de 7 días, renovar la sesión
    if (daysUntilExpiry < SESSION_CONFIG.RENEWAL_THRESHOLD_DAYS) {
      const newExpiresAt = new Date(Date.now() + SESSION_CONFIG.DURATION_DAYS * 24 * 60 * 60 * 1000);
      
      await supabase
        .from('iblups_user_sessions')
        .update({ 
          expires_at: newExpiresAt.toISOString(),
          last_activity_at: now.toISOString()
        })
        .eq('session_token', sessionToken);

      return true;
    }

    // Actualizar última actividad
    await supabase
      .from('iblups_user_sessions')
      .update({ last_activity_at: now.toISOString() })
      .eq('session_token', sessionToken);

    return true;
  } catch (error) {
    console.error('Error renovando sesión:', error);
    return false;
  }
}

// Comentario: Configuración optimizada de Supabase creada con Cursor
// - Clientes separados para servidor y cliente
// - Configuraciones predefinidas para consultas frecuentes
// - Funciones de sanitización de datos
// - Optimización de rendimiento
// - Sistema de sesiones robusto con renovación automática
