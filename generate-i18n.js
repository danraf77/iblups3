#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directorio de traducciones
const localesDir = path.join(__dirname, 'public', 'locales');

// Leer todos los archivos de traducción
const languages = fs.readdirSync(localesDir).filter(dir => 
  fs.statSync(path.join(localesDir, dir)).isDirectory()
);

console.log('🌍 Generando archivo i18n.ts...');
console.log(`📁 Idiomas encontrados: ${languages.join(', ')}`);

// Cargar todas las traducciones
const resources = {};

languages.forEach(lang => {
  const commonPath = path.join(localesDir, lang, 'common.json');
  
  if (fs.existsSync(commonPath)) {
    try {
      const content = fs.readFileSync(commonPath, 'utf8');
      const translations = JSON.parse(content);
      resources[lang] = { common: translations };
      console.log(`✅ ${lang}: ${Object.keys(translations).length} claves cargadas`);
    } catch (error) {
      console.error(`❌ Error cargando ${lang}:`, error.message);
    }
  } else {
    console.warn(`⚠️  Archivo no encontrado: ${commonPath}`);
  }
});

// Generar el archivo i18n.ts
const i18nContent = `import i18n from 'i18next';
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
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
`;

// Escribir el archivo
const outputPath = path.join(__dirname, 'app', 'lib', 'i18n.ts');
fs.writeFileSync(outputPath, i18nContent);

console.log(`\n🎉 Archivo i18n.ts generado exitosamente!`);
console.log(`📄 Ubicación: ${outputPath}`);
console.log(`📊 Total de idiomas: ${Object.keys(resources).length}`);
console.log(`🔑 Total de claves por idioma: ${Object.keys(resources.en?.common || {}).length}`);

// Verificar que las claves del dashboard estén presentes
const dashboardKeys = [
  'dashboard.welcome',
  'dashboard.description', 
  'dashboard.sidebar.home',
  'dashboard.sidebar.profile',
  'dashboard.sidebar.following',
  'dashboard.sidebar.sessions',
  'dashboard.sidebar.email',
  'dashboard.sidebar.logout'
];

console.log('\n🔍 Verificando claves del dashboard...');
let allKeysPresent = true;

languages.forEach(lang => {
  const translations = resources[lang]?.common;
  if (translations) {
    const missingKeys = dashboardKeys.filter(key => {
      const keyParts = key.split('.');
      let current = translations;
      for (const part of keyParts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return true;
        }
      }
      return false;
    });
    
    if (missingKeys.length === 0) {
      console.log(`✅ ${lang}: Todas las claves del dashboard presentes`);
    } else {
      console.log(`❌ ${lang}: Faltan claves: ${missingKeys.join(', ')}`);
      allKeysPresent = false;
    }
  }
});

if (allKeysPresent) {
  console.log('\n🎉 ¡Todas las traducciones del dashboard están completas!');
} else {
  console.log('\n⚠️  Algunas traducciones del dashboard están incompletas');
}
