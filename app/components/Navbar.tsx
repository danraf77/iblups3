'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
                alt="iBlups" 
                width={120}
                height={32}
                className="h-6 sm:h-7 lg:h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Oculto en móviles - Cursor */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
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
                  placeholder={t('search.placeholder')}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-64 lg:w-80 bg-input text-primary placeholder-muted pl-10 pr-4 py-2 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            )}

            {/* Producer Access Button - Cursor */}
            <a
              href="https://studio.iblups.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {t('navigation.producerAccess')}
            </a>

          </div>

          {/* Mobile Menu Button - Solo visible en móviles - Cursor */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-primary hover:bg-button-active focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label={t('navigation.toggleMenu')}
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
                    placeholder={t('search.placeholder')}
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full bg-input text-primary placeholder-muted pl-10 pr-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Mobile Producer Access Button - Cursor */}
            <div className="px-3 py-2">
              <a
                href="https://studio.iblups.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t('navigation.producerAccess')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

