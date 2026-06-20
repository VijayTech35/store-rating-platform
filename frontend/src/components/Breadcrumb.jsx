import { Link } from 'react-router-dom';
import { HiChevronRight, HiHome } from 'react-icons/hi';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
      <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Dashboard">
        <HiHome className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <HiChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          {item.to ? (
            <Link to={item.to} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
