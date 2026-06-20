import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { HiArrowLeft, HiStar, HiOfficeBuilding, HiMail, HiLocationMarker, HiTrash } from 'react-icons/hi';
import Breadcrumb from '../../components/Breadcrumb';
import toast from 'react-hot-toast';

export default function AdminStoreDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchStore = () => {
    api.get(`/admin/stores/${id}`).then(({ data }) => setData(data)).catch(() => setError('Store not found'));
  };

  useEffect(() => { fetchStore(); }, [id]);

  const handleDeleteRating = async (ratingId, userName, storeId) => {
    try {
      const { data: storeData } = await api.get(`/admin/stores/${storeId}`);
      const ratingData = storeData.ratings.find((r) => r.id === ratingId);
      await api.delete(`/admin/ratings/${ratingId}`);
      toast((t) => (
        <div className="flex items-center gap-3 text-sm">
          <span>Rating by {userName} deleted</span>
          <button onClick={async () => { toast.dismiss(t.id); try { await api.post(`/stores/${storeId}/rate`, { rating: ratingData.rating }); toast.success('Rating restored'); fetchStore(); } catch { toast.error('Could not restore'); } }} className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-all">Undo</button>
        </div>
      ));
      fetchStore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete rating');
    }
  };

  if (error) return <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">{error}</div>;
  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" role="status"><span className="sr-only">Loading...</span></div></div>;

  const { store, avg_rating, ratings } = data;

  return (
    <div className="space-y-5 fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/stores', label: 'Stores' }, { label: store.name }]} />
      <Link to="/admin/stores" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Stores
      </Link>

      <div className="glass-card-gradient rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/30 flex-shrink-0">
            <HiOfficeBuilding className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{store.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><HiMail className="w-4 h-4" /> {store.email}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"><HiLocationMarker className="w-4 h-4" /> {store.address}</div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <HiStar key={s} className={`w-5 h-5 ${s <= Math.round(parseFloat(avg_rating)) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
                ))}
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{parseFloat(avg_rating).toFixed(1)}</span>
              <span className="text-sm text-gray-400 dark:text-gray-500">({ratings.length} rating(s))</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card-gradient rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Ratings</h2>
        </div>
        {ratings.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No ratings yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-3 sm:px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {ratings.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-3 sm:px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{r.name}</td>
                    <td className="px-3 sm:px-5 py-3"><div className="flex items-center gap-1">{Array.from({length: 5}, (_, s) => <HiStar key={s} className={`w-4 h-4 ${s < r.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />)}</div></td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-3 sm:px-5 py-3 text-right">
                      <button onClick={() => handleDeleteRating(r.id, r.name, store.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all" aria-label={`Delete rating by ${r.name}`}>
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
