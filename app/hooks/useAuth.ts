'use client';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  is_verified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Asegurar que se envíen las cookies
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        setUser(data.user);
        console.log('Usuario autenticado:', data.user.email);
      } else {
        setUser(null);
        console.log('Usuario no autenticado o sesión expirada');
        
        // Si estamos en el dashboard y no hay sesión, limpiar cualquier estado local
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          console.log('Redirigiendo desde dashboard por falta de sesión');
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      
      // Si hay error y estamos en dashboard, redirigir
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
        console.log('Error de autenticación, redirigiendo desde dashboard');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    // Verificar autenticación después de un breve delay para asegurar persistencia
    setTimeout(() => {
      checkAuth();
    }, 500);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setUser(null);
      // Limpiar cualquier estado local
      if (typeof window !== 'undefined') {
        // Forzar recarga para limpiar completamente el estado
        window.location.href = '/';
      }
    }
  };

  // Función para renovar sesión manualmente
  const renewSession = async () => {
    try {
      const response = await fetch('/api/auth/renew-session', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('Sesión renovada correctamente');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error renovando sesión:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    renewSession,
    checkAuth,
    isAuthenticated: !!user
  };
}

// Comentario: Hook de autenticación creado con Cursor
// - Maneja estado del usuario
// - Verifica autenticación al cargar
// - Proporciona métodos de login/logout
// - Estado de carga para UX
