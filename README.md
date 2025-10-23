# iBlups - Plataforma de Streaming Global

Una plataforma de streaming moderna y completa construida con Next.js 15, React 19, TypeScript y Supabase. Ofrece una experiencia de streaming en vivo con soporte multiidioma, autenticación segura y un reproductor HLS avanzado.

## 🚀 Características Principales

### 🎥 Sistema de Streaming
- **Reproductor HLS Avanzado**: Soporte completo para HLS con Video.js y hls.js
- **Streams en Vivo**: Prioridad para canales en vivo con indicadores visuales
- **Calidad 4K**: Soporte para contenido en alta definición
- **Embed Dinámico**: URLs amigables para compartir streams (`/embed/[username]`)
- **Auto-reproducción**: Configuración inteligente para cumplir políticas del navegador

### 🔐 Sistema de Autenticación
- **Autenticación OTP**: Sistema seguro con códigos de 4 dígitos por email
- **Creación Automática**: Registro automático de usuarios nuevos
- **Sesiones Seguras**: JWT con verificación de sesión en base de datos
- **Perfiles de Usuario**: Gestión completa de perfiles y preferencias
- **Dashboard Personalizado**: Panel de control para usuarios autenticados

### 🌍 Internacionalización Completa
- **14 Idiomas Soportados**: Inglés, Español, Chino, Alemán, Japonés, Francés, Árabe, Italiano, Coreano, Hindi, Polaco, Ruso, Turco
- **Detección Automática**: Detección inteligente del idioma del navegador
- **Traducciones Completas**: Todas las interfaces traducidas
- **Soporte RTL**: Soporte completo para idiomas de derecha a izquierda (árabe)

### 📱 Interfaz de Usuario
- **Grid Responsivo**: Visualización en grid 4x6 con paginación inteligente
- **Búsqueda en Tiempo Real**: Búsqueda instantánea de canales
- **Filtros Avanzados**: Todos, Populares, Recientes
- **Diseño Adaptativo**: Optimizado para móviles, tablets y desktop
- **UI Moderna**: Interfaz oscura con branding oficial de iBlups

### 🔧 Funcionalidades Avanzadas
- **Sistema de Seguimiento**: Seguir y dejar de seguir canales
- **Estadísticas de Usuario**: Dashboard con métricas personalizadas
- **Gestión de Sesiones**: Control de sesiones activas
- **API REST Completa**: Endpoints para todas las funcionalidades
- **Middleware de Seguridad**: Protección de rutas y validación de tokens

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15**: Framework React con App Router
- **React 19**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS 4**: Framework de CSS utilitario
- **Video.js**: Reproductor de video profesional
- **hls.js**: Biblioteca para reproducción HLS

### Backend & Base de Datos
- **Supabase**: Backend-as-a-Service con PostgreSQL
- **JWT**: Autenticación con tokens JSON Web
- **Resend**: Servicio de envío de emails
- **PostgreSQL**: Base de datos relacional

### Herramientas de Desarrollo
- **Turbopack**: Bundler ultra-rápido de Next.js
- **ESLint**: Linter para JavaScript/TypeScript
- **i18next**: Sistema de internacionalización
- **Vercel**: Plataforma de deployment y hosting

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

El archivo `.env.local` ya está configurado con las variables necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 3. Configurar la base de datos

Asegúrate de que tu base de datos Supabase tenga las siguientes tablas (según el esquema en `sql.txt`):

- `channels_channel` - Canales de streaming
- `channels_category` - Categorías de canales
- `channels_country` - Países
- `channels_cdnserver` - Servidores CDN
- `users_user` - Usuarios
- `profile_profile` - Perfiles de usuario

### 4. Ejecutar la aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
iblups3/
├── app/                                    # Aplicación Next.js 15 (App Router)
│   ├── api/                               # API Routes
│   │   ├── auth/                          # Endpoints de autenticación
│   │   │   ├── send-otp/route.ts         # Envío de códigos OTP
│   │   │   ├── verify-otp/route.ts       # Verificación de códigos
│   │   │   ├── me/route.ts              # Información del usuario
│   │   │   └── logout/route.ts           # Cerrar sesión
│   │   ├── channels/                      # API de canales
│   │   │   ├── route.ts                  # Lista de canales
│   │   │   ├── [id]/route.ts             # Detalle de canal
│   │   │   ├── batch/route.ts            # Canales por lotes
│   │   │   └── live-count/route.ts       # Contador de canales en vivo
│   │   ├── dashboard/                     # API del dashboard
│   │   │   ├── stats/route.ts            # Estadísticas del usuario
│   │   │   ├── following/route.ts        # Canales seguidos
│   │   │   ├── sessions/route.ts         # Sesiones activas
│   │   │   └── profile/route.ts          # Perfil del usuario
│   │   └── stream/[username]/route.ts   # API de streaming
│   ├── components/                        # Componentes reutilizables
│   │   ├── ChannelCard.tsx               # Tarjeta de canal
│   │   ├── Navbar.tsx                    # Barra de navegación
│   │   ├── Player.tsx                    # Reproductor de video
│   │   ├── OTPLoginModal.tsx            # Modal de login OTP
│   │   ├── LanguageSelector.tsx        # Selector de idioma
│   │   └── I18nProvider.tsx             # Proveedor de i18n
│   ├── dashboard/                         # Panel de usuario
│   │   ├── layout.tsx                    # Layout del dashboard
│   │   ├── page.tsx                      # Página principal
│   │   ├── profile/page.tsx              # Perfil de usuario
│   │   ├── following/page.tsx            # Canales seguidos
│   │   └── sessions/page.tsx             # Gestión de sesiones
│   ├── [username]/                       # Páginas dinámicas de canales
│   │   └── page.tsx                      # Página individual de canal
│   ├── embed/[username]/                 # Páginas de embed
│   │   └── page.tsx                      # Reproductor embebido
│   ├── hooks/                            # Custom hooks
│   │   ├── useAuth.ts                    # Hook de autenticación
│   │   ├── useChannels.ts                # Hook de canales
│   │   └── useTranslation.ts             # Hook de traducciones
│   ├── lib/                              # Utilidades
│   │   └── i18n.ts                       # Configuración de i18n
│   ├── utils/                            # Funciones utilitarias
│   │   ├── encryption.ts                 # Encriptación de datos
│   │   └── getHlsUrl.ts                  # Generación de URLs HLS
│   └── styles/                           # Estilos CSS
│       ├── colors.css                    # Variables de color
│       ├── player.css                    # Estilos del reproductor
│       └── footer.css                    # Estilos del footer
├── public/
│   └── locales/                          # Archivos de traducción
│       ├── en/common.json               # Inglés
│       ├── es/common.json               # Español
│       ├── zh/common.json                # Chino
│       └── ... (14 idiomas total)
├── database/
│   └── base.sql                          # Esquema de base de datos
├── components/                           # Componentes globales
├── hooks/                                # Hooks globales
├── lib/                                  # Utilidades globales
└── md/                                   # Documentación
    ├── BRANDING_UPDATE.md               # Actualizaciones de marca
    ├── TRANSLATION_COMPLETE.md          # Estado de traducciones
    └── ... (documentación completa)
```

## 🔌 API Endpoints

### Autenticación (`/api/auth/`)
- **POST** `/api/auth/send-otp` - Envía código OTP por email
- **POST** `/api/auth/verify-otp` - Verifica código OTP y autentica usuario
- **GET** `/api/auth/me` - Obtiene información del usuario actual
- **POST** `/api/auth/logout` - Cierra sesión del usuario

### Canales (`/api/channels/`)
- **GET** `/api/channels` - Lista todos los canales con filtros
- **GET** `/api/channels/[id]` - Detalle de un canal específico
- **GET** `/api/channels/[username]` - Canal por username
- **POST** `/api/channels/batch` - Obtiene canales por lotes
- **GET** `/api/channels/live-count` - Contador de canales en vivo
- **GET** `/api/channels/paginated` - Canales con paginación avanzada

### Dashboard (`/api/dashboard/`)
- **GET** `/api/dashboard/stats` - Estadísticas del usuario
- **GET** `/api/dashboard/following` - Canales seguidos por el usuario
- **GET** `/api/dashboard/sessions` - Sesiones activas del usuario
- **GET** `/api/dashboard/profile` - Perfil completo del usuario
- **GET** `/api/dashboard/countries` - Lista de países disponibles

### Streaming (`/api/stream/`)
- **GET** `/api/stream/[username]` - Obtiene URL HLS encriptada para streaming

## 🎯 Funcionalidades Implementadas

### 🏠 Página Principal
- **Hero Section**: Presentación atractiva con call-to-action
- **Navegación Inteligente**: Menú responsive con estado de autenticación
- **Selector de Idioma**: Cambio dinámico entre 14 idiomas
- **Footer Completo**: Enlaces legales y información de la empresa

### 📺 Sistema de Canales
- **Grid Responsivo**: 4 columnas en desktop, adaptativo en móvil
- **Paginación Inteligente**: 24 canales por página (4x6)
- **Filtros Avanzados**: Todos, Populares, Recientes
- **Búsqueda en Tiempo Real**: Búsqueda instantánea por nombre
- **Ordenamiento**: Canales en vivo primero, luego alfabético
- **Thumbnails Dinámicos**: Imágenes generadas automáticamente

### 🎮 Reproductor de Video
- **Soporte HLS Completo**: Video.js + hls.js con fallback nativo
- **Calidad Adaptativa**: Soporte para 4K y múltiples calidades
- **Controles Avanzados**: Play, pause, volumen, pantalla completa
- **Auto-reproducción**: Configuración inteligente para políticas del navegador
- **Embed Dinámico**: URLs amigables para compartir (`/embed/[username]`)

### 👤 Sistema de Usuario
- **Autenticación OTP**: Códigos de 4 dígitos por email
- **Dashboard Personalizado**: Panel de control completo
- **Gestión de Perfil**: Edición de información personal
- **Sistema de Seguimiento**: Seguir/dejar de seguir canales
- **Gestión de Sesiones**: Control de sesiones activas
- **Estadísticas**: Métricas personalizadas de uso

## 🔐 Sistema de Autenticación

### Autenticación OTP
El sistema utiliza códigos OTP de 4 dígitos enviados por email para autenticación segura:

1. **Envío de OTP**: Usuario ingresa email → se envía código por email
2. **Verificación**: Usuario ingresa código → se valida y crea sesión
3. **Creación Automática**: Si el usuario no existe, se crea automáticamente
4. **Sesiones Seguras**: JWT con verificación en base de datos

### Tablas de Base de Datos
- `iblups_users_viewers` - Usuarios del sistema
- `iblups_user_sessions` - Sesiones activas con JWT
- `iblups_profile_viewers` - Perfiles extendidos de usuarios
- `iblups_otp_codes` - Códigos OTP temporales
- `iblups_channel_follows` - Relación usuario-canal (seguimiento)

### Middleware de Seguridad
- **Protección de Rutas**: Rutas del dashboard protegidas
- **Validación de Tokens**: Verificación JWT en cada request
- **Gestión de Sesiones**: Control de sesiones activas y expiración

## 🌍 Sistema de Internacionalización

### Idiomas Soportados (14 total)
- **Inglés** (en) - Idioma por defecto
- **Español** (es) - Traducción completa
- **Chino** (zh) - Soporte para caracteres chinos
- **Alemán** (de) - Traducción completa
- **Japonés** (ja) - Soporte para caracteres japoneses
- **Francés** (fr) - Traducción completa
- **Árabe** (ar) - Soporte RTL completo
- **Italiano** (it) - Traducción completa
- **Coreano** (ko) - Soporte para caracteres coreanos
- **Hindi** (hi) - Soporte para caracteres devanagari
- **Polaco** (pl) - Traducción completa
- **Ruso** (ru) - Traducción completa
- **Turco** (tr) - Traducción completa

### Características de i18n
- **Detección Automática**: Detecta idioma del navegador
- **Persistencia**: Guarda preferencia en localStorage
- **Fallback Inteligente**: Usa inglés si el idioma no está soportado
- **Soporte RTL**: Interfaz completa para árabe
- **Traducciones Completas**: Todas las interfaces traducidas

## 🎥 Sistema de Streaming

### Reproductor HLS
- **Video.js**: Interfaz de usuario profesional
- **hls.js**: Motor de reproducción HLS
- **Fallback Nativo**: Safari/iOS usan HLS nativo
- **Calidad Adaptativa**: Múltiples calidades automáticas
- **Controles Avanzados**: Play, pause, volumen, pantalla completa

### URLs de Streaming
- **Páginas de Canal**: `/[username]` - Página completa con navbar
- **Embed Dinámico**: `/embed/[username]` - Solo reproductor
- **Query Parameters**: `?autoplay=true&muted=true&controls=true`
- **Encriptación**: Stream IDs encriptados para seguridad

### Configuración del Player
```css
:root {
  --player-primary-color: #00d4ff;
  --player-secondary-color: #ffffff;
  --player-background-color: #000000;
  --player-live-color: #ff4444;
}
```

## 🚀 Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
```

### Variables de Entorno Requeridas
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Autenticación
JWT_SECRET=tu_jwt_secret

# Email
RESEND_API_KEY=tu_resend_api_key

# Streaming
NEXT_PUBLIC_HLS_BASE_URL=https://live-stream.iblups.com/dev
```

### Base de Datos
El proyecto utiliza las siguientes tablas principales:
- `channels_channel` - Canales de streaming
- `channels_category` - Categorías de canales
- `channels_country` - Países
- `channels_cdnserver` - Servidores CDN
- `iblups_users_viewers` - Usuarios
- `iblups_profile_viewers` - Perfiles de usuario
- `iblups_user_sessions` - Sesiones activas
- `iblups_channel_follows` - Seguimiento de canales

## 📈 Próximas Características

- [ ] Chat en vivo integrado
- [ ] Notificaciones push
- [ ] Modo offline con PWA
- [ ] Analytics avanzados de visualización
- [ ] Sistema de comentarios
- [ ] Grabación de streams
- [ ] API para desarrolladores
- [ ] Integración con redes sociales

## 🚀 Deployment y Configuración

### Deployment en Vercel
1. **Conectar Repositorio**: Conecta tu repositorio de GitHub a Vercel
2. **Variables de Entorno**: Configura todas las variables requeridas en Vercel
3. **Build Automático**: Vercel detectará Next.js y configurará automáticamente
4. **Dominio Personalizado**: Configura tu dominio personalizado si es necesario

### Configuración de Supabase
1. **Crear Proyecto**: Crea un nuevo proyecto en Supabase
2. **Ejecutar SQL**: Ejecuta el script `database/base.sql` en el SQL Editor
3. **Configurar RLS**: Configura Row Level Security para las tablas
4. **API Keys**: Obtén las claves de API y configúralas en Vercel

### Configuración de Resend
1. **Crear Cuenta**: Regístrate en Resend.com
2. **Verificar Dominio**: Verifica tu dominio para envío de emails
3. **API Key**: Obtén tu API key y configúrala en Vercel
4. **Template**: El template de email ya está configurado

### Monitoreo y Analytics
- **Vercel Analytics**: Métricas de rendimiento automáticas
- **Supabase Dashboard**: Monitoreo de base de datos
- **Logs**: Logs detallados en Vercel Functions

## 🔧 Configuración Avanzada

### Optimizaciones de Rendimiento
- **Turbopack**: Habilitado por defecto en desarrollo
- **Image Optimization**: Next.js optimiza imágenes automáticamente
- **Code Splitting**: División automática de código
- **Caching**: Headers de caché optimizados

### Seguridad
- **HTTPS**: Forzado en producción
- **CORS**: Configurado para dominios permitidos
- **Rate Limiting**: Implementado en endpoints críticos
- **JWT Security**: Tokens seguros con expiración

### Escalabilidad
- **Serverless**: Arquitectura serverless con Vercel
- **CDN**: Distribución global con Vercel Edge Network
- **Database**: Supabase maneja escalabilidad automáticamente
- **Caching**: Múltiples capas de caché

## 📚 Documentación Adicional

### Archivos de Documentación
- `md/BRANDING_UPDATE.md` - Actualizaciones de marca
- `md/TRANSLATION_COMPLETE.md` - Estado de traducciones
- `md/OTP_AUTH_SYSTEM.md` - Sistema de autenticación OTP
- `md/PLAYER_IMPLEMENTATION.md` - Implementación del reproductor
- `md/SESSION_SYSTEM.md` - Sistema de sesiones
- `md/USER_SYSTEM.md` - Sistema de usuarios

### Scripts de Utilidad
- `generate-i18n.js` - Genera configuración de i18n
- `update-i18n-config.js` - Actualiza configuración de traducciones
- `apply-dashboard-translations.sh` - Aplica traducciones al dashboard
- `check-server-status.js` - Verifica estado del servidor

## 🤝 Contribución

### Cómo Contribuir
1. **Fork el Proyecto**: Haz fork del repositorio
2. **Crear Rama**: `git checkout -b feature/nueva-caracteristica`
3. **Commit**: `git commit -m 'Agregar nueva característica'`
4. **Push**: `git push origin feature/nueva-caracteristica`
5. **Pull Request**: Abre un PR con descripción detallada

### Estándares de Código
- **TypeScript**: Tipado estricto requerido
- **ESLint**: Código debe pasar el linter
- **Convenciones**: Seguir convenciones de Next.js
- **Testing**: Agregar tests para nuevas funcionalidades

### Proceso de Review
- **Code Review**: Todo el código es revisado
- **Testing**: Pruebas manuales y automáticas
- **Documentación**: Actualizar documentación si es necesario
- **Deployment**: Deploy automático tras aprobación

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ usando Cursor AI**

*Última actualización: Enero 2025 - Documentación completa del proyecto iBlups*
