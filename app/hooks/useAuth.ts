'use client';

import { useState, useEffect } from 'react';
import { jwtVerify } from 'jose';

interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData.user,
          loading: false,
          isAuthenticated: true
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false
      });
    }
  };

  const login = (user: User) => {
    setAuthState({
      user,
      loading: false,
      isAuthenticated: true
    });
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false
      });
    }
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth
  };
}

// Comentario: Hook de autenticación creado con Cursor
// Maneja estado de usuario, sesiones y operaciones de login/logout
