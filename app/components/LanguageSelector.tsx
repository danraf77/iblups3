'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'ko', name: '한국어' },
];

export default function LanguageSelector() {
  const { changeLanguage, currentLanguage } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cerrar dropdown al hacer click fuera - Cursor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false); // Cerrar dropdown después de seleccionar - Cursor
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Usar 'en' como fallback durante la hidratación para evitar diferencias
  const displayLanguage = isClient ? currentLanguage : 'en';
  const currentLang = languages.find(lang => lang.code === displayLanguage) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors duration-200 border border-border-primary rounded-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentLang.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      
      <div className={`absolute right-0 bottom-full mb-2 w-48 bg-card border border-border-primary rounded-md shadow-lg transition-all duration-200 z-50 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-button-active transition-colors duration-200 flex items-center justify-between focus:outline-none focus:bg-button-active ${
                displayLanguage === language.code ? 'bg-button-active text-primary' : 'text-muted'
              }`}
            >
              <span>{language.name}</span>
              {displayLanguage === language.code && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
