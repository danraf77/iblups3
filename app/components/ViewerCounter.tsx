'use client';

import { useViewerCount } from '../hooks/useViewerCount';

interface ViewerCounterProps {
  channelId: string;
  className?: string;
}

export function ViewerCounter({ 
  channelId,
  className = '' 
}: ViewerCounterProps) {
  const { viewerCount, isConnected } = useViewerCount({
    channelId,
    enabled: true
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg ${className}`}>
      <span className={`w-1.5 h-1.5 bg-white rounded-full ${isConnected ? 'animate-pulse' : 'opacity-50'}`} />
      <svg 
        className="w-4 h-4 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      </svg>
      <span className="text-sm font-medium text-white">
        {formatNumber(viewerCount)}
      </span>
    </div>
  );
}
