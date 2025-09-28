#!/usr/bin/env node

// Script para probar el debugging del perfil
const fs = require('fs');

console.log('🔍 Sistema de Debug del Perfil - iBluPS');
console.log('=====================================');

// Verificar si el archivo de log existe
const logFile = '/Users/danraf77/Documents/iblups2024/iblups3/debug-profile.log';

if (fs.existsSync(logFile)) {
  console.log('📁 Archivo de log encontrado:', logFile);
  
  const logContent = fs.readFileSync(logFile, 'utf8');
  console.log('📊 Contenido del log:');
  console.log('===================');
  console.log(logContent);
  
  if (logContent.trim() === '') {
    console.log('⚠️  El archivo de log está vacío. Intenta guardar el perfil para generar logs.');
  }
} else {
  console.log('❌ Archivo de log no encontrado. Se creará cuando se intente guardar el perfil.');
}

console.log('\n🔧 Para probar:');
console.log('1. Ve a http://localhost:3000/dashboard/profile');
console.log('2. Llena el formulario y haz clic en "Guardar Cambios"');
console.log('3. Revisa la consola del navegador (F12) para logs del frontend');
console.log('4. Revisa este archivo de log para logs del servidor');
console.log('5. Ejecuta: node test-profile-debug.js para ver los logs');
