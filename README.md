# iBlups - Plataforma de Streaming

Una aplicación de streaming moderna construida con Next.js 15, React 19, TypeScript y Supabase.

## Características

- 🎥 **Grid de Canales**: Visualización en grid 4x6 con paginación
- 🔴 **Canales en Vivo**: Prioridad para canales en vivo
- 🔍 **Búsqueda**: Búsqueda en tiempo real de canales
- 📱 **Responsive**: Diseño adaptativo para todos los dispositivos
- 🎨 **UI Moderna**: Interfaz oscura con el logo oficial de iBlups
- ⚡ **Rendimiento**: Optimizado con Next.js 15 y Turbopack

## Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Deployment**: Vercel

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

## Estructura del Proyecto

```
app/
├── components/
│   └── ChannelCard.tsx      # Componente de tarjeta de canal
├── canales/
│   └── page.tsx            # Página principal de canales
├── globals.css             # Estilos globales
├── layout.tsx              # Layout principal
└── page.tsx                # Página de inicio (redirige a canales)
```

## Funcionalidades Implementadas

### Página de Canales (`/canales`)

- **Grid Responsivo**: 4 columnas en desktop, adaptativo en móvil
- **Paginación**: 24 canales por página (4x6)
- **Filtros**: Todos, Populares, Recientes
- **Búsqueda**: Búsqueda en tiempo real por nombre
- **Vista**: Toggle entre vista de grid y lista
- **Ordenamiento**: Canales en vivo primero

### Componente ChannelCard

- **Thumbnail**: Imagen del canal o placeholder
- **Badges**: "VIVO" y "4K" cuando corresponde
- **Información**: Nombre, categoría, espectadores
- **Hover Effects**: Transiciones suaves

## Desarrollo

### Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
```

### Próximas características

- [ ] Reproductor de video integrado
- [ ] Sistema de favoritos
- [ ] Chat en vivo
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Analytics de visualización

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ usando Cursor AI**
