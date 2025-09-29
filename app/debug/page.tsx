'use client';

import { useTranslation } from '../hooks/useTranslation';
import { useChannels } from '../hooks/useChannels';

export default function DebugPage() {
  const { t, currentLanguage } = useTranslation();
  const { channels, loading, error } = useChannels({ page: 1, limit: 4 });

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Debug Page
        </h1>
        
        <div className="bg-card p-6 rounded-lg border border-border-primary mb-4">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Translation Status
          </h2>
          <p className="text-muted mb-2">
            Language: <span className="text-primary font-mono">{currentLanguage}</span>
          </p>
          <p className="text-muted mb-2">
            Translation function: <span className="text-primary font-mono">{typeof t}</span>
          </p>
          <p className="text-muted mb-2">
            Test translation: <span className="text-primary">{t('navigation.home')}</span>
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border-primary mb-4">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Channels Status
          </h2>
          <p className="text-muted mb-2">
            Loading: <span className="text-primary font-mono">{loading ? 'true' : 'false'}</span>
          </p>
          <p className="text-muted mb-2">
            Error: <span className="text-primary font-mono">{error || 'none'}</span>
          </p>
          <p className="text-muted mb-2">
            Channels count: <span className="text-primary font-mono">{channels.length}</span>
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border-primary">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Channels Data
          </h2>
          <pre className="text-xs text-muted overflow-auto max-h-64">
            {JSON.stringify(channels, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
