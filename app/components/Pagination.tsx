'use client';
import { useTranslation } from '../hooks/useTranslation';
import ClientOnly from './ClientOnly';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  maxVisiblePages = 5
}: PaginationProps) {
  const { t } = useTranslation();

  // Si solo hay una página, mostrar información simple
  if (totalPages <= 1) {
    return showInfo ? (
      <div className="flex items-center justify-center">
        <ClientOnly fallback={<span className="text-sm text-muted">Page 1 of 1</span>}>
          <span className="text-sm text-muted">{t('pagination.pageOf', { current: 1, total: 1 })}</span>
        </ClientOnly>
      </div>
    ) : null;
  }

  // Calcular páginas visibles - Responsive - Cursor
  const getVisiblePages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajustar si no hay suficientes páginas
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return { pages, startPage, endPage };
  };

  const { pages, startPage, endPage } = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-2">
      {/* Información de página - Móvil arriba, Desktop a la derecha - Cursor */}
      {showInfo && (
        <div className="order-1 sm:order-2">
          <ClientOnly fallback={`Page ${currentPage} of ${totalPages}`}>
            <span className="text-sm text-muted font-medium">
              {t('pagination.pageOf', { current: currentPage, total: totalPages })}
            </span>
          </ClientOnly>
        </div>
      )}

      {/* Controles de paginación - Cursor */}
      <div className="order-2 sm:order-1 flex items-center space-x-1 sm:space-x-2">
        {/* Botón Anterior - Mejorado para móviles - Cursor */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-2 py-2 sm:px-4 sm:py-2 text-sm font-medium text-secondary bg-button rounded-lg hover:bg-button-active disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md min-w-[50px] sm:min-w-[100px] justify-center"
        >
          {/* Icono para móviles - Cursor */}
          <span className="sm:hidden text-sm font-bold">«</span>
          {/* Icono SVG para desktop - Cursor */}
          <svg className="hidden sm:block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">
            <ClientOnly fallback="Previous">
              {t('pagination.previous')}
            </ClientOnly>
          </span>
        </button>

        {/* Páginas - Responsive con menos páginas en móviles - Cursor */}
        <div className="flex items-center space-x-1">
          {/* Primera página si no está visible - Solo en desktop - Cursor */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="hidden sm:block px-3 py-2 text-sm font-medium text-secondary bg-button rounded-lg hover:bg-button-active transition-all duration-200 shadow-sm hover:shadow-md"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="hidden sm:block text-muted text-sm px-1">...</span>
              )}
            </>
          )}

          {/* Páginas visibles - Adaptadas para móviles - Cursor */}
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md min-w-[40px] ${
                page === currentPage
                  ? 'bg-[#2c73ff] text-white shadow-md scale-105'
                  : 'bg-button text-secondary hover:bg-button-active'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Última página si no está visible - Solo en desktop - Cursor */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="hidden sm:block text-muted text-sm px-1">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="hidden sm:block px-3 py-2 text-sm font-medium text-secondary bg-button rounded-lg hover:bg-button-active transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Botón Siguiente - Mejorado para móviles - Cursor */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-2 py-2 sm:px-4 sm:py-2 text-sm font-medium text-secondary bg-button rounded-lg hover:bg-button-active disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md min-w-[50px] sm:min-w-[100px] justify-center"
        >
          <span className="hidden sm:inline">
            <ClientOnly fallback="Next">
              {t('pagination.next')}
            </ClientOnly>
          </span>
          {/* Icono SVG para desktop - Cursor */}
          <svg className="hidden sm:block w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {/* Icono para móviles - Cursor */}
          <span className="sm:hidden text-sm font-bold">»</span>
        </button>
      </div>

      {/* Indicador de progreso para móviles - Cursor */}
      <div className="order-3 sm:hidden flex items-center space-x-2">
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.floor((currentPage - 1) / Math.ceil(totalPages / 5)) * 5 + i + 1;
            return page <= totalPages ? (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  page === currentPage ? 'bg-[#2c73ff]' : 'bg-muted'
                }`}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
