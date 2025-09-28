'use client';

import { useAuth } from '../useAuth';
import { useState, useEffect } from 'react';
import CountrySelect from '../../components/CountrySelect';
import '../../styles/profile.css';

interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // Campos adicionales de iblups_profile_viewers - Cursor
  first_name?: string;
  last_name?: string;
  date_of_birth?: string; // Corregido de birth_date a date_of_birth
  city?: string;
  country_id?: number;
  country_name?: string;
}

interface Country {
  id: number;
  name: string;
}

export default function ProfilePage() {
  const { } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar perfil y países en paralelo - Cursor
        const [profileResponse, countriesResponse] = await Promise.all([
          fetch('/api/dashboard/profile'),
          fetch('/api/dashboard/countries')
        ]);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.profile);
        }

        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json();
          setCountries(countriesData.countries || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      
      // Debug: Log datos del formulario - Cursor
      const formDataObj = {
        display_name: formData.get('display_name'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        date_of_birth: formData.get('date_of_birth'),
        city: formData.get('city'),
        country_name: profile?.country_name || '',
      };
      
      console.log('Datos del formulario:', formDataObj);
      console.log('Profile state:', profile);
      
      const response = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success data:', data);
        setProfile(data.profile);
        setMessage('Perfil actualizado correctamente');
      } else {
        const data = await response.json();
        console.error('Error response:', data);
        setMessage(data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-primary">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#2c73ff] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {profile?.display_name || 'Mi Perfil'}
            </h1>
            <p className="text-muted">{profile?.email}</p>
            <p className="text-sm text-muted">
              Miembro desde {new Date(profile?.created_at || '').toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h2 className="text-lg font-semibold text-primary mb-4">Información Personal</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('correctamente') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-primary mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                defaultValue={profile?.first_name || ''}
                placeholder="Tu nombre"
                className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-primary mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                defaultValue={profile?.last_name || ''}
                placeholder="Tu apellido"
                className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-primary mb-1">
              Nombre para mostrar
            </label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              defaultValue={profile?.display_name || ''}
              placeholder="Tu nombre público"
              className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-primary mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              defaultValue={profile?.date_of_birth || ''}
              className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent"
              style={{
                colorScheme: 'dark',
                backgroundColor: '#1a1a1a',
                color: '#ffffff'
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-primary mb-1">
                Ciudad
              </label>
              <input
                type="text"
                id="city"
                name="city"
                defaultValue={profile?.city || ''}
                placeholder="Tu ciudad"
                className="w-full px-3 py-2 bg-input text-primary rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:border-transparent"
              />
            </div>

            <div>
              <CountrySelect
                countries={countries}
                value={profile?.country_name || ''}
                onChange={(value) => {
                  // Actualizar el estado local del perfil cuando cambie el país
                  if (profile) {
                    setProfile({ ...profile, country_name: value });
                  }
                }}
                label="País"
                placeholder="Seleccionar país"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-muted hover:text-primary transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] focus:outline-none focus:ring-2 focus:ring-[#2c73ff] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-card rounded-lg p-6 border border-border-primary">
        <h2 className="text-lg font-semibold text-primary mb-4">Información de la Cuenta</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted">ID de Usuario:</span>
            <span className="text-primary font-mono text-sm">{profile?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Fecha de Creación:</span>
            <span className="text-primary">
              {new Date(profile?.created_at || '').toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Última Actualización:</span>
            <span className="text-primary">
              {new Date(profile?.updated_at || '').toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
