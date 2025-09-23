'use client';
import { useState, useEffect } from 'react';

interface UseChannelFollowProps {
  channelId: string;
  enabled?: boolean;
}

export function useChannelFollow({ channelId, enabled = true }: UseChannelFollowProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (enabled && channelId) {
      checkFollowingStatus();
    }
  }, [channelId, enabled, checkFollowingStatus]);

  const checkFollowingStatus = async () => {
    try {
      const response = await fetch(`/api/channels/is-following?channelId=${channelId}`);
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const followChannel = async (channelUsername: string, channelName: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/channels/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          channelUsername,
          channelName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(true);
      } else {
        setError(data.error || 'Error siguiendo canal');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const unfollowChannel = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/channels/follow?channelId=${channelId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(false);
      } else {
        setError(data.error || 'Error dejando de seguir canal');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (channelUsername: string, channelName: string) => {
    if (isFollowing) {
      await unfollowChannel();
    } else {
      await followChannel(channelUsername, channelName);
    }
  };

  return {
    isFollowing,
    loading,
    error,
    followChannel,
    unfollowChannel,
    toggleFollow
  };
}

// Comentario: Hook para seguimiento de canales creado con Cursor
// - Verifica estado de seguimiento
// - Maneja follow/unfollow
// - Estados de carga y error
// - Optimizado para rendimiento
