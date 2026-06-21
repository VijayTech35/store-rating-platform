import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { HiOfficeBuilding, HiMail, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';

export default function AdminEditStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/stores/${id}`).then(({ data }) => {
      setForm({ name: data.store.name, email: data.store.email, address: data.store.address || '' });
    }).catch(() => { toast.error('Store not found'); navigate('/admin/stores'); }).finally(() => setLoading(false));
  }, [id, navigate]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Store name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await api.put(`/admin/stores/${id}`, form);
      toast.success('Store updated!');
      navigate('/admin/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update store');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-lavender border-t-transparent rounded-full" role="status"><span className="sr-only">Loading...</span></div></div>;

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/stores', label: 'Stores' }, { label: 'Edit Store' }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink mb-6">Edit Store</h1>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="editstore-name" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Store Name</label>
              <div className="relative">
                <HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-mutedpurple" />
                <input id="editstore-name" type="text" value={form.name} onChange={update('name')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30 ${errors.name ? 'border-red-500/50 bg-red-900/20' : 'border-gray-200 dark:border-white/10'}`} required aria-invalid={!!errors.name} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="editstore-email" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-mutedpurple" />
                <input id="editstore-email" type="email" value={form.email} onChange={update('email')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30 ${errors.email ? 'border-red-500/50 bg-red-900/20' : 'border-gray-200 dark:border-white/10'}`} required aria-invalid={!!errors.email} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="editstore-address" className="block text-sm font-medium text-violet-700 dark:text-lavender mb-1.5">Address</label>
            <div className="relative">
              <HiLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-mutedpurple" />
              <textarea id="editstore-address" value={form.address} onChange={update('address')} rows={2} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-lavender/40 outline-none resize-none bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30" required />
            </div>
          </div>
          <button type="submit" className="bg-gradient-to-r from-lavender to-peach text-navy w-full sm:w-auto px-6 py-2.5 font-semibold rounded-xl text-sm shadow-md btn-click btn-premium">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
