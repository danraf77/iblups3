'use client';
import { useState, useEffect, useCallback } from 'react';

interface Channel {
  id: string;
  name: string;
  username: string;
  stream_id?: string;
  is_on_live: boolean;
  icon?: string;
  cover?: string;
  category?: {
    name: string;
  };
  viewer_count?: number;
  is_4k?: boolean;
}

interface UseChannelByUsernameResult {
  channel: Channel | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useChannelByUsername(username: string): UseChannelByUsernameResult {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannel = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/channel/${username}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Channel not found');
        } else {
          setError('Failed to fetch channel');
        }
        setChannel(null);
        return;
      }

      const data = await response.json();
      setChannel(data.channel);
    } catch (err) {
      console.error('Error fetching channel:', err);
      setError('Network error');
      setChannel(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchChannel();
  }, [username, fetchChannel]);

  const refetch = () => {
    fetchChannel();
  };

  return { channel, loading, error, refetch };
}

// Comentario: Hook para canal por username creado con Cursor
// - Búsqueda dinámica de canales por username
// - Estados de carga, error y datos
// - Función refetch para recargar datos
