'use client';

import { useEffect, useRef } from 'react';

interface UseViewerTrackerProps {
  channelId: string;
  enabled?: boolean;
}

const HEARTBEAT_INTERVAL = 30000; // 30 segundos

export function useViewerTracker({
  channelId,
  enabled = true
}: UseViewerTrackerProps) {
  const viewerIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !channelId) return;

    let isMounted = true;

    const joinChannel = async () => {
      if (!isMounted) return;
      
      try {
        const response = await fetch('/api/viewer/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId })
        });
        
        if (!isMounted) return;
        
        const data = await response.json();
        viewerIdRef.current = data.viewerId;
        
        console.log('[TRACKER] Viewer registrado:', data.viewerId);
      } catch (error) {
        console.error('[TRACKER] Error al unirse:', error);
      }
    };

    const sendHeartbeat = async () => {
      if (!isMounted || !viewerIdRef.current) return;
      
      try {
        await fetch('/api/viewer/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId,
            viewerId: viewerIdRef.current
          })
        });
      } catch (error) {
        console.error('[TRACKER] Error en heartbeat:', error);
      }
    };

    const leaveChannel = async () => {
      if (!viewerIdRef.current) return;
      
      try {
        await fetch('/api/viewer/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId,
            viewerId: viewerIdRef.current
          })
        });
        
        console.log('[TRACKER] Viewer removido');
      } catch (error) {
        console.error('[TRACKER] Error al salir:', error);
      }
    };

    joinChannel();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    heartbeatIntervalRef.current = interval;

    return () => {
      isMounted = false;
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      leaveChannel();
    };
  }, [channelId, enabled]);

  return null;
}
