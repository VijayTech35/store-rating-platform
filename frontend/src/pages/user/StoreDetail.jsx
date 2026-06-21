import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { HiArrowLeft, HiStar, HiOfficeBuilding, HiMail, HiLocationMarker, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };

export default function UserStoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [myRating, setMyRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchStore = () => {
    api.get(`/stores/${id}`).then(({ data }) => {
      setData(data);
      setMyRating(data.store.userRating || 0);
    }).catch(() => setError('Store not found'));
  };

  useEffect(() => { fetchStore(); }, [id]);

  const handleSubmitRating = async () => {
    if (!myRating) return;
    setSubmitting(true);
    try {
      await api.post(`/stores/${id}/rate`, { rating: myRating });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#F1916D', '#AE7DAC', '#F3DADF'] });
      toast.success(data.store.userRating ? 'Rating updated!' : 'Rating submitted!');
      fetchStore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    try {
      await api.delete(`/stores/${id}/rate`);
      toast.success('Rating removed');
      fetchStore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete rating');
    }
  };

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-palepink mb-2">Store not found</h2>
        <Link to="/user" className="text-orange-500 dark:text-peach hover:underline text-sm">Back to stores</Link>
      </div>
    </div>
  );
  if (!data) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-lavender border-t-transparent rounded-full" role="status"><span className="sr-only">Loading...</span></div>
    </div>
  );

  const { store, ratings = [] } = data;
  const avgRating = parseFloat(store.avg_rating) || 0;

  return (
    <div className="space-y-5 fade-in">
      <Link to="/user" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Stores
      </Link>

      <div className="glass-card-gradient rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-lavender to-peach rounded-2xl flex items-center justify-center shadow-lg shadow-lavender/20 flex-shrink-0">
            <HiOfficeBuilding className="w-7 h-7 text-navy" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink truncate">{store.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-lavender/70"><HiMail className="w-4 h-4" /> {store.email}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-lavender/70"><HiLocationMarker className="w-4 h-4" /> {store.address}</div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <HiStar key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-orange-500 dark:text-peach' : 'text-gray-400 dark:text-mutedpurple'}`} />
                ))}
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-palepink">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-gray-400 dark:text-palepink/50">({ratings.length} rating(s))</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card-gradient rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink mb-4">Your Rating</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this store">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setMyRating(star)} className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" aria-label={`${RATING_LABELS[star]} - ${star} star${star > 1 ? 's' : ''}`} role="radio" aria-checked={star === myRating}>
                <HiStar className={`w-8 h-8 transition-all duration-200 ${star <= myRating ? 'text-orange-500 dark:text-peach drop-shadow-sm' : 'text-gray-400 dark:text-mutedpurple'} ${star <= myRating ? 'scale-110' : ''}`} />
              </button>
            ))}
          </div>
          <button onClick={handleSubmitRating} disabled={!myRating || submitting} className="px-5 py-2 bg-gradient-to-r from-lavender to-peach text-navy text-sm font-semibold rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-md btn-premium">
            {submitting ? 'Submitting...' : store.userRating ? 'Update Rating' : 'Submit Rating'}
          </button>
          {store.userRating && (
            <button onClick={handleDeleteRating} className="p-2 rounded-lg text-gray-400 dark:text-mutedpurple hover:text-orange-500 dark:text-peach hover:bg-orange-50 dark:bg-peach/10 transition-all" aria-label="Remove your rating">
              <HiTrash className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="glass-card-gradient rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">All Ratings</h2>
        </div>
        {ratings.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-palepink/40 text-sm">No ratings yet</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-white/5">
            {ratings.map((r, i) => (
              <div key={r.id || i} className="px-6 py-4 hover:bg-violet-50/50 dark:bg-lavender/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-palepink">{r.user_name}</span>
                    <span className="text-xs text-gray-400 dark:text-palepink/50 ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({length: 5}, (_, s) => (
                      <HiStar key={s} className={`w-4 h-4 ${s < r.rating ? 'text-orange-500 dark:text-peach' : 'text-gray-400 dark:text-mutedpurple'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
