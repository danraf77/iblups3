'use client';
import { useState } from 'react';
import { getChannelUrlById, generateChannelUrl } from '../data/channelMapping';

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
            <span className="badge-live text-xs font-bold px-2 py-1 rounded">
              LIVE
            </span>
          </div>
        )}
        
        {/* New Tab Indicator */}
        <div className="absolute top-2 right-2">
          <div className="bg-black bg-opacity-60 rounded-full p-1">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
        
      </div>
      
      {/* Channel Info */}
      <div className="p-4">
        <h3 className="text-primary font-semibold text-sm mb-1 line-clamp-1">
          {channel.name}
        </h3>
        {channel.category && (
          <p className="text-muted text-xs line-clamp-1">
            {channel.category.name}
          </p>
        )}
      </div>
    </div>
  );
}