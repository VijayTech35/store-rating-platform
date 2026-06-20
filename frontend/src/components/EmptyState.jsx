import { HiOfficeBuilding, HiExclamationCircle } from 'react-icons/hi';

export function EmptyState({ icon: Icon = HiOfficeBuilding, title = 'Nothing here', message = 'No items found.', action }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center fade-in" role="status">
      <Icon className="w-16 h-16 text-gray-200 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center fade-in" role="alert">
      <HiExclamationCircle className="w-16 h-16 text-red-300 mb-4" />
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">Error</h3>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl text-sm hover:bg-red-100 transition-colors">
          Try again
        </button>
      )}
    </div>
  );
}
