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
  const { username } = React.use(params);
  const { channel, loading, error } = useChannelByUsername(username);

  const [viewers, setViewers] = useState<number>(0);

  // 🎯 Escuchar en tiempo real al Gateway WebSocket (solo lectura)
  useEffect(() => {
    if (!username) return;

    const ws = new WebSocket(`wss://iblups-viewers-gateway.fly.dev?channel=${username}`);

    ws.onopen = () => console.log(`🟢 Conectado al Gateway (${username})`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.viewers === 'number') {
          setViewers(data.viewers);
        }
      } catch (err) {
        console.warn('⚠️ Mensaje WS inválido:', event.data);
      }
    };
    ws.onclose = () => console.log(`🔴 Desconectado (${username})`);
    ws.onerror = (err) => console.error('❌ Error WS:', err);

    return () => ws.close();
  }, [username]);

  // 🧱 Estado de error o carga
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

      <div className="page-content">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-primary">{channel.name}</h1>

            <div className="flex items-center gap-4">
              <FollowChannelButton
                channelId={channel.id || ''}
                channelUsername={channel.username || ''}
                channelName={channel.name || ''}
              />

              {/* 👁️ Viewers en tiempo real */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/10 text-gray-300">
                <span className="font-medium">{viewers}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5
                       c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7
                       -4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
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
