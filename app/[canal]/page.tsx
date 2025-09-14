import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getChannelById } from '../data/channelMapping';

interface ChannelPageProps {
  params: {
    canal: string;
  };
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const { canal } = params;
  
  // Obtener el canal por ID
  const channel = getChannelById(canal);
  
  // Si no se encuentra el canal, mostrar 404
  if (!channel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header - Mismo navbar que la página inicial */}
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

            {/* Search and View Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search channels..."
                  className="bg-input text-primary placeholder-muted px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Canal Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {channel.name}
          </h1>
          {channel.description && (
            <p className="text-lg text-muted">
              {channel.description}
            </p>
          )}
        </div>

        {/* Video Player - Embed como iframe */}
        <div className="bg-card rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`/embed/${canal}`}
              className="w-full h-full border-0"
              title={`${channel.name} - Live Stream`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Canal Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="bg-button text-primary px-6 py-3 rounded-md hover:bg-button-active transition-colors font-medium">
              Seguir Canal
            </button>
            <button className="bg-tertiary text-primary px-6 py-3 rounded-md hover:bg-button transition-colors font-medium">
              Compartir
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-muted">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">En vivo</span>
          </div>
        </div>
      </main>
    </div>
  );
}

// Comentario: Página dinámica de canal creada con Cursor
// - Ruta dinámica /[canal] para canales individuales
// - Navbar idéntico al de la página inicial
// - Información del canal y embed como iframe
// - Botones de acción y estado en vivo
