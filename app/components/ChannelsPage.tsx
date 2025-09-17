'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ChannelCard from './ChannelCard';
import Pagination from './Pagination';
import Footer from './Footer';
import Navbar from './Navbar';
import ClientOnly from './ClientOnly';
import { useChannels } from '../hooks/useChannels';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/home.css';
import '../styles/footer.css';

function ChannelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const urlPage = parseInt(searchParams.get('page') || '1');
  const urlSearch = searchParams.get('search') || '';
  const urlTab = searchParams.get('tab') || 'all';
  
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [activeTab, setActiveTab] = useState(urlTab);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const channelsPerPage = 16;

  // Use the channels hook with the API
  const {
    channels,
    totalLiveChannels,
    currentPage: apiCurrentPage,
    totalPages,
    loading,
    error,
    refetch
  } = useChannels({
    page: currentPage,
    limit: channelsPerPage,
    search: searchTerm,
    tab: activeTab
  });

  // Sync state with URL parameters only when they change
  useEffect(() => {
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlPage, urlSearch, urlTab, currentPage, searchTerm, activeTab]);

  // Function to update the URL
  const updateURL = (page: number, search: string, tab: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (tab !== 'all') params.set('tab', tab);
    
    const queryString = params.toString();
    const newURL = queryString ? `/?${queryString}` : '/';
    router.push(newURL, { scroll: false });
  };

  const handlePageChange = useCallback((page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      updateURL(page, searchTerm, activeTab);
    }
  }, [currentPage, searchTerm, activeTab]);

  const handleSearchChange = useCallback((search: string) => {
    if (search !== searchTerm) {
      setSearchTerm(search);
      setCurrentPage(1); // Reset to first page when searching
      updateURL(1, search, activeTab);
    }
  }, [searchTerm, activeTab]);

  const handleTabChange = useCallback((tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1); // Reset to first page when changing tab
      updateURL(1, searchTerm, tab);
    }
  }, [activeTab, searchTerm]);

  return (
    <div className="page-with-footer bg-primary">
      {/* Navbar mejorado y responsive - Cursor */}
      <Navbar 
        showSearch={true}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
      />

                  {/* Hero Section - Mensaje de presentación de la marca */}
                  <div className="w-full text-center py-16" style={{ backgroundColor: '#F5F3F4' }}>
                    <div className="max-w-4xl mx-auto px-4">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2c73ff' }}>
                        EL MUNDO, UNA PANTALLA.
                      </h1>
                      <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: '#161A1D' }}>
                        Contenido que conecta. Noticias que informan. Música que inspira. Deportes que unen. Cine, podcasts y radios que acompañan. Todo sucede aquí, en vivo.
                      </p>
                      <a
                        href="https://studio.iblups.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
                      >
                        Crea tu canal
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="page-content">
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-primary">
                          {totalLiveChannels} live channels
                        </h2>
          {!loading && !error && (
            <div className="flex items-center space-x-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Error: {error}</p>
            <button
              onClick={refetch}
              className="bg-button text-primary px-4 py-2 rounded-md hover-bg-button transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-tertiary"></div>
                <div className="p-4">
                  <div className="h-4 bg-tertiary rounded mb-2"></div>
                  <div className="h-3 bg-tertiary rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Channels Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
            
            {/* Empty State */}
            {channels.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-disabled text-lg">No channels found</p>
                {searchTerm && (
                  <p className="text-muted text-sm mt-2">
                    Try different search terms
                  </p>
                )}
              </div>
            )}
          </>
        )}
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function ChannelsPageContentTranslated() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  // Get URL parameters
  const urlPage = parseInt(searchParams.get('page') || '1');
  const urlSearch = searchParams.get('search') || '';
  const urlTab = searchParams.get('tab') || 'all';
  
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [activeTab, setActiveTab] = useState(urlTab);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const channelsPerPage = 16;

  // Use the channels hook with the API
  const {
    channels,
    totalLiveChannels,
    currentPage: apiCurrentPage,
    totalPages,
    loading,
    error,
    refetch
  } = useChannels({
    page: currentPage,
    limit: channelsPerPage,
    search: searchTerm,
    tab: activeTab
  });

  // Sync state with URL parameters only when they change
  useEffect(() => {
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlPage, urlSearch, urlTab, currentPage, searchTerm, activeTab]);

  // Function to update the URL
  const updateURL = (page: number, search: string, tab: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (tab !== 'all') params.set('tab', tab);
    
    const queryString = params.toString();
    const newURL = queryString ? `/?${queryString}` : '/';
    router.push(newURL, { scroll: false });
  };

  const handlePageChange = useCallback((page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      updateURL(page, searchTerm, activeTab);
    }
  }, [currentPage, searchTerm, activeTab]);

  const handleSearchChange = useCallback((search: string) => {
    if (search !== searchTerm) {
      setSearchTerm(search);
      setCurrentPage(1); // Reset to first page when searching
      updateURL(1, search, activeTab);
    }
  }, [searchTerm, activeTab]);

  const handleTabChange = useCallback((tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1); // Reset to first page when changing tab
      updateURL(1, searchTerm, tab);
    }
  }, [activeTab, searchTerm]);

  return (
    <div className="page-with-footer bg-primary">
      {/* Navbar mejorado y responsive - Cursor */}
      <Navbar 
        showSearch={true}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
      />

      {/* Hero Section - Mensaje de presentación de la marca */}
      <div className="w-full text-center py-16" style={{ backgroundColor: '#F5F3F4' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#2c73ff' }}>
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: '#161A1D' }}>
            {t('hero.description')}
          </p>
          <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ color: '#161A1D' }}>
            {t('hero.subtitle')}
          </p>
          <a
            href="https://studio.iblups.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-[#2c73ff] rounded-lg hover:bg-[#1e5bb8] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            {t('hero.createChannel')}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-primary">
              {totalLiveChannels} {t('search.liveChannels')}
            </h2>
          {!loading && !error && (
            <div className="flex items-center space-x-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showInfo={true}
              />
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{t('channels.error')}: {error}</p>
            <button
              onClick={refetch}
              className="bg-button text-primary px-4 py-2 rounded-md hover-bg-button transition-colors"
            >
              {t('channels.retry')}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-tertiary"></div>
                <div className="p-4">
                  <div className="h-4 bg-tertiary rounded mb-2"></div>
                  <div className="h-3 bg-tertiary rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Channels Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
            
            {/* Empty State */}
            {channels.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-disabled text-lg">{t('channels.notFound')}</p>
                {searchTerm && (
                  <p className="text-muted text-sm mt-2">
                    {t('search.tryDifferent')}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function ChannelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-primary">Cargando...</div>
      </div>
    }>
      <ClientOnly fallback={<ChannelsPageContent />}>
        <ChannelsPageContentTranslated />
      </ClientOnly>
    </Suspense>
  );
}
