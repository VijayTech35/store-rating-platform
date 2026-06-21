import { Link } from 'react-router-dom';
import { HiChevronRight, HiHome } from 'react-icons/hi';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-palepink/60 mb-4 fade-in-up" aria-label="Breadcrumb">
      <Link to="/admin" className="hover:text-violet-700 dark:text-lavender transition-colors p-0.5 rounded" aria-label="Dashboard">
        <HiHome className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <HiChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-mutedpurple breadcrumb-arrow" aria-hidden="true" />
          {item.to ? (
            <Link to={item.to} className="hover:text-violet-700 dark:text-lavender transition-colors font-medium text-gray-700 dark:text-palepink/80">{item.label}</Link>
          ) : (
            <span className="text-gray-900 dark:text-palepink font-semibold" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
