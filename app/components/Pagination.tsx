'use client';

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
  // Si solo hay una página, mostrar información simple
  if (totalPages <= 1) {
    return showInfo ? (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted">Página 1 de 1</span>
      </div>
    ) : null;
  }

  // Calcular páginas visibles
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
    <div className="flex items-center justify-center space-x-2">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-secondary bg-button rounded-md hover-bg-button disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>

      {/* Primera página si no está visible */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm font-medium text-secondary bg-button rounded-md hover-bg-button transition-colors"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-disabled text-sm">...</span>
          )}
        </>
      )}

      {/* Páginas visibles */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            page === currentPage
              ? 'bg-button-active text-primary'
              : 'bg-button text-secondary hover-bg-button'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Última página si no está visible */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-disabled text-sm">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm font-medium text-secondary bg-button rounded-md hover-bg-button transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-secondary bg-button rounded-md hover-bg-button disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>

      {/* Información de página */}
      {showInfo && (
        <span className="text-sm text-muted ml-4">
          Página {currentPage} de {totalPages}
        </span>
      )}
    </div>
  );
}
