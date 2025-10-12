'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ViewerLoginButton from './ViewerLoginButton';

interface ChannelNavbarProps {
  className?: string;
}

export default function ChannelNavbar({ className = '' }: ChannelNavbarProps) {
  return (
    <header className={`bg-secondary ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image 
                src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                alt="iBlups" 
                width={120}
                height={32}
                className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Botón de Iniciar como Viewer - Cursor */}
          <div className="flex items-center">
            <ViewerLoginButton 
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// Comentario: Navbar específico para páginas de canales creado con Cursor
// Incluye logo y botón de login como viewer, diseño limpio y responsive
