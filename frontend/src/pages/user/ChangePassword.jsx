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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink mb-6">Change Password</h1>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Current Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-mutedpurple" aria-hidden="true" />
              <input id="current-password" type="password" value={form.currentPassword} onChange={update('currentPassword')} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30" placeholder="Enter current password" required autoComplete="current-password" />
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">New Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-mutedpurple" aria-hidden="true" />
              <input id="new-password" type="password" value={form.password} onChange={update('password')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30 ${errors.password ? 'border-red-500/50 bg-red-900/20' : 'border-gray-200 dark:border-white/10'}`} placeholder="8-16 chars, uppercase, special" required autoComplete="new-password" aria-invalid={!!errors.password} />
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
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ok ? 'bg-peach border-peach' : 'border-gray-200 dark:border-white/20'}`}>
                        {ok && <svg className="w-2 h-2 text-navy" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className={`text-xs transition-colors ${ok ? 'text-orange-500 dark:text-peach' : 'text-gray-400 dark:text-palepink/40'}`}>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1" role="alert">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-lavender to-peach text-navy w-full py-2.5 font-semibold rounded-xl text-sm shadow-md disabled:opacity-60 transition-all btn-click btn-premium">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
