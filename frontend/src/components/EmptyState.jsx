import { HiOfficeBuilding, HiExclamationCircle } from 'react-icons/hi';

export function EmptyState({ icon: Icon = HiOfficeBuilding, title = 'Nothing here', message = 'No items found.', action }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center fade-in" role="status">
      <Icon className="w-16 h-16 text-gray-400 dark:text-mutedpurple mb-4" />
      <h3 className="text-lg font-semibold text-violet-700 dark:text-lavender mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-palepink/50 mb-4">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center fade-in" role="alert">
      <HiExclamationCircle className="w-16 h-16 text-orange-500 dark:text-peach/50 mb-4" />
      <h3 className="text-lg font-semibold text-orange-500 dark:text-peach mb-1">Error</h3>
      <p className="text-sm text-gray-400 dark:text-palepink/50 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-orange-50 dark:bg-peach/10 text-orange-500 dark:text-peach font-medium rounded-xl text-sm hover:bg-orange-100 dark:bg-peach/20 transition-colors">
          Try again
        </button>
      )}
    </div>
  );
}