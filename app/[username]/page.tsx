'use client';
import React from 'react';
import Link from 'next/link';
import { useChannelByUsername } from '../hooks/useChannelByUsername';
import Footer from '../components/Footer';
import ChannelNavbar from '../components/ChannelNavbar';
import FollowChannelButton from '../components/FollowChannelButton';
import '../styles/footer.css';

interface ChannelPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  // Usar React.use() para obtener el username
  const { username } = React.use(params);
  const { channel, loading, error } = useChannelByUsername(username);

  // Si hay error, mostrar página de error
  if (error) {
    return (
      <div className="page-with-footer bg-primary">
        {/* Header */}
        <ChannelNavbar />

        {/* Error Content */}
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

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // Si está cargando o no hay canal, mostrar estado de carga
  if (loading || !channel) {
    return (
      <div className="page-with-footer bg-primary">
        {/* Header */}
        <ChannelNavbar />

        {/* Loading Content */}
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary">Cargando canal...</p>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="page-with-footer bg-primary">
        {/* Header */}
        <ChannelNavbar />

        {/* Error Content */}
        <div className="page-content">
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
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  if (!channel) return null;

  return (
    <div className="page-with-footer bg-primary">
      {/* Header - Navbar con botón de viewer */}
      <ChannelNavbar />

      {/* Main Content */}
      <div className="page-content">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nombre del Canal y Botón de Seguir - Misma línea */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">
            {channel.name}
          </h1>
          <FollowChannelButton
            channelId={channel.id || ''}
            channelUsername={channel.username || ''}
            channelName={channel.name || ''}
          />
        </div>

        {/* Video Player - Iframe del embed dinámico */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Comentario: Página dinámica de canal por username creada con Cursor
// - Búsqueda dinámica de canales por username
// - Navbar idéntico al de la página inicial
// - Player embed con iframe
// - Información completa del canal
// - Estados de carga, error y 404
