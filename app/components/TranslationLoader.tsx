'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslationLoaderProps {
  children: React.ReactNode;
}

export default function TranslationLoader({ children }: TranslationLoaderProps) {
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => {
        setIsReady(true);
      });
    }
  }, [i18n]);

  if (!isReady) {
    return (
      <div className="bg-primary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">Loading translations...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
