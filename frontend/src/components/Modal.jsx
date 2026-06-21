import { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="relative glass-card rounded-2xl max-w-md w-full p-6 modal-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" aria-label="Close dialog">
            <HiX className="w-5 h-5 text-gray-400 dark:text-palepink/50" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
