import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const PAGE_SIZES = [5, 10, 20, 50];

export default function Pagination({ page, totalPages, total, onPageChange, pageSize = 10, onPageSizeChange }) {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const pages = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);
  if (start > 1) pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className="flex items-center justify-between pt-4 gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">{total} total</span>
        {onPageSizeChange && (
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 outline-none" aria-label="Page size">
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-default transition-all" aria-label="Previous page">
            <HiChevronLeft className="w-4 h-4" />
          </button>
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400">...</span>
            ) : (
              <button key={p} onClick={() => onPageChange(p)} className={`min-w-[28px] h-7 text-xs font-medium rounded-lg transition-all ${p === page ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {p}
              </button>
            )
          )}
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-default transition-all" aria-label="Next page">
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
