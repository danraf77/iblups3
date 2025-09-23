'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = (
    <div className="bg-primary min-h-screen">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">Verificando acceso...</p>
        </div>
      </div>
    </div>
  )
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir
    if (!loading && !isAuthenticated) {
      console.log('Acceso denegado: Usuario no autenticado');
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Mostrar fallback mientras se verifica la autenticación
  if (loading) {
    return <>{fallback}</>;
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return (
      <div className="bg-primary min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-primary">Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
};

export default ProtectedRoute;

// Comentario: Componente de protección de rutas creado con Cursor
// - Verifica autenticación antes de mostrar contenido
// - Redirige automáticamente si no hay sesión
// - Pantalla de carga personalizable
// - Manejo robusto de estados de autenticación
