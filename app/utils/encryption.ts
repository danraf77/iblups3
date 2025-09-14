import { createHmac } from "crypto";

const SECRET = "claveultrasecreta123";

export function encryptStreamId(streamId: string): string {
  const hmac = createHmac("sha1", SECRET);
  hmac.update(streamId);
  return hmac.digest("hex");
}

export function generateHlsUrl(publicId: string): string {
  return `https://live-stream.iblups.com/video/${publicId}.m3u8`;
}

export function generateEncryptedHlsUrl(streamId: string): string {
  const encryptedId = encryptStreamId(streamId);
  return generateHlsUrl(encryptedId);
}

// Comentario: Funciones de encriptación creadas con Cursor
// - Encriptación HMAC SHA1 para stream_id
// - Generación de URLs HLS encriptadas
// - Compatible con la lógica de Nuxt3
