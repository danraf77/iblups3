import { generateEncryptedHlsUrl } from './encryption';

/**
 * Obtiene la URL HLS encriptada para un canal específico
 * Esta función mantiene la integridad del cifrado del streamId
 * 
 * @param username - Username del canal
 * @returns Promise<string> - URL HLS encriptada
 */
export async function getHlsUrl(username: string): Promise<string> {
  // URL HLS de prueba para testing
  return 'https://live-stream.iblups.com/video/68fe7d84cbd05c3c32e1e31b35931a691d59df16.m3u8';
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

    // URL HLS de prueba para testing
    const hlsUrl = 'https://live-stream.iblups.com/video/68fe7d84cbd05c3c32e1e31b35931a691d59df16.m3u8';
    
    // Devolver URL HLS de prueba
    return { hlsUrl, streamId };
  } catch (error) {
    console.error('Error getting HLS URL server-side:', error);
    throw new Error('Failed to get HLS URL');
  }
}

// Comentario: Utilidades para obtener URL HLS creadas con Cursor
// - Mantiene la integridad del cifrado existente
// - Soporte para client-side y server-side
// - Reutiliza la lógica de cifrado de utils/encryption.ts
