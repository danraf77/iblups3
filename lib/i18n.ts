import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar todas las traducciones
import enCommon from '../public/locales/en/common.json';
import esCommon from '../public/locales/es/common.json';
import zhCommon from '../public/locales/zh/common.json';
import deCommon from '../public/locales/de/common.json';
import jaCommon from '../public/locales/ja/common.json';
import frCommon from '../public/locales/fr/common.json';
import arCommon from '../public/locales/ar/common.json';
import itCommon from '../public/locales/it/common.json';
import koCommon from '../public/locales/ko/common.json';
import hiCommon from '../public/locales/hi/common.json';
import plCommon from '../public/locales/pl/common.json';
import ruCommon from '../public/locales/ru/common.json';
import trCommon from '../public/locales/tr/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  es: {
    common: esCommon,
  },
  zh: {
    common: zhCommon,
  },
  de: {
    common: deCommon,
  },
  ja: {
    common: jaCommon,
  },
  fr: {
    common: frCommon,
  },
  ar: {
    common: arCommon,
  },
  it: {
    common: itCommon,
  },
  ko: {
    common: koCommon,
  },
  hi: {
    common: hiCommon,
  },
  pl: {
    common: plCommon,
  },
  ru: {
    common: ruCommon,
  },
  tr: {
    common: trCommon,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },

    // Configuración para idiomas RTL (árabe)
    lng: 'en',
    supportedLngs: ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'it', 'ko', 'hi', 'pl', 'ru', 'tr'],
    
    // Configuración de namespaces
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;
