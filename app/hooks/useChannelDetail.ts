import { useState, useEffect, useCallback } from 'react';

interface ChannelDetail {
  id: string;
  name: string;
  username: string;
  stream_id?: string;
  is_on_live: boolean;
  icon?: string;
  cover?: string;
  category_id?: number;
  category?: {
    name: string;
  };
  channels_category?: {
    name: string;
  }[];
  viewer_count?: number;
  is_4k?: boolean;
  description?: string;
  created_at?: string;
  modified?: string;
  enabled_search?: boolean;
}

interface UseChannelDetailReturn {
  channel: ChannelDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useChannelDetail(channelId: string): UseChannelDetailReturn {
  const [channel, setChannel] = useState<ChannelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannelDetail = useCallback(async () => {
    if (!channelId) {
      setError('ID de canal requerido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/channels/${channelId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Canal no encontrado');
        }
        throw new Error('Error al obtener detalles del canal');
      }

      const data: ChannelDetail = await response.json();
      setChannel(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching channel detail:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  const refetch = useCallback(() => {
    fetchChannelDetail();
  }, [fetchChannelDetail]);

  useEffect(() => {
    fetchChannelDetail();
  }, [fetchChannelDetail]);

  return {
    channel,
    loading,
    error,
    refetch
  };
}

// Hook para obtener múltiples canales por IDs
interface UseBatchChannelsProps {
  ids: string[];
  enabled?: boolean;
}

interface UseBatchChannelsReturn {
  channels: ChannelDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBatchChannels({ 
  ids, 
  enabled = true 
}: UseBatchChannelsProps): UseBatchChannelsReturn {
  const [channels, setChannels] = useState<ChannelDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchChannels = useCallback(async () => {
    if (!enabled || !ids || ids.length === 0) {
      setChannels([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/channels/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener canales');
      }

      const data = await response.json();
      setChannels(data.channels);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching batch channels:', err);
    } finally {
      setLoading(false);
    }
  }, [ids, enabled]);

  const refetch = useCallback(() => {
    fetchBatchChannels();
  }, [fetchBatchChannels]);

  useEffect(() => {
    fetchBatchChannels();
  }, [fetchBatchChannels]);

  return {
    channels,
    loading,
    error,
    refetch
  };
}
