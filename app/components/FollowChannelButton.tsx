'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import OTPLoginModal from './OTPLoginModal';

interface FollowChannelButtonProps {
  channelId: string;
  channelUsername: string;
  channelName: string;
  className?: string;
}

export default function FollowChannelButton({ 
  channelId, 
  channelUsername, 
  channelName, 
  className = '' 
}: FollowChannelButtonProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const checkFollowStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/channel/follow-status?channelId=${channelId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [channelId]);

  // Verificar si el usuario ya sigue este canal
  useEffect(() => {
    if (isAuthenticated && user) {
      checkFollowStatus();
    }
  }, [isAuthenticated, user, checkFollowStatus]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch('/api/channel/unfollow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channelId }),
        });

        if (response.ok) {
          setIsFollowing(false);
        }
      } else {
        // Follow
        const response = await fetch('/api/channel/follow', {
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

        if (response.ok) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Después del login, hacer follow automáticamente
    setTimeout(() => {
      handleFollowToggle();
    }, 500);
  };

  if (authLoading) {
    return (
      <button
        disabled
        className={`p-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-white/20 ${className}`}
      >
        <svg className="w-5 h-5 text-white/50 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleFollowToggle}
        disabled={isLoading}
        className={`p-2 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          isFollowing 
            ? 'bg-[#2c73ff] hover:bg-[#1e5bb8] text-white' 
            : 'bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:bg-gray-700/50 text-white'
        } ${className}`}
        title={isFollowing ? 'Dejar de seguir' : 'Seguir canal'}
      >
        {isLoading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg 
            className={`w-5 h-5 transition-all duration-200 ${isFollowing ? 'fill-current' : ''}`} 
            fill={isFollowing ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        )}
      </button>

      <OTPLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
