import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { HiUser, HiMail, HiLockClosed, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Must be 20-60 characters';
    if (form.address.length > 400) errs.address = 'Max 400 characters';
    if (form.password.length < 8 || form.password.length > 16) errs.password = 'Must be 8-16 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Need 1 uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) errs.password = 'Need 1 special character';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { label: 'Add User' }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New User</h1>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="adduser-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="adduser-name" type="text" value={form.name} onChange={update('name')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.name ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="20-60 characters" required aria-invalid={!!errors.name} />
              </div>
              <div className="flex items-center justify-between">
                {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
                <span className={`text-xs ml-auto mt-1 ${form.name.length < 20 ? 'text-gray-400 dark:text-gray-500' : form.name.length <= 60 ? 'text-emerald-500' : 'text-red-500'}`}>{form.name.length}/60</span>
              </div>
            </div>
            <div>
              <label htmlFor="adduser-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="adduser-email" type="email" value={form.email} onChange={update('email')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.email ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="user@example.com" required aria-invalid={!!errors.email} />
              </div>
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="adduser-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="adduser-password" type="password" value={form.password} onChange={update('password')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.password ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="8-16 chars, uppercase, special" required aria-invalid={!!errors.password} />
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
            <div>
              <label htmlFor="adduser-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <select id="adduser-role" value={form.role} onChange={update('role')} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-gray-100">
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="adduser-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
            <div className="relative">
              <HiLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
              <textarea id="adduser-address" value={form.address} onChange={update('address')} rows={2} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-700 dark:text-gray-100 ${errors.address ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="Enter address" required aria-invalid={!!errors.address} />
            </div>
            <div className="flex items-center justify-between">
              {errors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.address}</p>}
              <span className={`text-xs ml-auto mt-1 ${form.address.length <= 400 ? 'text-gray-400 dark:text-gray-500' : 'text-red-500'}`}>{form.address.length}/400</span>
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all shadow-md shadow-blue-200 dark:shadow-blue-900 btn-click btn-premium">
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
