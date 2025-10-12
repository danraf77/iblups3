#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Cargar el archivo i18n.ts generado
const i18nPath = path.join(__dirname, 'app', 'lib', 'i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

// Extraer el objeto resources del archivo
const resourcesMatch = i18nContent.match(/const resources = ({[\s\S]*?});/);
if (!resourcesMatch) {
  console.log('❌ No se pudo extraer el objeto resources del archivo i18n.ts');
  process.exit(1);
}

try {
  // Evaluar el objeto resources (esto es seguro ya que lo generamos nosotros)
  const resources = eval(`(${resourcesMatch[1]})`);
  
  console.log('🔍 Verificando traducciones del dashboard en i18n.ts...\n');
  
  const languages = ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko', 'hi', 'pl', 'ru', 'tr'];
  const requiredKeys = [
    'dashboard.welcome',
    'dashboard.description',
    'dashboard.loading',
    'dashboard.sidebar.home',
    'dashboard.sidebar.profile',
    'dashboard.sidebar.following',
    'dashboard.sidebar.sessions',
    'dashboard.sidebar.email',
    'dashboard.sidebar.logout'
  ];
  
  let allComplete = true;
  
  languages.forEach(lang => {
    if (!resources[lang] || !resources[lang].common) {
      console.log(`❌ ${lang}: No se encontró el objeto common`);
      allComplete = false;
      return;
    }
    
    const translations = resources[lang].common;
    const missingKeys = [];
    const presentKeys = [];
    
    requiredKeys.forEach(key => {
      const keyParts = key.split('.');
      let current = translations;
      
      for (const part of keyParts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          current = null;
          break;
        }
      }
      
      if (current === null || current === undefined) {
        missingKeys.push(key);
      } else {
        presentKeys.push(key);
      }
    });
    
    if (missingKeys.length === 0) {
      console.log(`✅ ${lang}: Todas las traducciones presentes (${presentKeys.length}/${requiredKeys.length})`);
    } else {
      console.log(`❌ ${lang}: Faltan ${missingKeys.length} traducciones`);
      console.log(`   Faltantes: ${missingKeys.join(', ')}`);
      allComplete = false;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (allComplete) {
    console.log('🎉 ¡Todas las traducciones están presentes en i18n.ts!');
  } else {
    console.log('⚠️  Algunas traducciones están faltando en i18n.ts');
  }
  
} catch (error) {
  console.log('❌ Error al evaluar el objeto resources:', error.message);
}
