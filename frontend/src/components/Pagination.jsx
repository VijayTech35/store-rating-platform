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
        <span className="text-xs font-medium text-gray-400 dark:text-palepink/50 bg-white dark:bg-deepblue/50 px-2.5 py-1 rounded-lg">{total} total</span>
        {onPageSizeChange && (
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-deepblue/50 text-gray-600 dark:text-palepink/70 outline-none transition-shadow hover:border-lavender/30 focus:ring-2 focus:ring-lavender/20" aria-label="Page size">
            {PAGE_SIZES.map((s) => <option key={s} value={s} className="bg-navy text-gray-900 dark:text-palepink">{s} / page</option>)}
          </select>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="p-1.5 rounded-xl text-gray-400 dark:text-palepink/50 hover:text-violet-700 dark:text-lavender hover:bg-violet-50 dark:bg-lavender/10 disabled:opacity-30 disabled:cursor-default transition-all" aria-label="Previous page">
            <HiChevronLeft className="w-4 h-4" />
          </button>
          {pages.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-xs text-gray-400 dark:text-palepink/40">...</span>
            ) : (
              <button key={p} onClick={() => onPageChange(p)} className={`min-w-[32px] h-8 text-xs font-medium rounded-xl transition-all duration-200 ${p === page ? 'bg-gradient-to-r from-lavender to-peach text-navy text-navy shadow-md scale-105' : 'text-gray-400 dark:text-palepink/50 hover:bg-gray-100 dark:hover:bg-white/5 hover:scale-105'}`}>
                {p}
              </button>
            )
          )}
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-xl text-gray-400 dark:text-palepink/50 hover:text-violet-700 dark:text-lavender hover:bg-violet-50 dark:bg-lavender/10 disabled:opacity-30 disabled:cursor-default transition-all" aria-label="Next page">
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
