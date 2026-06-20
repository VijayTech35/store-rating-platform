import { useState } from 'react';
import api from '../../api/axios';
import { HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ChangePassword({ userRole }) {
  const [form, setForm] = useState({ currentPassword: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (form.password.length < 8 || form.password.length > 16) errs.password = 'Must be 8-16 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Need 1 uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) errs.password = 'Need 1 special character';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.put('/auth/password', form);
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h1>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input id="current-password" type="password" value={form.currentPassword} onChange={update('currentPassword')} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100" placeholder="Enter current password" required autoComplete="current-password" />
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input id="new-password" type="password" value={form.password} onChange={update('password')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.password ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="8-16 chars, uppercase, special" required autoComplete="new-password" aria-invalid={!!errors.password} />
            </div>
            {form.password && (
              <div className="mt-2 space-y-1">
                {[
                  { label: '8-16 characters', test: (p) => p.length >= 8 && p.length <= 16 },
                  { label: 'At least 1 uppercase letter', test: (p) => /[A-Z]/.test(p) },
                  { label: 'At least 1 special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
                ].map((req) => {
                  const ok = req.test(form.password);
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
            {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 transition-all shadow-md shadow-blue-200 dark:shadow-blue-900 btn-click btn-premium">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
