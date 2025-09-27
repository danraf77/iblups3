'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { User } from 'lucide-react';
import ClientOnly from './ClientOnly';
import AuthModal from './AuthModal';

interface NavbarProps {
  showSearch?: boolean;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
}

export default function Navbar({
  showSearch = false,
  onSearchChange,
  searchValue = ''
}: NavbarProps) {
  const { t } = useTranslation();
  const { isAuthenticated, user, login } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Detectar scroll para cambiar el estilo del navbar - Cursor
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar el tamaño de pantalla - Cursor
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-secondary/95 backdrop-blur-md shadow-lg' 
        : 'bg-secondary'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Siempre visible y responsive - Cursor */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image 
                src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                alt="iblups" 
                width={120}
                height={32}
                className="h-6 sm:h-7 lg:h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Oculto en móviles - Cursor */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            {/* Producer Access Button - Cursor */}
            <a
              href="https://studio.iblups.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-purple-500/20"
            >
              <ClientOnly fallback="Access your channel">
                {t('navigation.producerAccess')}
              </ClientOnly>
            </a>

            {/* Search Bar - Solo si showSearch es true - Cursor */}
            {showSearch && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t('search.placeholder') || 'Search channels...'}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-64 lg:w-80 bg-input text-primary placeholder-muted pl-10 pr-4 py-2 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            )}

                    {/* Viewer Access - Botón de ingreso como viewer o saludo con icono */}
                    {!isAuthenticated ? (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <ClientOnly fallback="Viewer Login">
                          {t('auth.modal.buttons.viewerLogin') || 'Viewer Login'}
                        </ClientOnly>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="text-primary text-sm">
                          <ClientOnly fallback="Hello">
                            {t('auth.modal.buttons.hello') || 'Hello'}
                          </ClientOnly>, {getUserDisplayName()}
                        </span>
                        <Link
                          href="/dashboard"
                          className="bg-button text-button p-2 rounded-lg hover:bg-button-active transition-colors"
                          title={t('auth.modal.buttons.dashboard') || 'Dashboard'}
                        >
                          <User className="w-5 h-5" />
                        </Link>
                      </div>
                    )}

          </div>

          {/* Mobile Menu Button - Solo visible en móviles - Cursor */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-primary hover:bg-button-active focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg className={`h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Expandible - Cursor */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border-primary">
            {/* Mobile Producer Access Button - Cursor */}
            <div className="px-3 py-2">
              <a
                href="https://studio.iblups.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-purple-500/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <ClientOnly fallback="Access your channel">
                  {t('navigation.producerAccess')}
                </ClientOnly>
              </a>
            </div>

            {/* Mobile Search - Solo si showSearch es true - Cursor */}
            {showSearch && (
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                          <input
                            type="text"
                            placeholder={t('search.placeholder') || 'Search channels...'}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full bg-input text-primary placeholder-muted pl-10 pr-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                </div>
              </div>
            )}

                    {/* Mobile Viewer Access - Botón de ingreso como viewer o saludo con icono */}
                    <div className="px-3 py-2">
                      {!isAuthenticated ? (
                        <button
                          onClick={() => {
                            setShowAuthModal(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <ClientOnly fallback="Viewer Login">
                            {t('auth.modal.buttons.viewerLogin') || 'Viewer Login'}
                          </ClientOnly>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-primary text-sm">
                            <ClientOnly fallback="Hello">
                              {t('auth.modal.buttons.hello') || 'Hello'}
                            </ClientOnly>, {getUserDisplayName()}
                          </span>
                          <Link
                            href="/dashboard"
                            className="bg-button text-button p-2 rounded-lg hover:bg-button-active transition-colors"
                            title={t('auth.modal.buttons.dashboard') || 'Dashboard'}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="w-5 h-5" />
                          </Link>
                        </div>
                      )}
                    </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={login}
        />
      </div>
    </header>
  );
}

