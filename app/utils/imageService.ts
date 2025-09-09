// Servicio para manejar imágenes de manera optimizada
class ImageService {
  private static instance: ImageService;
  private fallbackImage: string = "https://iblups.sfo3.cdn.digitaloceanspaces.com/app/brand/iblups_placeholder_player_channel.png";
  private preloadedImages: Set<string> = new Set();

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  // Pre-cargar imagen fallback
  preloadFallbackImage(): Promise<void> {
    return new Promise((resolve) => {
      if (this.preloadedImages.has(this.fallbackImage)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.preloadedImages.add(this.fallbackImage);
        resolve();
      };
      img.onerror = () => {
        console.warn('No se pudo pre-cargar la imagen fallback');
        resolve(); // Resolver de todas formas para no bloquear
      };
      img.src = this.fallbackImage;
    });
  }

  // Verificar si una imagen existe sin bloquear
  async checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000); // Timeout de 3 segundos

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      img.src = url;
    });
  }

  // Obtener URL de imagen optimizada
  getOptimizedImageUrl(streamId: string): string {
    if (!streamId) return this.fallbackImage;
    return `https://thumbnail.iblups.com/thumb/live/${streamId}.png`;
  }

  // Obtener imagen fallback
  getFallbackImage(): string {
    return this.fallbackImage;
  }
}

export const imageService = ImageService.getInstance();
