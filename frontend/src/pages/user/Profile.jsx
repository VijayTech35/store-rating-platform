import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { HiUser, HiMail, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Avatar from '../../components/Avatar';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: user?.address || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Must be 20-60 characters';
    if (form.address.length > 400) errs.address = 'Max 400 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={user.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
        </div>
      </div>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="profile-name" type="text" value={form.name} onChange={update('name')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.name ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} required aria-invalid={!!errors.name} />
              </div>
              {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="profile-email" type="email" value={form.email} onChange={update('email')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.email ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} required aria-invalid={!!errors.email} />
              </div>
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="profile-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
            <div className="relative">
              <HiLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea id="profile-address" value={form.address} onChange={update('address')} rows={2} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-700 dark:text-gray-100 ${errors.address ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} required aria-invalid={!!errors.address} />
            </div>
            {errors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.address}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 transition-all shadow-md btn-click btn-premium">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
