'use client';

import { useAuth } from './useAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalFollowing: number;
  recentActivity: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalFollowing: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h1 className="text-2xl font-bold text-primary mb-2">
          ¡Bienvenido, {user?.email?.split('@')[0] || 'Viewer'}!
        </h1>
        <p className="text-muted">
          Aquí puedes gestionar tu perfil y ver los canales que sigues.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border-primary">
          <div className="flex items-center">
            <div className="p-3 bg-[#2c73ff] bg-opacity-10 rounded-lg">
              <svg className="w-6 h-6 text-[#2c73ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Canales Seguidos</p>
              <p className="text-2xl font-bold text-primary">{stats.totalFollowing}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border-primary">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Actividad Reciente</p>
              <p className="text-2xl font-bold text-primary">{stats.recentActivity}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border-primary">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 bg-opacity-10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Miembro desde</p>
              <p className="text-2xl font-bold text-primary">2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h2 className="text-lg font-semibold text-primary mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/profile"
            className="flex items-center p-4 bg-button hover:bg-button-active rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="font-medium text-primary">Editar Perfil</p>
              <p className="text-sm text-muted">Actualiza tu información personal</p>
            </div>
          </Link>

          <Link
            href="/dashboard/following"
            className="flex items-center p-4 bg-button hover:bg-button-active rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <div>
              <p className="font-medium text-primary">Ver Canales Seguidos</p>
              <p className="text-sm text-muted">Gestiona tus canales favoritos</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
