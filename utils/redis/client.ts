import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    '❌ Faltan variables de entorno de Upstash Redis.\n' +
    'Asegúrate de tener UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en .env.local'
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

if (process.env.NODE_ENV === 'development') {
  console.log('✅ Redis conectado correctamente');
}
