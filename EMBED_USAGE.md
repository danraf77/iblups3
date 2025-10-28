# Uso de la Página de Embed

## Descripción
Se ha creado una página dinámica para reproducir streams HLS en formato embed con proporción 16:9 fija.

## URLs de Acceso

### Página de Canal Individual (Dinámica)
```
/[USERNAME]
```

### Página de Embed
```
/embed/[USERNAME]
```

## Ejemplo de Uso

### Página completa del canal (con navbar):
```
http://localhost:3000/dantecanal
http://localhost:3000/globalnews
http://localhost:3000/sportscentral
```

### Solo el player (embed):
```
http://localhost:3000/embed/dantecanal
http://localhost:3000/embed/globalnews
http://localhost:3000/embed/sportscentral
```

## Canales Disponibles

### Generación Dinámica de URLs:
- **Prioridad 1**: Usa el `username` del canal (ej: "dantecanal")
- **Prioridad 2**: Usa el `stream_id` si no hay username
- **Prioridad 3**: Genera URL basada en el `name` del canal
- **Fallback**: Usa el ID del canal si no se puede generar nombre

### URLs de Ejemplo:
- `http://localhost:3000/dantecanal` (si username = "dantecanal")
- `http://localhost:3000/vps2` (si username = "vps2")
- `http://localhost:3000/globalnews` (si username = "globalnews")
- `http://localhost:3000/sportscentral` (si username = "sportscentral")
- `http://localhost:3000/canalname` (generado desde name si no hay username)

### Características del Sistema:
- **Dinámico**: Se adapta a cualquier canal de la API
- **Amigable**: URLs legibles y SEO-friendly
- **Robusto**: Maneja UUIDs, nombres especiales y caracteres raros
- **Extensible**: No requiere mapeo manual para nuevos canales

## Características Implementadas

### ✅ HLS Player
- Soporte para HLS nativo (Safari) y HLS.js (otros navegadores)
- Configuración optimizada para streaming en vivo
- Auto-reproducción (muted para cumplir políticas del navegador)

### ✅ Diseño Responsivo
- Proporción 16:9 fija en todos los dispositivos
- Contenedor responsivo con máximo ancho de 7xl
- Estilos optimizados para móviles y desktop

### ✅ Logo del Player
- Logo de iBlups posicionado en esquina superior izquierda
- Efecto hover para mejor interactividad
- Z-index optimizado para no interferir con controles

### ✅ Estados de UI
- Indicador de carga personalizado
- Manejo de errores con mensajes informativos
- Transiciones suaves

### ✅ Página de Canal Individual (Dinámica)
- Búsqueda automática de canal por username
- Navbar simplificado (sin buscador)
- Nombre del canal como título principal
- Iframe directo del embed con proporción 16:9
- Estados de carga, error y 404
- Diseño limpio y minimalista

### ✅ Navegación desde Página Inicial
- Click en cualquier canal abre nueva pestaña
- Redirección automática a /[username] (prioridad: username > stream_id > name)
- Generación dinámica de URLs amigables
- Soporte para UUIDs de Supabase y datos de ejemplo
- Indicador visual de nueva pestaña
- Efectos hover mejorados

## Estructura de Archivos Creados

```
app/
├── components/
│   └── HLSPlayer.tsx          # Componente principal del player
├── data/
│   └── channelMapping.ts      # Mapeo de canales y URLs HLS
├── hooks/
│   └── useChannelByUsername.ts # Hook para búsqueda de canal
├── api/
│   └── channels/
│       └── [username]/
│           └── route.ts       # API de canal por username
├── embed/
│   └── [url]/
│       └── page.tsx           # Página dinámica de embed
├── [username]/
│   └── page.tsx               # Página dinámica de canal individual
└── globals.css                # Estilos personalizados añadidos
```

## Dependencias Instaladas
- `hls.js`: Para reproducción HLS en navegadores no-Safari
- `@types/hls.js`: Tipos TypeScript para HLS.js

## Comentarios de Desarrollo
- Implementado con Cursor
- Código optimizado para métricas y personalización futura
- Estructura preparada para expansión de funcionalidade