export const getVideoJsConfig = (autoplay: boolean, muted: boolean, poster?: string) => {
  return {
    controls: true,
    autoplay: autoplay ? 'muted' : false,
    muted,
    poster,
    fluid: true,
    responsive: true,
    playsinline: true,
    preload: 'auto', // Cargar video automáticamente para mejor UX
    // Configuración para HLS live streaming
    html5: {
      vhs: {
        overrideNative: false, // Usar HLS nativo cuando esté disponible
        enableLowInitialPlaylist: true, // Mejorar tiempo de carga inicial
        smoothQualityChange: true, // Transiciones suaves de calidad
        allowSeeksWithinUnsafeLiveWindow: true // Permitir seeks en ventana de live
      }
    },
    // Configuración de controlBar personalizada para live streaming
    controlBar: {
      playToggle: true,
      volumePanel: {
        inline: false
      },
      currentTimeDisplay: true,
      timeDivider: true,
      durationDisplay: false, // No mostrar duración en live streams
      progressControl: false, // Desactivar barra de progreso para live
      liveDisplay: true, // Mostrar indicador de live
      remainingTimeDisplay: false, // No mostrar tiempo restante en live
      customControlSpacer: true,
      fullscreenToggle: true,
      pictureInPictureToggle: false,
      playbackRateMenuButton: false // Desactivar para live streams
    },
    // Configuración para mostrar controles solo en hover
    userActions: {
      hotkeys: true
    },
    // Configuración para ocultar controles automáticamente
    inactivityTimeout: 2000, // Ocultar controles después de 2 segundos de inactividad
    userInactive: true, // Habilitar modo usuario inactivo
    // Configuración del botón de play personalizado
    bigPlayButton: {
      inline: false,
      position: 'center'
    },
    // Configuraciones adicionales para live streaming
    liveui: true, // Habilitar UI específica para live streams
    liveTolerance: 15, // Tolerancia para detectar live streams (segundos)
    liveTracker: {
      trackingThreshold: 20, // Umbral para tracking de live
      liveTolerance: 15 // Tolerancia para live
    }
  };
};
