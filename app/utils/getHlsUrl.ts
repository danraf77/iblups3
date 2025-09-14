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
    const baseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/dev';
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
 * @returns Promise<{hlsUrl: string, streamId: string}> - URL HLS encriptada y streamId
 */
export async function getHlsUrlServerSide(username: string): Promise<{hlsUrl: string, streamId: string}> {
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
    const baseUrl = process.env.NEXT_PUBLIC_HLS_BASE_URL || 'https://live-stream.iblups.com/dev';
    const hlsUrl = `${baseUrl}/${encryptedStreamId}.m3u8`;
    
    // Devolver URL HLS dinámica con streamId encriptado
    return { hlsUrl, streamId: encryptedStreamId };
  } catch (error) {
    console.error('Error getting HLS URL server-side:', error);
    throw new Error('Failed to get HLS URL');
  }
}

// Comentario: Utilidades para obtener URL HLS creadas con Cursor
// - Mantiene la integridad del cifrado existente
// - Soporte para client-side y server-side
// - Reutiliza la lógica de cifrado de utils/encryption.ts
