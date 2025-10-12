#!/bin/bash

# Script para cambiar iBluPS por iblups en todo el proyecto
echo "🔄 Cambiando iBluPS por iblups en todo el proyecto..."

# Cambiar en archivos específicos
sed -i '' 's/iBluPS/iblups/g' app/api/auth/send-otp/route.ts
sed -i '' 's/iBluPS/iblups/g' app/components/OTPEmailTemplate.tsx
sed -i '' 's/iBluPS/iblups/g' test-profile-debug.js
sed -i '' 's/iBluPS/iblups/g' dashboard-layout-update.tsx
sed -i '' 's/iBluPS/iblups/g' OTP_AUTH_SYSTEM.md

echo "✅ Cambios completados"
echo "📋 Archivos modificados:"
echo "  - app/api/auth/send-otp/route.ts"
echo "  - app/components/OTPEmailTemplate.tsx" 
echo "  - test-profile-debug.js"
echo "  - dashboard-layout-update.tsx"
echo "  - OTP_AUTH_SYSTEM.md"
