'use client';

import Player from '../../components/Player';

// Componente cliente wrapper para el Player
// Modificado por Cursor: componente cliente separado para evitar problemas con dynamic en Server Components
interface EmbedPlayerProps {
  streamUrl: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  fluid?: boolean;
  liveui?: boolean;
  responsive?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  playsinline?: boolean;
  volume?: number;
  className?: string;
}

export default function EmbedPlayer(props: EmbedPlayerProps) {
  return <Player {...props} />;
}

