'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import ChannelCard from './components/ChannelCard';
import { sampleChannels } from './data/sampleChannels';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Channel {
  id: string;
  name: string;
  username: string;
  is_on_live: boolean;
  icon?: string;
  cover?: string;
  category?: {
    name: string;
  };
  viewer_count?: number;
  is_4k?: boolean;
}

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const channelsPerPage = 24; // 4 columnas x 6 filas

  useEffect(() => {
    fetchChannels();
  }, [currentPage, searchTerm, activeTab, fetchChannels]);

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      
      // Intentar obtener datos de Supabase
      let query = supabase
        .from('channels_channel')
        .select(`
          id,
          name,
          username,
          stream_id,
          is_on_live,
          icon,
          cover,
          category:channels_category(name)
        `)
        .eq('enabled_search', true);

      // Aplicar filtros según la pestaña activa
      if (activeTab === 'populares') {
        query = query.order('is_on_live', { ascending: false }).order('name');
      } else if (activeTab === 'recientes') {
        query = query.order('modified', { ascending: false });
      } else {
        query = query.order('is_on_live', { ascending: false }).order('name');
      }

      // Aplicar búsqueda si existe
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      // Aplicar paginación
      const from = (currentPage - 1) * channelsPerPage;
      const to = from + channelsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      let channelsData = [];
      let totalCount = 0;

      if (error || !data || data.length === 0) {
        // Usar datos de ejemplo si no hay datos de la base de datos
        console.log('Usando datos de ejemplo');
        
        // Filtrar datos de ejemplo según búsqueda
        let filteredChannels = sampleChannels;
        if (searchTerm) {
          filteredChannels = sampleChannels.filter(channel => 
            channel.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Ordenar según la pestaña activa
        if (activeTab === 'populares') {
          filteredChannels = [...filteredChannels].sort((a, b) => {
            if (a.is_on_live !== b.is_on_live) {
              return b.is_on_live ? 1 : -1;
            }
            return a.name.localeCompare(b.name);
          });
        } else if (activeTab === 'recientes') {
          // Para recientes, mantener el orden original
          filteredChannels = [...filteredChannels];
        } else {
          // Todos: ordenar por en vivo primero
          filteredChannels = [...filteredChannels].sort((a, b) => {
            if (a.is_on_live !== b.is_on_live) {
              return b.is_on_live ? 1 : -1;
            }
            return a.name.localeCompare(b.name);
          });
        }

        totalCount = filteredChannels.length;
        
        // Aplicar paginación
        const startIndex = (currentPage - 1) * channelsPerPage;
        const endIndex = startIndex + channelsPerPage;
        channelsData = filteredChannels.slice(startIndex, endIndex);
      } else {
        // Usar datos de la base de datos
        channelsData = data.map(channel => ({
          ...channel,
          name: channel.name.toLowerCase(), // Convertir nombres a minúsculas
          cover: channel.stream_id ? `https://thumbnail.iblups.com/thumb/live/${channel.stream_id}.png` : undefined
        }));
        totalCount = count || 0;
      }

      setChannels(channelsData);
      setTotalPages(Math.ceil(totalCount / channelsPerPage));
      
    } catch (error) {
      console.error('Error:', error);
      // En caso de error, usar datos de ejemplo
      const startIndex = (currentPage - 1) * channelsPerPage;
      const endIndex = startIndex + channelsPerPage;
      setChannels(sampleChannels.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(sampleChannels.length / channelsPerPage));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Image 
                src="https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_logo_white.svg" 
                alt="iBlups" 
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('todos')}
                className={`text-sm font-medium pb-4 border-b-2 ${
                  activeTab === 'todos'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('populares')}
                className={`text-sm font-medium pb-4 border-b-2 ${
                  activeTab === 'populares'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Populares
              </button>
              <button
                onClick={() => setActiveTab('recientes')}
                className={`text-sm font-medium pb-4 border-b-2 ${
                  activeTab === 'recientes'
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Recientes
              </button>
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar canales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white placeholder-gray-400 px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {channels.length} canales
                </span>
                <div className="flex bg-gray-700 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-600' : ''}`}
                  >
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-600' : ''}`}
                  >
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Todos los Canales</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
            
            {channels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No se encontraron canales</p>
              </div>
            )}
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </main>
    </div>
  );
}
