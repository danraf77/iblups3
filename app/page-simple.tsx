'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from './hooks/useTranslation';

interface Channel {
  id: string;
  name: string;
  username: string;
  description?: string;
  is_live: boolean;
  viewers_count: number;
  category?: string;
  thumbnail_url?: string;
}

export default function SimpleHomePage() {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/channels/paginated?page=1&limit=4&search=&tab=all');
        
        if (!response.ok) {
          throw new Error('Error fetching channels');
        }

        const data = await response.json();
        setChannels(data.channels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">Cargando canales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          {t('navigation.home')} - {channels.length} canales
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-card p-4 rounded-lg border border-border-primary">
              <h3 className="text-primary font-medium">{channel.name}</h3>
              <p className="text-muted text-sm">@{channel.username}</p>
              <p className="text-muted text-sm">
                {channel.is_live ? '🔴 LIVE' : '⏸️ Offline'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
