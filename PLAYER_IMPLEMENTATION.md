# Player HLS Implementation

## Resumen

Se ha implementado un player HLS moderno usando **Video.js** como UI/UX y **hls.js** como motor de reproducción, con fallback a HLS nativo en Safari/iOS.

## Arquitectura

### Componentes Principales

1. **`/app/embed/[canal]/page.tsx`** - Página de embed que maneja query parameters
2. **`/app/components/VideojsHls.tsx`** - Componente principal del player (Client Component)
3. **`/app/utils/getHlsUrl.ts`** - Utilidades para obtener URL HLS respetando cifrado
4. **`/app/styles/player.css`** - Estilos centralizados del player

### Flujo de Cifrado

- El `streamId` se mantiene encriptado usando las funciones existentes en `utils/encryption.ts`
- La URL HLS se genera server-side para mantener la seguridad
- No se expone información sensible en el cliente

## Uso

### URL de Embed

```
/embed/[canal]?autoplay=true&muted=true&controls=true&poster=https://example.com/poster.jpg
```

### Query Parameters

- `autoplay` (boolean, default: true) - Iniciar reproducción automáticamente
- `muted` (boolean, default: true) - Reproducir sin sonido por defecto
- `controls` (boolean, default: true) - Mostrar controles del player
- `poster` (string, optional) - URL de imagen poster

### Ejemplo de Uso en iframe

```html
<iframe 
  src="https://tu-dominio.com/embed/canal123?autoplay=true&muted=true&controls=true"
  width="1280" 
  height="720"
  frameborder="0"
  allow="autoplay; fullscreen"
  allowfullscreen>
</iframe>
```

## Personalización

### Variables CSS

Todas las personalizaciones se realizan en `/app/styles/player.css`:

```css
:root {
  --player-primary-color: #00d4ff;      /* Color principal */
  --player-secondary-color: #ffffff;    /* Color secundario */
  --player-background-color: #000000;   /* Fondo */
  --player-live-color: #ff4444;         /* Color LIVE */
  --player-loading-color: #00d4ff;      /* Color de carga */
  --player-error-color: #ff6b6b;        /* Color de error */
}
```

### Características del Player

- **Responsive**: Adaptable a cualquier tamaño de pantalla
- **Accesible**: Soporte completo para navegación por teclado
- **Moderno**: UI limpia y profesional
- **Robusto**: Manejo de errores y estados de carga
- **Compatible**: Funciona en todos los navegadores modernos

## Compatibilidad

- **Chrome/Firefox/Edge**: Video.js + hls.js
- **Safari/iOS**: HLS nativo
- **Fallback**: Mensaje de error elegante para navegadores no compatibles

## Dependencias

```json
{
  "video.js": "^8.x.x",
  "hls.js": "^1.6.12",
  "@types/video.js": "^8.x.x"
}
```

## Notas Técnicas

- El player se inicializa solo en el cliente (Client Component)
- Video.js se usa únicamente como capa de UI
- hls.js maneja la reproducción HLS (desactivando VHS de Video.js)
- El cifrado del streamId se mantiene íntegro
- Optimizado para uso en iframe con autoplay policies

## Comentario

Implementación realizada con Cursor - Player HLS moderno con Video.js y hls.js, manteniendo la integridad del cifrado existente y optimizado para embed/iframe.
