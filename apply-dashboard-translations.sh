#!/bin/bash

echo "🔄 Aplicando traducciones completas del dashboard..."

# Hacer backup de los archivos originales
echo "📦 Creando backups..."
cp app/dashboard/layout.tsx app/dashboard/layout.tsx.backup
cp app/dashboard/page.tsx app/dashboard/page.tsx.backup

# Aplicar layout traducido
echo "🎨 Aplicando layout traducido..."
cp app/dashboard/layout-translated.tsx app/dashboard/layout.tsx

# Aplicar página traducida
echo "📄 Aplicando página traducida..."
cp app/dashboard/page-translated.tsx app/dashboard/page.tsx

# Limpiar archivos temporales
echo "🧹 Limpiando archivos temporales..."
rm -f app/dashboard/layout-translated.tsx
rm -f app/dashboard/page-translated.tsx
rm -f add-dashboard-translations.js

echo "✅ Dashboard completamente traducido!"
echo "📋 Cambios aplicados:"
echo "  - ✅ Traducciones agregadas a todos los 14 idiomas"
echo "  - ✅ Layout del dashboard con traducciones"
echo "  - ✅ Página principal del dashboard traducida"
echo "  - ✅ Footer agregado al dashboard"
echo "  - ✅ Sidebar completamente traducido"
echo "  - ✅ Botones y textos traducidos"
echo "  - ✅ Backups creados de archivos originales"
echo ""
echo "🌍 Idiomas soportados:"
echo "  - English, Español, 中文, Deutsch, 日本語"
echo "  - Français, العربية, Português, Italiano"
echo "  - 한국어, हिन्दी, Polski, Русский, Türkçe"
echo ""
echo "🎯 El dashboard ahora se traduce automáticamente al cambiar el idioma!"
