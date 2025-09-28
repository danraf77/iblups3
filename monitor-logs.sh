#!/bin/bash

# Script para monitorear logs del perfil en tiempo real
echo "🔍 Monitoreando logs del perfil..."
echo "📁 Archivo: /Users/danraf77/Documents/iblups2024/iblups3/debug-profile.log"
echo "⏰ Iniciado: $(date)"
echo "=========================================="

# Crear el archivo si no existe
touch /Users/danraf77/Documents/iblups2024/iblups3/debug-profile.log

# Monitorear el archivo en tiempo real
tail -f /Users/danraf77/Documents/iblups2024/iblups3/debug-profile.log
