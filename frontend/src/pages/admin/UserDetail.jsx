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

  if (error) return <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">{error}</div>;
  if (!data) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" role="status"><span className="sr-only">Loading...</span></div></div>;

  const { user, rating } = data;

  return (
    <div className="space-y-5 fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { label: user?.name || 'User Detail' }]} />
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Users
      </Link>
      <div className="flex items-center gap-4 mb-2">
        <Avatar name={user.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
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
                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{value}</dd>
              </div>
            ))}
            {user.role === 'store_owner' && (
              <div>
                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store Rating</dt>
                <dd className="mt-1 flex items-center gap-2">
                  {rating !== null ? (
                    <><div className="flex items-center gap-1 text-amber-500"><HiStar className="w-5 h-5" /><span className="text-lg font-bold text-gray-900 dark:text-white">{rating}</span></div><span className="text-sm text-gray-400 dark:text-gray-500">/ 5</span></>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">No ratings yet</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="glass-card-gradient rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><HiLockClosed className="w-5 h-5" /> Reset Password</h2>
        <form onSubmit={handlePasswordReset} className="max-w-sm space-y-4">
          <div>
            <label htmlFor="reset-pw" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <input id="reset-pw" type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${pwErrors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`} placeholder="8-16 chars, uppercase, special" required aria-invalid={!!pwErrors.password} />
            {pwErrors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{pwErrors.password}</p>}
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
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ok ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600'}`}>
                        {ok && <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={`text-xs transition-colors ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="reset-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
            <input id="reset-confirm" type="password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${pwErrors.confirm ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`} placeholder="Repeat new password" required aria-invalid={!!pwErrors.confirm} />
            {pwErrors.confirm && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{pwErrors.confirm}</p>}
          </div>
          <button type="submit" disabled={pwLoading} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-sm btn-click btn-premium">
            {pwLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
