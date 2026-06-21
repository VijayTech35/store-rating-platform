import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { HiArrowLeft, HiStar, HiLockClosed } from 'react-icons/hi';
import Breadcrumb from '../../components/Breadcrumb';
import Avatar from '../../components/Avatar';
import toast from 'react-hot-toast';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(({ data }) => setData(data)).catch(() => setError('User not found'));
  }, [id]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const errs = {};
    if (pwForm.password.length < 8 || pwForm.password.length > 16) errs.password = 'Must be 8-16 characters';
    else if (!/[A-Z]/.test(pwForm.password)) errs.password = 'Need 1 uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwForm.password)) errs.password = 'Need 1 special character';
    if (pwForm.password !== pwForm.confirm) errs.confirm = 'Passwords do not match';
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPwLoading(true);
    try {
      await api.put(`/admin/users/${id}/password`, { password: pwForm.password });
      toast.success('Password reset successfully!');
      setPwForm({ password: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setPwLoading(false);
    }
  };

  if (error) return <div className="bg-orange-50 dark:bg-peach/10 border border-peach/20 text-orange-500 dark:text-peach rounded-xl p-4 text-sm">{error}</div>;
  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-lavender border-t-transparent rounded-full" role="status"><span className="sr-only">Loading...</span></div></div>;

  const { user, rating } = data;

  return (
    <div className="space-y-5 fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { label: user?.name || 'User Detail' }]} />
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Users
      </Link>
      <div className="flex items-center gap-4 mb-2">
        <Avatar name={user.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink">{user.name}</h1>
          <p className="text-sm text-violet-500 dark:text-lavender/70 capitalize">{user.role.replace('_', ' ')}</p>
        </div>
      </div>
      <div className="glass-card-gradient rounded-2xl overflow-hidden">
        <div className="p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ['Email', user.email],
              ['Address', user.address],
              ['Member Since', new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium text-violet-500 dark:text-lavender/70 uppercase tracking-wider">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-palepink">{value}</dd>
              </div>
            ))}
            {user.role === 'store_owner' && (
              <div>
                <dt className="text-xs font-medium text-violet-500 dark:text-lavender/70 uppercase tracking-wider">Store Rating</dt>
                <dd className="mt-1 flex items-center gap-2">
                  {rating !== null ? (
                    <><div className="flex items-center gap-1 text-orange-500 dark:text-peach"><HiStar className="w-5 h-5" /><span className="text-lg font-bold text-gray-900 dark:text-palepink">{rating}</span></div><span className="text-sm text-gray-400 dark:text-palepink/50">/ 5</span></>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-palepink/50">No ratings yet</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="glass-card-gradient rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink mb-4 flex items-center gap-2"><HiLockClosed className="w-5 h-5 text-violet-700 dark:text-lavender" /> Reset Password</h2>
        <form onSubmit={handlePasswordReset} className="max-w-sm space-y-4">
          <div>
            <label htmlFor="reset-pw" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">New Password</label>
            <input id="reset-pw" type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30 ${pwErrors.password ? 'border-red-500/50' : 'border-gray-200 dark:border-white/10'}`} placeholder="8-16 chars, uppercase, special" required aria-invalid={!!pwErrors.password} />
            {pwErrors.password && <p className="text-red-400 text-xs mt-1" role="alert">{pwErrors.password}</p>}
            {pwForm.password && (
              <div className="mt-2 space-y-1">
                {[
                  { label: '8-16 characters', test: (p) => p.length >= 8 && p.length <= 16 },
                  { label: 'At least 1 uppercase letter', test: (p) => /[A-Z]/.test(p) },
                  { label: 'At least 1 special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
                ].map((req) => {
                  const ok = req.test(pwForm.password);
                  return (
                    <div key={req.label} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ok ? 'bg-peach border-peach' : 'border-gray-200 dark:border-white/20'}`}>
                        {ok && <svg className="w-2 h-2 text-navy" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={`text-xs transition-colors ${ok ? 'text-orange-500 dark:text-peach' : 'text-gray-400 dark:text-palepink/40'}`}>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="reset-confirm" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Confirm Password</label>
            <input id="reset-confirm" type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30 ${pwErrors.confirm ? 'border-red-500/50' : 'border-gray-200 dark:border-white/10'}`} placeholder="Repeat new password" required aria-invalid={!!pwErrors.confirm} />
            {pwErrors.confirm && <p className="text-red-400 text-xs mt-1" role="alert">{pwErrors.confirm}</p>}
          </div>
          <button type="submit" disabled={pwLoading} className="bg-gradient-to-r from-lavender to-peach text-navy px-6 py-2.5 font-semibold rounded-xl text-sm shadow-md disabled:opacity-60 transition-all btn-click btn-premium">
            {pwLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
