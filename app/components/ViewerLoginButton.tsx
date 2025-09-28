'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import OTPLoginModal from './OTPLoginModal';

interface ViewerLoginButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function ViewerLoginButton({ 
  className = '', 
  variant = 'primary',
  size = 'md'
}: ViewerLoginButtonProps) {
  const { user, isAuthenticated, loading, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = (userData: { id: string; email: string; display_name?: string; username?: string }) => {
    login(userData);
    setShowLoginModal(false);
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      primary: 'bg-[#2c73ff] text-white hover:bg-[#1e5bb8] focus:ring-[#2c73ff] shadow-sm hover:shadow-md transform hover:scale-105',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-2 border-[#2c73ff] text-[#2c73ff] hover:bg-[#2c73ff] hover:text-white focus:ring-[#2c73ff]'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  if (loading) {
    return (
      <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-400">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Cargando...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-green-800">
            Hola, {user?.email || 'Viewer'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className={getButtonClasses()}
        aria-label="Iniciar sesión como viewer"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Iniciar como Viewer
      </button>

      <OTPLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

// Comentario: Componente de botón de login como viewer creado con Cursor
// Incluye estados de carga, autenticado y no autenticado con modal OTP integrado
