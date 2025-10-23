'use client';

import { useState, useEffect, useRef } from 'react';

interface UseViewerCountProps {
  channelId: string;
  enabled?: boolean;
}

export function useViewerCount({
  channelId,
  enabled = true
}: UseViewerCountProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled || !channelId) return;

    let isMounted = true;

    const setupSSE = () => {
      if (!isMounted) return;

      const eventSource = new EventSource(`/api/viewer/sse/${channelId}`);
      
      eventSource.onopen = () => {
        if (!isMounted) return;
        setIsConnected(true);
        console.log('[COUNT] Conectado a SSE');
      };
      
      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        
        try {
          const data = JSON.parse(event.data);
          setViewerCount(data.viewerCount);
          setIsConnected(true);
        } catch (error) {
          console.error('[COUNT] Error parsing data:', error);
        }
      };
      
      eventSource.onerror = () => {
        if (!isMounted) return;
        
        console.log('[COUNT] Error en SSE, reconectando...');
        setIsConnected(false);
        eventSource.close();
        
        setTimeout(() => {
          if (isMounted) setupSSE();
        }, 3000);
      };
      
      eventSourceRef.current = eventSource;
    };

    setupSSE();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [channelId, enabled]);

  return {
    viewerCount,
    isConnected
  };
}
