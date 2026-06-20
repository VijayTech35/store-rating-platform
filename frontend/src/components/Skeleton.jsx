export function Skeleton({ className = '', rows = 1 }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-pulse" style={{ width: `${80 + Math.random() * 20}%` }} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4" role="status" aria-label="Loading card">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 skeleton-pulse" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-12 skeleton-pulse" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 skeleton-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 skeleton-pulse" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-full skeleton-pulse" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden" role="status" aria-label="Loading table">
      <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-pulse flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-5 py-3 border-b border-gray-50 dark:border-gray-700/50">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-3.5 bg-gray-100 dark:bg-gray-700 rounded skeleton-pulse flex-1" style={{ opacity: 1 - c * 0.15 }} />
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
