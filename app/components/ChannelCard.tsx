'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Channel {
  id: string;
  name: string;
  username: string;
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
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://iblups.sfo3.cdn.digitaloceanspaces.com/app/brand/iblups_placeholder_player_channel.png";

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
      {/* Thumbnail Container */}
      <div className="relative aspect-video">
        <Image
          src={imageError || !channel.cover ? fallbackImage : channel.cover}
          alt={channel.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Live Badge */}
        {channel.is_on_live && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              VIVO
            </span>
          </div>
        )}
        
      </div>
      
      {/* Channel Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
          {channel.name}
        </h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
          {channel.category?.name || 'Sin categoría'}
        </p>
      </div>
    </div>
  );
}
