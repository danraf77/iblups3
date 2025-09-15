'use client';
import { useState } from 'react';
import { getChannelUrlById, generateChannelUrl } from '../data/channelMapping';
import { useTranslation } from '../hooks/useTranslation';
import ClientOnly from './ClientOnly';

interface Channel {
  id: string;
  name: string;
  username: string;
  stream_id?: string;
  is_on_live: boolean;
  icon?: string;
  cover?: string;
  category?: {
    name: string;
  };
  viewer_count?: number;
  is_4k?: boolean;
}

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const { t } = useTranslation();
  const fallbackImage = "https://iblups.sfo3.cdn.digitaloceanspaces.com/app/brand/iblups_placeholder_player_channel.png";
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    // Generar URL del canal basada en stream_id o name
    const channelUrl = generateChannelUrl(channel);
    
    // Abrir canal en nueva pestaña
    window.open(`/${channelUrl}`, '_blank');
  };

  // Generate URL with timestamp to avoid cache
  const timestamp = new Date().getTime();
  const imageSrc = channel.cover ? `${channel.cover}?p=${timestamp}` : fallbackImage;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    img.src = fallbackImage;
    setImageLoaded(true);
  };

  return (
    <div 
      className="bg-card rounded-lg overflow-hidden hover:bg-card-active transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105"
      onClick={handleCardClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-black">
        <img
          src={imageSrc}
          alt={channel.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Live Badge */}
        {channel.is_on_live && (
          <div className="absolute top-2 left-2">
            <ClientOnly fallback={<span className="badge-live text-xs font-bold px-2 py-1 rounded">LIVE</span>}>
              <span className="badge-live text-xs font-bold px-2 py-1 rounded">
                {t('channels.live')}
              </span>
            </ClientOnly>
          </div>
        )}
        
        
      </div>
      
      {/* Channel Info */}
      <div className="p-4">
        <h3 className="text-primary font-semibold text-sm line-clamp-1">
          {channel.name}
        </h3>
      </div>
    </div>
  );
}