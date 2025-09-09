import { useState, useEffect, useCallback, useRef } from 'react';

interface Channel {
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
}


interface PaginatedChannelsResponse {
  channels: Channel[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalChannels: number;
    totalLiveChannels: number;
    channelsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    search: string;
    tab: string;
  };
}

interface LiveCountResponse {
  totalLiveChannels: number;
  totalChannels: number;
}

interface UseChannelsProps {
  page?: number;
  limit?: number;
  search?: string;
  tab?: string;
}

interface UseChannelsReturn {
  channels: Channel[];
  totalChannels: number;
  totalLiveChannels: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useChannels({
  page = 1,
  limit = 16,
  search = '',
  tab = 'all'
}: UseChannelsProps = {}): UseChannelsReturn {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [totalChannels, setTotalChannels] = useState(0);
  const [totalLiveChannels, setTotalLiveChannels] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar llamadas duplicadas
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>('');

  const fetchChannels = useCallback(async () => {
    // Crear una clave única para esta request
    const requestKey = `${page}-${limit}-${search}-${tab}`;
    
    // Si es la misma request, no hacer nada
    if (lastRequestRef.current === requestKey) {
      return;
    }
    
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    lastRequestRef.current = requestKey;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        tab
      });

      const response = await fetch(`/api/channels/paginated?${params}`, {
        signal: abortControllerRef.current.signal,
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Error fetching channels');
      }

      const data: PaginatedChannelsResponse = await response.json();
      
      setChannels(data.channels);
      setTotalChannels(data.pagination.totalChannels);
      setTotalLiveChannels(data.pagination.totalLiveChannels);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);

    } catch (err) {
      // Only handle errors that are not abort errors
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        console.error('Error fetching channels:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, tab]);

  const refetch = useCallback(() => {
    lastRequestRef.current = ''; // Reset to force new request
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    fetchChannels();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchChannels]);

  return {
    channels,
    totalChannels,
    totalLiveChannels,
    currentPage,
    totalPages,
    loading,
    error,
    refetch
  };
}

// Hook específico para obtener solo el conteo de canales en vivo
export function useLiveChannelsCount() {
  const [totalLiveChannels, setTotalLiveChannels] = useState(0);
  const [totalChannels, setTotalChannels] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/channels/live-count');
      
      if (!response.ok) {
        throw new Error('Error fetching live channels count');
      }

      const data: LiveCountResponse = await response.json();
      
      setTotalLiveChannels(data.totalLiveChannels);
      setTotalChannels(data.totalChannels);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching live channels count:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveCount();
  }, [fetchLiveCount]);

  return {
    totalLiveChannels,
    totalChannels,
    loading,
    error,
    refetch: fetchLiveCount
  };
}
