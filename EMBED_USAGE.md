# Uso de la Página de Embed

## Descripción
Se ha creado una página dinámica para reproducir streams HLS en formato embed con proporción 16:9 fija.

## URLs de Acceso

### Página de Canal Individual
```
/[CANAL_ID]
```

### Página de Embed
```
/embed/[CANAL_ID]
```

## Ejemplo de Uso

### Página completa del canal (con navbar):
```
http://localhost:3000/dantecanal
```

### Solo el player (embed):
```
http://localhost:3000/embed/dantecanal
```

## Canales Disponibles
- `dantecanal` - Canal de Dante
- `canal2` - Canal 2 (ejemplo)

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

### ✅ Página de Canal Individual
- Navbar idéntico al de la página inicial
- Información del canal (nombre, descripción)
- Player embed como iframe con proporción 16:9
- Botones de acción (Seguir, Compartir)
- Indicador de estado "En vivo"

## Estructura de Archivos Creados

```
app/
├── components/
│   └── HLSPlayer.tsx          # Componente principal del player
├── data/
│   └── channelMapping.ts      # Mapeo de canales y URLs HLS
├── embed/
│   └── [url]/
│       └── page.tsx           # Página dinámica de embed
├── [canal]/
│   └── page.tsx               # Página dinámica de canal individual
└── globals.css                # Estilos personalizados añadidos
```

## Dependencias Instaladas
- `hls.js`: Para reproducción HLS en navegadores no-Safari
- `@types/hls.js`: Tipos TypeScript para HLS.js

## Comentarios de Desarrollo
- Implementado con Cursor
- Código optimizado para métricas y personalización futura
- Estructura preparada para expansión de funcionalidades
