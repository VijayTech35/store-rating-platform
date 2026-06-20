import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { HiUser, HiMail, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(({ data }) => {
      setForm({ name: data.user.name, email: data.user.email, address: data.user.address || '', role: data.user.role });
    }).catch(() => { toast.error('User not found'); navigate('/admin/users'); }).finally(() => setLoading(false));
  }, [id, navigate]);

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
    try {
      await api.put(`/admin/users/${id}`, form);
      toast.success('User updated!');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" role="status"><span className="sr-only">Loading...</span></div></div>;

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { label: 'Edit User' }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit User</h1>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="edituser-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="edituser-name" type="text" value={form.name} onChange={update('name')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.name ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} required aria-invalid={!!errors.name} />
              </div>
              {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="edituser-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="edituser-email" type="email" value={form.email} onChange={update('email')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.email ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} required aria-invalid={!!errors.email} />
              </div>
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="edituser-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <select id="edituser-role" value={form.role} onChange={update('role')} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-gray-100">
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="edituser-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
            <div className="relative">
              <HiLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea id="edituser-address" value={form.address} onChange={update('address')} rows={2} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-700 dark:text-gray-100 ${errors.address ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} required aria-invalid={!!errors.address} />
            </div>
            {errors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.address}</p>}
          </div>
          <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all shadow-md btn-click btn-premium">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
