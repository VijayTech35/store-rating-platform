import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center fade-in">
        <div className="flex justify-center mb-6">
          <Logo size="large" showText={false} />
        </div>
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">404</h1>
        <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Page not found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200 dark:shadow-blue-900 btn-click btn-premium">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
