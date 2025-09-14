// Mapeo de canales para URLs de embed
// Comentario: Sistema de mapeo de canales creado con Cursor

export interface ChannelMapping {
  id: string;
  name: string;
  hlsUrl: string;
  description?: string;
  thumbnail?: string;
}

export const channelMappings: Record<string, ChannelMapping> = {
  'dantecanal': {
    id: 'dantecanal',
    name: 'Dante Canal',
    hlsUrl: 'https://cdnhd.iblups.com/hls/777b4d4cc0984575a7d14f6ee57dbcaf.m3u8',
    description: 'Canal de Dante - Stream en vivo',
    thumbnail: 'https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_blue.svg'
  },
  // Agregar más canales aquí según sea necesario
  'canal2': {
    id: 'canal2',
    name: 'Canal 2',
    hlsUrl: 'https://ejemplo.com/stream2.m3u8',
    description: 'Segundo canal de ejemplo'
  }
};

export function getChannelById(channelId: string): ChannelMapping | null {
  return channelMappings[channelId] || null;
}

export function getAllChannels(): ChannelMapping[] {
  return Object.values(channelMappings);
}

// Mapeo de IDs de canales de la API a nombres de URL
export const channelIdToUrlMapping: Record<string, string> = {
  '1': 'globalnews',
  '2': 'sportscentral', 
  '3': 'techtoday',
  '4': 'musiclive',
  '5': 'financefocus',
  '6': 'naturewild',
  '7': 'citypulse',
  '8': 'gamingarena',
  '9': 'cookingmasters',
  '10': 'artculture',
  '11': 'travelexplorer',
  '12': 'comedycentral',
  '13': 'healthwellness',
  '14': 'educationhub',
  '15': 'fashionweek',
  '16': 'autoracing',
  '17': 'sciencechannel',
  '18': 'homegarden',
  '19': 'musicclassics',
  '20': 'news247',
  '21': 'sportshighlights',
  '22': 'techreviews',
  '23': 'moviechannel',
  '24': 'kidsworld',
  // Canales especiales
  'dantecanal': 'dantecanal'
};

export function getChannelUrlById(channelId: string): string | null {
  return channelIdToUrlMapping[channelId] || null;
}
