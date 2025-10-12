#!/bin/bash

# Script para aplicar el layout actualizado del dashboard
echo "🔄 Aplicando layout actualizado del dashboard..."

# Hacer backup del archivo original
cp app/dashboard/layout.tsx app/dashboard/layout.tsx.backup

# Aplicar el layout actualizado
cp app/dashboard/layout-updated.tsx app/dashboard/layout.tsx

echo "✅ Layout del dashboard actualizado"
echo "📋 Cambios aplicados:"
echo "  - Logo de iblups en lugar de texto 'Dashboard'"
echo "  - Import de Image agregado"
echo "  - Logo clickeable que lleva a la página principal"
echo "  - Backup creado en: app/dashboard/layout.tsx.backup"
