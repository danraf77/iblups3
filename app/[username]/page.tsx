'use client';
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useChannelByUsername } from '../hooks/useChannelByUsername';
import HLSPlayer from '../components/HLSPlayer';

interface ChannelPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [username, setUsername] = React.useState<string>('');
  const [isUsernameReady, setIsUsernameReady] = React.useState(false);
  
  React.useEffect(() => {
    params.then(({ username }) => {
      setUsername(username);
      setIsUsernameReady(true);
    });
  }, [params]);
  
  const { channel, loading, error } = useChannelByUsername(isUsernameReady ? username : '');

  // Mostrar 404 si no se encuentra el canal (solo después de que se haya intentado cargar)
  if (isUsernameReady && !loading && !channel && error === 'Channel not found') {
    notFound();
  }

  // Mostrar loading mientras se obtiene el username o se carga el canal
  if (!isUsernameReady || loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">Cargando canal...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Link 
            href="/"
            className="bg-button text-primary px-4 py-2 rounded-md hover:bg-button-active transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!channel) return null;

  return (
    <div className="min-h-screen bg-primary">
      {/* Header - Navbar simplificado sin buscador */}
      <header className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image 
                  src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                  alt="iBlups" 
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-8">
              <Link
                href="/"
                className="text-sm font-medium pb-4 border-b-2 text-muted border-transparent hover:text-secondary"
              >
                All
              </Link>
              <Link
                href="/?tab=popular"
                className="text-sm font-medium pb-4 border-b-2 text-muted border-transparent hover:text-secondary"
              >
                Popular
              </Link>
              <Link
                href="/?tab=recent"
                className="text-sm font-medium pb-4 border-b-2 text-muted border-transparent hover:text-secondary"
              >
                Recent
              </Link>
            </div>

            {/* Espacio vacío para mantener el layout */}
            <div className="w-64"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nombre del Canal */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">
            {channel.name}
          </h1>
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
  );
}

// Comentario: Página dinámica de canal por username creada con Cursor
// - Búsqueda dinámica de canales por username
// - Navbar idéntico al de la página inicial
// - Player embed con iframe
// - Información completa del canal
// - Estados de carga, error y 404
