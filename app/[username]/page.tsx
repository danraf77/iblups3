'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useChannelByUsername } from '../hooks/useChannelByUsername';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import Footer from '../components/Footer';
import FollowButton from '../components/FollowButton';
import AuthModal from '../components/AuthModal';
import { User } from 'lucide-react';
import '../styles/footer.css';

interface ChannelPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ChannelPage({ params }: ChannelPageProps) {
  // Usar React.use() para obtener el username
  const { username } = React.use(params);
  const { t } = useTranslation();
  const { channel, loading, error } = useChannelByUsername(username);
  const { isAuthenticated, user, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Función para determinar el nombre a mostrar en el saludo
  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Prioridad: display_name -> first_name + last_name -> email
    if (user.display_name) {
      return user.display_name;
    }
    
    // Si no hay display_name pero hay perfil con nombre y apellido
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    
    if (user.profile?.first_name) {
      return user.profile.first_name;
    }
    
    return user.email;
  };

  // Si hay error, mostrar página de error
  if (error) {
    return (
      <div className="page-with-footer bg-primary">
        {/* Header */}
        <header className="bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <Image 
                    src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                    alt="iblups" 
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <div className="flex-1"></div>
            </div>
          </div>
        </header>

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
        <header className="bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <Image 
                    src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                    alt="iblups" 
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <div className="flex-1"></div>
            </div>
          </div>
        </header>

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
        <header className="bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <Image 
                    src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                    alt="iblups" 
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <div className="flex-1"></div>
            </div>
          </div>
        </header>

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
      {/* Header - Navbar simplificado sin buscador */}
      <header className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image 
                  src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                  alt="iblups" 
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Espacio vacío para mantener el layout centrado */}
            <div className="flex-1"></div>

            {/* Botón de ingreso como viewer */}
                    {!isAuthenticated ? (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        {t('auth.modal.buttons.viewerLogin')}
                      </button>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="text-primary text-sm">
                          {t('auth.modal.buttons.hello')}, {getUserDisplayName()}
                        </span>
                        <Link
                          href="/dashboard"
                          className="bg-button text-button p-2 rounded-lg hover:bg-button-active transition-colors"
                          title={t('auth.modal.buttons.dashboard')}
                        >
                          <User className="w-5 h-5" />
                        </Link>
                      </div>
                    )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="page-content">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nombre del Canal y Botón Seguir */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl font-bold text-primary">
            {channel.name}
          </h1>
          
          {/* Botón de seguir */}
          <FollowButton
            channelId={channel.id}
            channelUsername={channel.username}
            channelName={channel.name}
            className="self-start sm:self-center"
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

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={login}
      />
    </div>
  );
}

// Comentario: Página dinámica de canal por username actualizada con Cursor
// - Búsqueda dinámica de canales por username
// - Navbar con botón de ingresar y perfil de usuario
// - Player embed con iframe
// - Botón de seguir canal con autenticación
// - Modal de autenticación con OTP
// - Estados de carga, error y 404
// - Sistema completo de usuarios viewers
