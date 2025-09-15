import { encryptStreamId } from './encryption';

/**
 * Obtiene la URL HLS encriptada para un canal específico
 * Esta función mantiene la integridad del cifrado del streamId
 * 
 * @param username - Username del canal
 * @returns Promise<string> - URL HLS encriptada
 */
export async function getHlsUrl(username: string): Promise<string> {
  try {
    // Hacer la llamada a la API existente que ya maneja el cifrado
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stream/${username}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching stream data: ${response.status}`);
    }
    
    const data = await response.json();
    // Encriptar el stream_id y generar URL HLS dinámica
    const encryptedStreamId = encryptStreamId(data.stream_id);
    const baseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/video';
    return `${baseUrl}/${encryptedStreamId}.m3u8`;
  } catch (error) {
    console.error('Error getting HLS URL:', error);
    throw new Error('Failed to get HLS URL');
  }
}

/**
 * Función server-side para obtener la URL HLS directamente
 * Útil para usar en server components o server actions
 * 
 * @param username - Username del canal
 * @returns Promise<{hlsUrl: string, streamId: string, posterUrl: string}> - URL HLS encriptada, streamId y poster
 */
export async function getHlsUrlServerSide(username: string): Promise<{hlsUrl: string, streamId: string, posterUrl: string}> {
  const { createClient } = await import('@supabase/supabase-js');
  const { sampleChannels } = await import('../data/sampleChannels');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Buscar canal por username en Supabase
    const { data: channel, error } = await supabase
      .from('channels_channel')
      .select('stream_id')
      .eq('username', username)
      .single();

    let streamId: string;

    if (error || !channel || !channel.stream_id) {
      // Fallback a datos de ejemplo
      const sampleChannel = sampleChannels.find(c => c.username === username);
      if (!sampleChannel || !sampleChannel.stream_id) {
        throw new Error('Channel not found');
      }
      streamId = sampleChannel.stream_id;
    } else {
      streamId = channel.stream_id;
    }

    // Encriptar el stream_id y generar URL HLS dinámica
    const encryptedStreamId = encryptStreamId(streamId);
    const baseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/video';
    const hlsUrl = `${baseUrl}/${encryptedStreamId}.m3u8`;
    
    // Generar URL del poster con stream ID original (no encriptado) y parámetro de tiempo para cache corto
    // Usar timestamp en segundos para cache de 30 segundos máximo para carga más rápida
    const timestamp = Math.floor(Date.now() / 1000);
    const cacheSeconds = 30; // Cache por 30 segundos para carga más rápida
    const cacheParam = Math.floor(timestamp / cacheSeconds);
    const posterUrl = `https://thumbnail.iblups.com/thumb/live/${streamId}.png?t=${cacheParam}&w=1280&h=720&q=85`;
    
    // Devolver URL HLS dinámica con streamId encriptado y poster
    return { hlsUrl, streamId: encryptedStreamId, posterUrl };
  } catch (error) {
    console.error('Error getting HLS URL server-side:', error);
    throw new Error('Failed to get HLS URL');
  }
}

// Comentario: Utilidades para obtener URL HLS creadas con Cursor
// - Mantiene la integridad del cifrado existente
// - Soporte para client-side y server-side
// - Reutiliza la lógica de cifrado de utils/encryption.ts
