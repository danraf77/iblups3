#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para cargar traducciones desde archivos JSON
function loadTranslationsFromFiles() {
  const languages = ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko', 'hi', 'pl', 'ru', 'tr'];
  const resources = {};
  
  languages.forEach(lang => {
    const filePath = path.join(__dirname, 'public', 'locales', lang, 'common.json');
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(fileContent);
        resources[lang] = { common: translations };
        console.log(`✅ Cargado: ${lang}/common.json`);
      } else {
        console.log(`❌ No encontrado: ${lang}/common.json`);
      }
    } catch (error) {
      console.error(`❌ Error cargando ${lang}:`, error.message);
    }
  });
  
  return resources;
}

// Generar el nuevo archivo i18n.ts
function generateI18nConfig() {
  const resources = loadTranslationsFromFiles();
  
  const i18nConfig = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Cargar traducciones desde archivos JSON
const resources = ${JSON.stringify(resources, null, 2)};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
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
      useSuspense: false,
    },
  });

export default i18n;`;

  return i18nConfig;
}

// Ejecutar la actualización
console.log('🔄 Actualizando configuración de i18n...');

const newConfig = generateI18nConfig();
const configPath = path.join(__dirname, 'app', 'lib', 'i18n.ts');

// Hacer backup del archivo original
const backupPath = path.join(__dirname, 'app', 'lib', 'i18n.ts.backup');
if (fs.existsSync(configPath)) {
  fs.copyFileSync(configPath, backupPath);
  console.log('📦 Backup creado: i18n.ts.backup');
}

// Escribir nueva configuración
fs.writeFileSync(configPath, newConfig, 'utf8');
console.log('✅ Configuración de i18n actualizada');
console.log('🎯 Ahora las traducciones del dashboard se cargarán desde los archivos JSON');
