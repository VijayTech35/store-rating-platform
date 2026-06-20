import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiSearch, HiStar, HiOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { SkeletonCard } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const [pulse, setPulse] = useState(0);

  const handleKeyDown = (e, star) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(5, star + 1);
      onChange(next);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prev = Math.max(1, star - 1);
      onChange(prev);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(star);
    }
  };

  const handleClick = (star) => {
    onChange(star);
    setPulse(star);
    setTimeout(() => setPulse(0), 400);
  };

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this store">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative group">
          <button
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            className={`star-btn focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${pulse === star ? 'star-pulse' : ''}`}
            aria-label={`${RATING_LABELS[star]} - ${star} star${star > 1 ? 's' : ''}`}
            role="radio"
            aria-checked={star <= (hover || value)}
            tabIndex={star === (hover || value || 1) ? 0 : -1}
          >
            <HiStar className={`w-7 h-7 transition-all duration-200 ${
              star <= (hover || value) ? 'text-amber-400 drop-shadow-sm' : 'text-gray-200 dark:text-gray-600'
            } ${star <= (hover || value) && pulse === star ? 'star-bounce' : ''}`} />
          </button>
          {hover === star && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap slide-down" role="tooltip">
              {RATING_LABELS[star]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function UserStores() {
  const [data, setData] = useState({ stores: [], total: 0 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [ratingState, setRatingState] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStores = () => {
    setLoading(true);
    api.get('/stores', { params: { search, sortBy, sortOrder } }).then(({ data }) => setData(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStores(); }, [search, sortBy, sortOrder]);

  const handleRate = async (storeId) => {
    const val = ratingState[storeId];
    if (!val) return;
    setSubmitting((s) => ({ ...s, [storeId]: true }));
    try {
      await api.post(`/stores/${storeId}/rate`, { rating: val });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#3b82f6', '#f59e0b', '#10b981'] });
      toast.success('Rating submitted!');
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting((s) => ({ ...s, [storeId]: false }));
    }
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Stores</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{data.total} store(s)</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input
            placeholder="Search by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow dark:text-gray-100"
            aria-label="Search stores"
          />
        </div>
        <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [s, o] = e.target.value.split('-'); setSortBy(s); setSortOrder(o); }} className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-gray-100" aria-label="Sort stores">
          <option value="name-ASC">Name A-Z</option>
          <option value="name-DESC">Name Z-A</option>
          <option value="avg_rating-DESC">Rating: High to Low</option>
          <option value="avg_rating-ASC">Rating: Low to High</option>
          <option value="email-ASC">Email A-Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : data.stores.length === 0 ? (
          <EmptyState
            icon={HiOfficeBuilding}
            title="No stores found"
            message="Try adjusting your search or check back later."
          />
        ) : data.stores.map((store) => (
          <div key={store.id} className="glass-card rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{store.name}</h3>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg">
                <HiStar className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{parseFloat(store.avg_rating).toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{store.address}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">{store.email} &middot; {store.rating_count} rating(s)</p>

{store.userRating && (
  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
    <span className="text-xs font-medium text-blue-700 dark:text-blue-300 block mb-1">Your rating</span>
    <div className="flex items-center gap-0.5" aria-label={`Your rating: ${store.userRating} out of 5`}>
      {[1,2,3,4,5].map((s) => (
        <HiStar key={s} className={`w-4 h-4 ${s <= store.userRating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
      ))}
    </div>
  </div>
)}

            <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <StarRating
                value={ratingState[store.id] || store.userRating || 0}
                onChange={(val) => setRatingState({ ...ratingState, [store.id]: val })}
              />
              <button
                onClick={() => handleRate(store.id)}
                disabled={!ratingState[store.id] || submitting[store.id]}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-sm btn-click btn-premium"
                aria-label={store.userRating ? 'Update your rating' : 'Submit your rating'}
              >
                {submitting[store.id] ? <span className="inline-block animate-spin">&#9696;</span> : store.userRating ? 'Update' : 'Rate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
