'use client';
import React, { useState, useEffect } from 'react';

// Forzar renderizado dinámico - Cursor
export const dynamic = 'force-dynamic';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, User, Mail, MapPin, Calendar, Settings, LogOut, ArrowLeft, Menu, X, Monitor, Smartphone, Globe, Clock, Shield } from 'lucide-react';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/footer.css';

interface ChannelFollow {
  id: string;
  channel_id: string;
  channel_username: string;
  channel_name: string;
  followed_at: string;
  notifications_enabled: boolean;
}

interface UserSession {
  id: string;
  session_token: string;
  device: string;
  browser: string;
  country: string;
  ip_address: string;
  is_active: boolean;
  created_at: string;
  last_activity_at: string;
  expires_at: string;
  is_current: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  is_verified: boolean;
  profile?: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    country?: string;
    city?: string;
    timezone?: string;
    language_preference?: string;
  };
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading, logout, renewSession } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followedChannels, setFollowedChannels] = useState<ChannelFollow[]>([]);
  const [countries, setCountries] = useState<Array<{id: number, name: string, slug: string}>>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    city: '',
    date_of_birth: ''
  });

  useEffect(() => {
    // Solo cargar datos si está autenticado (ProtectedRoute maneja la verificación)
    if (isAuthenticated && !loading) {
      loadUserData();
    }
  }, [isAuthenticated, loading]);

  // Renovar sesión automáticamente cada 5 minutos
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const renewed = await renewSession();
      if (renewed) {
        console.log('Sesión renovada automáticamente');
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated, renewSession]);

  const loadUserData = async (showLoading = false) => {
    if (showLoading) {
      setLoadingData(true);
    }
    
    try {
      // Cargar todos los datos en paralelo para mejor rendimiento
      const [profileResponse, channelsResponse, countriesResponse, sessionsResponse] = await Promise.all([
        fetch('/api/dashboard/profile'),
        fetch('/api/dashboard/followed-channels'),
        fetch('/api/dashboard/countries'),
        fetch('/api/dashboard/sessions')
      ]);

      // Procesar respuestas en paralelo
      const [profileData, channelsData, countriesData, sessionsData] = await Promise.all([
        profileResponse.json(),
        channelsResponse.json(),
        countriesResponse.json(),
        sessionsResponse.json()
      ]);

      // Actualizar estados
      setProfile(profileData);
      setFollowedChannels(channelsData);
      setCountries(countriesData);
      setSessions(sessionsData.sessions);

      // Inicializar datos del formulario después de cargar el perfil
      if (profileData?.profile) {
        setFormData({
          first_name: profileData.profile.first_name || '',
          last_name: profileData.profile.last_name || '',
          country: profileData.profile.country || '',
          city: profileData.profile.city || '',
          date_of_birth: profileData.profile.date_of_birth || ''
        });
      } else {
        // Si no hay perfil, inicializar con valores por defecto
        setFormData({
          first_name: '',
          last_name: '',
          country: '',
          city: '',
          date_of_birth: ''
        });
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error cargando datos del dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleUnfollowChannel = async (channelId: string) => {
    try {
      const response = await fetch(`/api/channels/follow?channelId=${channelId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFollowedChannels(prev => prev.filter(ch => ch.channel_id !== channelId));
      }
    } catch (error) {
      console.error('Error dejando de seguir canal:', error);
    }
  };

  const handleCloseSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/dashboard/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
      } else {
        const data = await response.json();
        setError(data.error || 'Error cerrando sesión');
      }
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      setError('Error cerrando sesión');
    }
  };

  // Función para cargar datos específicos de cada sección
  const loadSectionData = async (section: 'profile' | 'channels' | 'sessions') => {
    try {
      switch (section) {
        case 'profile':
          setLoadingProfile(true);
          const profileResponse = await fetch('/api/dashboard/profile');
          const profileData = await profileResponse.json();
          setProfile(profileData);
          break;
        case 'channels':
          setLoadingChannels(true);
          const channelsResponse = await fetch('/api/dashboard/followed-channels');
          const channelsData = await channelsResponse.json();
          setFollowedChannels(channelsData);
          break;
        case 'sessions':
          setLoadingSessions(true);
          const sessionsResponse = await fetch('/api/dashboard/sessions');
          const sessionsData = await sessionsResponse.json();
          setSessions(sessionsData.sessions);
          break;
      }
    } catch (error) {
      console.error(`Error cargando ${section}:`, error);
      setError(`Error cargando ${section}`);
    } finally {
      switch (section) {
        case 'profile':
          setLoadingProfile(false);
          break;
        case 'channels':
          setLoadingChannels(false);
          break;
        case 'sessions':
          setLoadingSessions(false);
          break;
      }
    }
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setError(null);
    // Restaurar datos originales
    if (profile?.profile) {
      setFormData({
        first_name: profile.profile.first_name || '',
        last_name: profile.profile.last_name || '',
        country: profile.profile.country || '',
        city: profile.profile.city || '',
        date_of_birth: profile.profile.date_of_birth || ''
      });
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    try {
      // Limpiar datos antes de enviar
      const cleanFormData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        date_of_birth: formData.date_of_birth.trim() || null
      };

      console.log('Enviando datos limpios:', cleanFormData);

      const response = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        setError('Error procesando respuesta del servidor');
        return;
      }
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response data:', data);
      console.log('Response data type:', typeof data);
      console.log('Response data keys:', data ? Object.keys(data) : 'No keys');

      if (response.ok) {
        if (data && data.id) {
          setProfile(data);
          setEditing(false);
        } else {
          setError('Respuesta inválida del servidor');
          console.error('Respuesta inválida:', data);
        }
      } else {
        // Manejar diferentes tipos de errores
        let errorMessage = 'Error actualizando perfil';
        
        if (response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        } else if (data && data.error) {
          errorMessage = data.error;
        } else if (data && data.details) {
          errorMessage = data.details;
        } else if (data && data.message) {
          errorMessage = data.message;
        }
        
        setError(errorMessage);
        console.error('Error actualizando perfil:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          formData: formData
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de red al guardar perfil';
      setError(errorMessage);
      console.error('Error guardando perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mostrar pantalla de carga mientras se cargan los datos del usuario
  if (loadingData) {
    return (
      <div className="bg-primary min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary">{t('messages.info.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

          const menuItems = [
            { id: 'profile', label: t('dashboard.profile.title'), icon: User },
            { id: 'email', label: t('dashboard.email.title'), icon: Mail },
            { id: 'channels', label: t('dashboard.channels.title'), icon: Heart },
            { id: 'sessions', label: t('sessions.title'), icon: Shield }
          ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <User className="w-6 h-6 mr-2" />
                {t('dashboard.profile.title')}
              </h2>
              {!editing ? (
                        <button
                          onClick={handleEditProfile}
                          className="bg-button text-button px-4 py-2 rounded-lg hover:bg-button-active transition-colors flex items-center"
                        >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('dashboard.profile.edit')}
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-primary px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    {t('dashboard.profile.cancel')}
                  </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="bg-button text-button px-4 py-2 rounded-lg hover:bg-button-active transition-colors disabled:opacity-50"
                          >
                    {saving ? t('dashboard.profile.saving') : t('dashboard.profile.save')}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('dashboard.profile.fields.firstName')}
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-button"
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('dashboard.profile.fields.lastName')}
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-button"
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('dashboard.profile.fields.country')}
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-button"
                  disabled={!editing}
                >
                  <option value="">{t('dashboard.profile.fields.selectCountry')}</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('dashboard.profile.fields.city')}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-button"
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('dashboard.profile.fields.dateOfBirth')}
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-button"
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <Mail className="w-6 h-6 mr-2" />
              {t('dashboard.email.title')}
            </h2>
            
            {successMessage && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200 text-sm">{successMessage}</p>
              </div>
            )}

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                {t('dashboard.email.warning')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('dashboard.email.currentEmail')}
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                readOnly
              />
            </div>

                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="bg-button text-button px-6 py-3 rounded-lg hover:bg-button-active transition-colors flex items-center"
                    >
              <Mail className="w-5 h-5 mr-2" />
              {t('dashboard.email.title')}
            </button>
          </div>
        );

      case 'channels':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                {t('dashboard.channels.title')} ({followedChannels.length})
              </h2>
              <button
                onClick={() => loadSectionData('channels')}
                disabled={loadingChannels}
                className="text-gray-400 hover:text-primary transition-colors p-2 rounded hover:bg-gray-700"
                title="Recargar canales"
              >
                <svg className={`w-4 h-4 ${loadingChannels ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {loadingChannels ? (
              <div className="text-center py-12">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-400">{t('messages.info.loading')}</p>
              </div>
            ) : followedChannels.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">{t('messages.info.noChannels')}</p>
                <p className="text-gray-500 text-sm">
                  {t('messages.info.visitChannels')}
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 bg-button text-button px-6 py-3 rounded-lg hover:bg-button-active transition-colors"
                >
                  {t('messages.info.exploreChannels')}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {followedChannels.map((channel) => (
                  <div 
                    key={channel.id} 
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-button rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">
                            {channel.channel_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-primary font-medium truncate">{channel.channel_name}</h3>
                          <p className="text-gray-400 text-sm truncate">@{channel.channel_username}</p>
                          <p className="text-gray-500 text-xs">
                            {t('dashboard.channels.followedOn')} {new Date(channel.followed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/${channel.channel_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-button text-button px-4 py-2 rounded text-sm hover:bg-button-active transition-colors flex items-center space-x-1"
                        >
                          <span>{t('dashboard.channels.actions.viewChannel')}</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        
                        <button
                          onClick={() => handleUnfollowChannel(channel.channel_id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 rounded hover:bg-red-900/20"
                          title="Dejar de seguir"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

              case 'sessions':
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary flex items-center">
                        <Shield className="w-6 h-6 mr-2" />
                        {t('sessions.title')} ({sessions.length})
                      </h2>
                      <button
                        onClick={() => loadSectionData('sessions')}
                        disabled={loadingSessions}
                        className="text-gray-400 hover:text-primary transition-colors p-2 rounded hover:bg-gray-700"
                        title="Recargar sesiones"
                      >
                        <svg className={`w-4 h-4 ${loadingSessions ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <p className="text-yellow-200 text-sm">
                        {t('sessions.description')}
                      </p>
                    </div>

                    {loadingSessions ? (
                      <div className="text-center py-12">
                        <div className="loading-spinner mx-auto mb-4"></div>
                        <p className="text-gray-400">{t('messages.info.loading')}</p>
                      </div>
                    ) : sessions.length === 0 ? (
                      <div className="text-center py-12">
                        <Shield className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">No hay sesiones registradas</p>
                        <p className="text-gray-500 text-sm">
                          Las sesiones aparecerán aquí cuando inicies sesión desde diferentes dispositivos
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <div 
                            key={session.id} 
                            className={`bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors ${
                              session.is_current ? 'ring-2 ring-button' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  session.is_current ? 'bg-button' : 'bg-gray-600'
                                }`}>
                                  {session.device.toLowerCase().includes('mobile') || 
                                   session.device.toLowerCase().includes('android') || 
                                   session.device.toLowerCase().includes('ios') ? (
                                    <Smartphone className="w-6 h-6 text-white" />
                                  ) : (
                                    <Monitor className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-primary font-medium">
                                      {session.device} - {session.browser}
                                    </h3>
                                    {session.is_current && (
                                      <span className="bg-button text-button px-2 py-1 rounded text-xs font-medium">
                                        {t('sessions.current')}
                                      </span>
                                    )}
                                    {session.is_active && !session.is_current && (
                                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        Activa
                                      </span>
                                    )}
                                    {!session.is_active && (
                                      <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        {t('sessions.inactive')}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-400 text-sm">
                                    {session.session_token}
                                  </p>
                                </div>
                              </div>
                              
                              {!session.is_current && session.is_active && (
                                <button
                                  onClick={() => handleCloseSession(session.id)}
                                  className="text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded text-sm"
                                  title="Cerrar sesión"
                                >
                                  Cerrar
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{t('sessions.country')}:</span>
                                <span className="text-primary">{session.country}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Monitor className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">IP:</span>
                                <span className="text-primary font-mono text-xs">{session.ip_address}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{t('sessions.created')}:</span>
                                <span className="text-primary">
                                  {new Date(session.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300">{t('sessions.lastActivity')}:</span>
                                <span className="text-primary">
                                  {new Date(session.last_activity_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            {session.is_active && (
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span>{t('sessions.expires')}: {new Date(session.expires_at).toLocaleDateString()}</span>
                                  <span>
                                    {Math.ceil((new Date(session.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {t('sessions.daysRemaining')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );

              default:
                return null;
            }
          };

  return (
    <ProtectedRoute>
      <div className="bg-primary min-h-screen">
        {/* Header */}
        <header className="bg-secondary border-b border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-primary hover:text-white transition-colors"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-5 h-5 text-primary" />
                  <span className="text-primary">{t('navigation.back')}</span>
                </Link>
                
                <Link href="/">
                  <Image 
                    src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                    alt="iblups" 
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-primary hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">{t('sessions.close')}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex flex-col h-full pt-16 lg:pt-0">
              <div className="flex-1 px-4 py-6">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                          // Limpiar mensajes al cambiar de pestaña
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-button text-primary'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Overlay para móvil */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 lg:ml-0">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-4xl">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>

        {/* Modal para cambiar email */}
        <AuthModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSuccess={async (user) => {
            setShowEmailModal(false);
            // Recargar datos del perfil para mostrar el nuevo email
            await loadUserData(true);
            // Mostrar mensaje de éxito
            setSuccessMessage('Email actualizado correctamente');
            setError(null);
            // Limpiar mensaje después de 5 segundos
            setTimeout(() => setSuccessMessage(null), 5000);
          }}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

// Comentario: Dashboard del viewer creado con Cursor
// - Perfil completo del usuario
// - Lista de canales seguidos
// - Información de país y fecha de nacimiento
// - Funcionalidad de dejar de seguir canales
// - Diseño responsive y moderno
