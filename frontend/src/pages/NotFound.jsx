import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function NotFound() {
  const { user } = useAuth();
  const home = user ? `/${user.role}` : '/login';

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center fade-in-up">
        <div className="flex justify-center mb-6">
          <Logo size="large" showText={false} />
        </div>
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-lavender via-peach to-palepink bg-clip-text text-transparent leading-none mb-2">404</h1>
        <p className="text-xl font-semibold text-gray-900 dark:text-palepink mb-2">Page not found</p>
        <p className="text-gray-400 dark:text-palepink/50 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to={home} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-lavender to-peach text-navy font-semibold rounded-xl text-sm hover:brightness-110 transition-all shadow-md shadow-lavender/20 btn-click btn-premium">
          Back to Home
        </Link>
      </div>
    </div>
  );
}