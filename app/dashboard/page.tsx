'use client';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { User, Mail, LogOut, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-primary">Cargando...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary">
        {/* Header simplificado */}
        <div className="bg-card border-b border-border-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t('navigation.back') || 'Volver'}
                </button>
                <h1 className="text-xl font-semibold text-primary">
                  {t('dashboard.title') || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-primary text-sm">
                  {t('auth.modal.buttons.hello') || 'Hola'}, {user?.display_name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('sessions.close') || 'Cerrar Sesión'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal simplificado */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Perfil del usuario */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border-primary p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-primary">
                      {t('dashboard.profile.title') || 'Mi Perfil'}
                    </h2>
                    <p className="text-muted">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      {t('dashboard.profile.displayName') || 'Nombre de usuario'}
                    </label>
                    <div className="text-muted">
                      {user?.display_name || 'No configurado'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      {t('dashboard.profile.email') || 'Email'}
                    </label>
                    <div className="text-muted">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      {t('dashboard.profile.verified') || 'Estado de verificación'}
                    </label>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user?.is_verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.is_verified 
                          ? (t('dashboard.profile.verified') || 'Verificado')
                          : (t('dashboard.profile.notVerified') || 'No verificado')
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border-primary p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  {t('dashboard.info.title') || 'Información'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted" />
                    <span className="text-sm text-muted">
                      {t('dashboard.info.emailVerified') || 'Email verificado'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-muted" />
                    <span className="text-sm text-muted">
                      {t('dashboard.info.accountActive') || 'Cuenta activa'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border-primary p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  {t('dashboard.actions.title') || 'Acciones'}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
                  >
                    {t('dashboard.actions.browseChannels') || 'Explorar canales'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    {t('sessions.close') || 'Cerrar Sesión'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
