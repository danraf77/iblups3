#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Claves requeridas para el dashboard
const requiredKeys = [
  'dashboard.welcome',
  'dashboard.description',
  'dashboard.loading',
  'dashboard.loadingDashboard',
  'dashboard.stats.following',
  'dashboard.stats.recentActivity',
  'dashboard.stats.memberSince',
  'dashboard.quickActions.title',
  'dashboard.quickActions.editProfile',
  'dashboard.quickActions.editProfileDesc',
  'dashboard.quickActions.viewFollowing',
  'dashboard.quickActions.viewFollowingDesc',
  'dashboard.sidebar.home',
  'dashboard.sidebar.profile',
  'dashboard.sidebar.following',
  'dashboard.sidebar.sessions',
  'dashboard.sidebar.email',
  'dashboard.sidebar.logout',
  'dashboard.sidebar.backToHome'
];

const languages = ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko', 'hi', 'pl', 'ru', 'tr'];

function checkTranslations() {
  console.log('🔍 Verificando traducciones del dashboard...\n');
  
  let allComplete = true;
  
  languages.forEach(lang => {
    const filePath = path.join(__dirname, 'public', 'locales', lang, 'common.json');
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`❌ ${lang}: Archivo no encontrado`);
        allComplete = false;
        return;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const translations = JSON.parse(fileContent);
      
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
      
    } catch (error) {
      console.log(`❌ ${lang}: Error al leer archivo - ${error.message}`);
      allComplete = false;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (allComplete) {
    console.log('🎉 ¡Todas las traducciones del dashboard están completas!');
    console.log('🌍 14 idiomas soportados con traducciones completas');
    console.log('✅ El dashboard se traducirá correctamente');
  } else {
    console.log('⚠️  Algunas traducciones están incompletas');
    console.log('🔧 Revisa los archivos de traducción');
  }
  
  return allComplete;
}

// Ejecutar verificación
const isComplete = checkTranslations();
process.exit(isComplete ? 0 : 1);
