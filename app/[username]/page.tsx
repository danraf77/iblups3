'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useChannelByUsername } from '../hooks/useChannelByUsername';
import Footer from '../components/Footer';
import ChannelNavbar from '../components/ChannelNavbar';
import FollowChannelButton from '../components/FollowChannelButton';
import '../styles/footer.css';

interface ChannelPageProps {
  params: Promise<{ username: string }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  // obtener username de la URL
  const { username } = React.use(params);
  const { channel, loading, error } = useChannelByUsername(username);

  // 🎯 estado local para viewers en vivo
  const [viewers, setViewers] = useState<number | null>(null);

  // 🧠 efecto: obtener viewers desde tu API /api/viewers/get
  useEffect(() => {
    if (!username) return;

    const fetchViewers = async () => {
      try {
        const res = await fetch('/api/viewers/get', { cache: 'no-store' });
        const json = await res.json();
        const viewerData = json.data?.find(
          (ch: { username: string }) => ch.username === username
        );
        setViewers(viewerData ? viewerData.viewers : 0);
      } catch (err) {
        console.error('Error cargando viewers:', err);
      }
    };

    fetchViewers();
    const interval = setInterval(fetchViewers, 5000); // refrescar cada 5s
    return () => clearInterval(interval);
  }, [username]);

  // estados de error/carga
  if (error) {
    return (
      <div className="page-with-footer bg-primary">
        <ChannelNavbar />
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Error: {error}</p>
            <Link
              href="/"
              className="bg-button text-primary px-4 py-2 rounded-md hover:bg-button-active transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading || !channel) {
    return (
      <div className="page-with-footer bg-primary">
        <ChannelNavbar />
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary">Cargando canal...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-with-footer bg-primary">
      <ChannelNavbar />

      {/* Main Content */}
      <div className="page-content">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Título del canal + botones (seguir + viewers) */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-primary">{channel.name}</h1>

            <div className="flex items-center gap-4">
              <FollowChannelButton
                channelId={channel.id || ''}
                channelUsername={channel.username || ''}
                channelName={channel.name || ''}
              />
              {/* 🔴 contador de viewers */}
              {viewers !== null && (
                <div className="flex items-center text-sm text-gray-600 bg-white/10 px-3 py-1 rounded-full">
                  <span className="text-red-500 mr-1">🔴</span>
                  <span>{viewers}</span>
                  <span className="ml-1">viendo</span>
                </div>
              )}
            </div>
          </div>

          {/* Player */}
          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`/embed/${username}`}
                className="w-full h-full border-0"
                title={`${channel.name} - Live Stream`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
