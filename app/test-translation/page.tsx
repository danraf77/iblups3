'use client';

import { useTranslation } from '../hooks/useTranslation';

export default function TestTranslationPage() {
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Test de Traducciones
        </h1>
        
        <div className="bg-card p-6 rounded-lg border border-border-primary mb-4">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Información del Sistema
          </h2>
          <p className="text-muted mb-2">
            Idioma actual: <span className="text-primary font-mono">{currentLanguage}</span>
          </p>
          <p className="text-muted mb-2">
            i18n ready: <span className="text-primary font-mono">{typeof t === 'function' ? 'Sí' : 'No'}</span>
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border-primary mb-4">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Traducciones del Dashboard
          </h2>
          <div className="space-y-2">
            <p className="text-muted">
              dashboard.welcome: <span className="text-primary">{t('dashboard.welcome', { username: 'TestUser' })}</span>
            </p>
            <p className="text-muted">
              dashboard.description: <span className="text-primary">{t('dashboard.description')}</span>
            </p>
            <p className="text-muted">
              dashboard.sidebar.home: <span className="text-primary">{t('dashboard.sidebar.home')}</span>
            </p>
            <p className="text-muted">
              dashboard.sidebar.profile: <span className="text-primary">{t('dashboard.sidebar.profile')}</span>
            </p>
            <p className="text-muted">
              dashboard.sidebar.following: <span className="text-primary">{t('dashboard.sidebar.following')}</span>
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border-primary">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Traducciones de Navegación
          </h2>
          <div className="space-y-2">
            <p className="text-muted">
              navigation.home: <span className="text-primary">{t('navigation.home')}</span>
            </p>
            <p className="text-muted">
              navigation.producerAccess: <span className="text-primary">{t('navigation.producerAccess')}</span>
            </p>
            <p className="text-muted">
              navigation.viewerAccess: <span className="text-primary">{t('navigation.viewerAccess')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
