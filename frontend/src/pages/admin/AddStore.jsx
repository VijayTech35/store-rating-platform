import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { HiOfficeBuilding, HiMail, HiLocationMarker, HiUser } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';

export default function AdminAddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner', limit: 1000 } }).then(({ data }) => setOwners(data.users));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Store name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.owner_id) errs.owner_id = 'Select an owner';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await api.post('/admin/stores', form);
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { to: '/admin/stores', label: 'Stores' }, { label: 'Add Store' }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Store</h1>
      <div className="glass-card-gradient rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="addstore-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Store Name</label>
              <div className="relative">
                <HiOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="addstore-name" type="text" value={form.name} onChange={update('name')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.name ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="Store name" required aria-invalid={!!errors.name} />
              </div>
              {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="addstore-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="addstore-email" type="email" value={form.email} onChange={update('email')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100 ${errors.email ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} placeholder="store@example.com" required aria-invalid={!!errors.email} />
              </div>
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="addstore-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
              <div className="relative">
                <HiLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
                <textarea id="addstore-address" value={form.address} onChange={update('address')} rows={2} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:bg-gray-700 dark:text-gray-100" placeholder="Store address" required />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="addstore-owner" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Store Owner</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <select id="addstore-owner" value={form.owner_id} onChange={update('owner_id')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-gray-100 ${errors.owner_id ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600'}`} aria-label="Select store owner">
                  <option value="">Select a store owner...</option>
                  {owners.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
                </select>
              </div>
              {errors.owner_id && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.owner_id}</p>}
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all shadow-md shadow-blue-200 dark:shadow-blue-900 btn-click btn-premium">
            Create Store
          </button>
        </form>
      </div>
    </div>
  );
}
