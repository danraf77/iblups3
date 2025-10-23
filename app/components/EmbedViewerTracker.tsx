'use client';

import { useViewerTracker } from '../hooks/useViewerTracker';

interface EmbedViewerTrackerProps {
  username: string;
}

export function EmbedViewerTracker({ username }: EmbedViewerTrackerProps) {
  useViewerTracker({
    channelId: username,
    enabled: true
  });

  return null;
}
