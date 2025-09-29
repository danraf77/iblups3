'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface UserSession {
  id: string;
  session_token: string;
  created_at: string;
  last_activity_at: string;
  expires_at: string;
  is_active: boolean;
  device_info: {
    userAgent: string;
    platform: string;
  } | null;
  ip_address: string | null;
}

interface SessionStats {
  total: number;
  active: number;
}

export default function SessionsPage() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [stats, setStats] = useState<SessionStats>({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/dashboard/sessions');
        if (response.ok) {
          const data = await response.json();
          setSessions(data.sessions);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBrowserInfo = (deviceInfo: UserSession['device_info']) => {
    if (!deviceInfo?.userAgent) return t('sessions.unknown');
    
    const userAgent = deviceInfo.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return t('sessions.unknown');
  };

  const getDeviceInfo = (deviceInfo: UserSession['device_info']) => {
    if (!deviceInfo?.userAgent) return t('sessions.unknown');
    
    const userAgent = deviceInfo.userAgent;
    if (userAgent.includes('Mobile')) return t('sessions.mobile');
    if (userAgent.includes('Tablet')) return t('sessions.tablet');
    return t('sessions.desktop');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">{t('sessions.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('sessions.title')}</h1>
          <p className="text-muted">
            {t('sessions.description')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border-primary">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted">{t('sessions.activeSessions')}</p>
              <p className="text-2xl font-bold text-primary">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border-primary">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-muted">{t('sessions.totalSessions')}</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-card rounded-lg p-12 border border-border-primary text-center">
          <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-lg font-semibold text-primary mb-2">{t('sessions.noSessions')}</h3>
          <p className="text-muted">
            {t('sessions.noSessionsDescription')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-card rounded-lg border border-border-primary p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${session.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <h3 className="font-semibold text-primary">
                      {session.is_active ? t('sessions.activeSession') : t('sessions.closedSession')}
                    </h3>
                    <p className="text-sm text-muted">
                      {getBrowserInfo(session.device_info)} • {getDeviceInfo(session.device_info)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">
                    {session.ip_address || t('sessions.ipNotAvailable')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted mb-1">{t('sessions.created')}</p>
                  <p className="text-primary">{formatDate(session.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted mb-1">{t('sessions.lastActivity')}</p>
                  <p className="text-primary">{formatDate(session.last_activity_at)}</p>
                </div>
                <div>
                  <p className="text-muted mb-1">{t('sessions.expires')}</p>
                  <p className="text-primary">{formatDate(session.expires_at)}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
