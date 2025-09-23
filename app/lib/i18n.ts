import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'querystring', 'cookie'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      excludeCacheFor: ['cimode'],
      convertDetectedLanguage: (lng) => {
        // Mapear códigos de idioma del navegador a nuestros códigos soportados
        const languageMap: { [key: string]: string } = {
          'en-US': 'en',
          'en-GB': 'en',
          'en-CA': 'en',
          'en-AU': 'en',
          'es-ES': 'es',
          'es-MX': 'es',
          'es-AR': 'es',
          'es-CO': 'es',
          'es-PE': 'es',
          'es-VE': 'es',
          'zh-CN': 'zh',
          'zh-TW': 'zh',
          'zh-HK': 'zh',
          'de-DE': 'de',
          'de-AT': 'de',
          'de-CH': 'de',
          'ja-JP': 'ja',
          'fr-FR': 'fr',
          'fr-CA': 'fr',
          'fr-BE': 'fr',
          'fr-CH': 'fr',
          'ar-SA': 'ar',
          'ar-EG': 'ar',
          'ar-AE': 'ar',
          'pt-BR': 'pt',
          'pt-PT': 'pt',
          'it-IT': 'it',
          'it-CH': 'it',
          'ko-KR': 'ko',
          'hi-IN': 'hi',
          'pl-PL': 'pl',
          'ru-RU': 'ru',
          'ru-BY': 'ru',
          'ru-KZ': 'ru',
          'tr-TR': 'tr',
        };
        
        // Si el idioma está en el mapa, usarlo; si no, usar solo el código base
        const mappedLang = languageMap[lng] || lng.split('-')[0];
        
        // Verificar si el idioma está soportado, si no, usar inglés
        const supportedLngs = ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko', 'hi', 'pl', 'ru', 'tr'];
        return supportedLngs.includes(mappedLang) ? mappedLang : 'en';
      },
    },

    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },

    supportedLngs: ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko', 'hi', 'pl', 'ru', 'tr'],
    
    // Configuración de namespaces
    defaultNS: 'common',
    ns: ['common'],
    
    // Configuración para react-i18next
    react: {
      useSuspense: true,
    },
  });

export default i18n;
