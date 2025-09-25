'use client';
import React, { useState } from 'react';
import { Heart, HeartOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChannelFollow } from '../hooks/useChannelFollow';
import { useTranslation } from '../hooks/useTranslation';
import AuthModal from './AuthModal';

interface FollowButtonProps {
  channelId: string;
  channelUsername: string;
  channelName: string;
  className?: string;
}

export default function FollowButton({ 
  channelId, 
  channelUsername, 
  channelName, 
  className = '' 
}: FollowButtonProps) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { isFollowing, loading, error, toggleFollow } = useChannelFollow({ 
    channelId,
    enabled: isAuthenticated 
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    await toggleFollow(channelUsername, channelName);
  };

  const handleAuthSuccess = (user: { id: string; email: string; first_name?: string; last_name?: string }) => {
    setShowAuthModal(false);
    // El hook useChannelFollow se actualizará automáticamente
  };

  if (error) {
    console.error('Follow button error:', error);
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${isFollowing 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-button hover:bg-button-active text-button'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${className}
        `}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isFollowing ? (
          <>
            <HeartOff className="w-5 h-5" />
            <span>{t('auth.modal.buttons.unfollowChannel')}</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            <span>{t('auth.modal.buttons.followChannel')}</span>
          </>
        )}
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

// Comentario: Botón de seguir canal creado con Cursor
// - Integra autenticación y seguimiento
// - Estados visuales claros
// - Animaciones suaves
// - Manejo de errores
// - UX optimizada
