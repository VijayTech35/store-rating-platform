import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiStar, HiUser, HiOfficeBuilding, HiEmojiHappy, HiPencil, HiMail, HiLocationMarker } from 'react-icons/hi';
import AnimatedCounter from '../../components/AnimatedCounter';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/owner').then(({ data }) => setData(data)).catch(() => setError('Failed to load dashboard'));
  }, []);

  if (error) return <div className="bg-orange-50 dark:bg-peach/10 border border-peach/20 text-orange-500 dark:text-peach rounded-xl p-4 text-sm">{error}</div>;
  if (!data) return (
    <div className="space-y-6">
      <div className="h-8 bg-white dark:bg-deepblue/50 rounded-lg w-64 skeleton-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1,2,3].map((i) => <div key={i} className="h-28 glass-card rounded-2xl skeleton-pulse" />)}
      </div>
    </div>
  );

  const { store, ratings, avgRating } = data;
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', address: '' });
  const [editLoading, setEditLoading] = useState(false);

  const startEdit = () => {
    setEditForm({ name: store.name, email: store.email, address: store.address || '' });
    setEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put('/dashboard/owner/store', editForm);
      toast.success('Store updated!');
      setEditing(false);
      const { data: refresh } = await api.get('/dashboard/owner');
      setData(refresh);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update store');
    } finally {
      setEditLoading(false);
    }
  };

  if (!store) {
    return (
      <div className="fade-in">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink mb-6">Store Dashboard</h1>
        <div className="glass-card rounded-2xl p-8 text-center">
          <HiOfficeBuilding className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-mutedpurple" />
          <p className="text-gray-400 dark:text-palepink/50">You don't have a store assigned yet. Contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink">Store Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 fade-in-up-stagger">
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-peach to-palepink rounded-xl flex items-center justify-center shadow-lg shadow-peach/20 metric-icon"><HiStar className="w-6 h-6 text-navy" /></div>
            <div>
              <p className="text-sm text-violet-500 dark:text-lavender/70 font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-palepink"><AnimatedCounter value={avgRating} duration={1200} /></p>
            </div>
          </div>
        </div>
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-lavender to-mutedpurple rounded-xl flex items-center justify-center shadow-lg shadow-lavender/20"><HiUser className="w-6 h-6 text-navy" /></div>
            <div>
              <p className="text-sm text-violet-500 dark:text-lavender/70 font-medium">Total Ratings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-palepink"><AnimatedCounter value={ratings.length} /></p>
            </div>
          </div>
        </div>
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-palepink to-peach rounded-xl flex items-center justify-center shadow-lg shadow-palepink/20"><HiEmojiHappy className="w-6 h-6 text-navy" /></div>
            <div>
              <p className="text-sm text-violet-500 dark:text-lavender/70 font-medium">Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-palepink">{avgRating >= 4 ? 'Great!' : avgRating >= 3 ? 'Good' : avgRating > 0 ? 'Needs Work' : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="glass-card-gradient rounded-2xl p-6 fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-lavender to-peach" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">Edit Store Info</h2>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Store Name</label>
              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Address</label>
              <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none resize-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30" required />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={editLoading} className="bg-gradient-to-r from-lavender to-peach text-navy px-6 py-2.5 font-semibold rounded-xl text-sm disabled:opacity-60 transition-all shadow-sm btn-click btn-premium">
                {editLoading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass-card-gradient rounded-2xl p-6 fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-lavender to-peach flex-shrink-0" />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink mb-1">{store.name}</h2>
                <p className="text-sm text-violet-500 dark:text-lavender/70"><HiMail className="w-3.5 h-3.5 inline mr-1" />{store.email} &middot; <HiLocationMarker className="w-3.5 h-3.5 inline mr-1" />{store.address}</p>
              </div>
              <button onClick={startEdit} className="p-2 rounded-lg text-gray-400 dark:text-mutedpurple hover:text-violet-700 dark:text-lavender hover:bg-violet-50 dark:bg-lavender/10 transition-all" aria-label="Edit store info">
                <HiPencil className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card-gradient rounded-2xl overflow-hidden fade-in-up">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-peach to-palepink" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">Users Who Rated Your Store</h2>
        </div>
        <div className="overflow-x-auto">
          {ratings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-palepink/40 text-sm">No ratings yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-white dark:bg-deepblue/50 border-b border-gray-200 dark:border-white/10">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-violet-500 dark:text-lavender/70 uppercase">User</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-violet-500 dark:text-lavender/70 uppercase hidden sm:table-cell">Email</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-violet-500 dark:text-lavender/70 uppercase">Rating</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-violet-500 dark:text-lavender/70 uppercase hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {ratings.map((r) => (
                  <tr key={r.id} className="hover:bg-violet-50/50 dark:bg-lavender/5 transition-colors">
                    <td className="px-3 sm:px-6 py-3 text-sm font-medium text-gray-900 dark:text-palepink">{r.user_name}</td>
                    <td className="px-3 sm:px-6 py-3 text-sm text-gray-600 dark:text-palepink/70 hidden sm:table-cell">{r.user_email}</td>
                    <td className="px-3 sm:px-6 py-3">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <HiStar key={star} className={`w-4 h-4 ${star <= r.rating ? 'text-orange-500 dark:text-peach' : 'text-gray-400 dark:text-mutedpurple'}`} />
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-palepink/70">{r.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-sm text-gray-400 dark:text-palepink/50 hidden md:table-cell">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
