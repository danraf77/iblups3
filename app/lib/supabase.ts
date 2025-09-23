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
      created_at,
      last_login_at
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
  }
};

// Configuración de sesión
export const SESSION_CONFIG = {
  maxAge: 30 * 24 * 60 * 60, // 30 días en segundos
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
};

// Función para limpiar datos de usuario
export function sanitizeUser(user: { id: string; email: string; username?: string; display_name?: string; avatar_url?: string; is_verified?: boolean } | null) {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    is_verified: user.is_verified || false
  };
}

// Función para limpiar datos de canal
export function sanitizeChannel(channel: { 
  id: string; 
  name?: string;
  username: string; 
  display_name?: string; 
  avatar_url?: string; 
  is_live?: boolean; 
  viewer_count?: number;
  stream_id?: string;
  is_on_live?: boolean;
  icon?: string;
  cover?: string;
  category_id?: string;
  is_4k?: boolean;
  channels_category?: { name?: string };
} | null) {
  if (!channel) return null;
  
  return {
    id: channel.id,
    name: channel.name || channel.display_name || channel.username,
    username: channel.username,
    stream_id: channel.stream_id,
    is_on_live: channel.is_on_live,
    icon: channel.icon,
    cover: channel.cover,
    category: channel.channels_category?.name,
    viewer_count: channel.viewer_count,
    is_4k: channel.is_4k
  };
}

// Función para renovar sesión si es necesario
export async function renewSessionIfNeeded(sessionToken: string): Promise<boolean> {
  try {
    const { data: session, error } = await supabase
      .from('iblups_user_sessions')
      .select('expires_at')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (error || !session) {
      return false;
    }

    const expiresAt = new Date(session.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    const daysUntilExpiry = timeUntilExpiry / (1000 * 60 * 60 * 24);

    // Si la sesión expira en menos de 7 días, renovarla
    if (daysUntilExpiry < 7) {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 30);

      await supabase
        .from('iblups_user_sessions')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('session_token', sessionToken);

      return true;
    }

    return true;
  } catch (error) {
    console.error('Error renovando sesión:', error);
    return false;
  }
}

// Comentario: Cliente Supabase optimizado creado con Cursor
// - Configuraciones optimizadas para consultas frecuentes
// - Funciones de sanitización de datos
// - Manejo de sesiones con renovación automática
// - Soporte para desarrollo y producción
