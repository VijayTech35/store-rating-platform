import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { HiSearch, HiChevronUp, HiChevronDown, HiSelector, HiStar, HiPencil, HiTrash, HiDownload } from 'react-icons/hi';
import { SkeletonTable } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import Breadcrumb from '../../components/Breadcrumb';
import Highlight from '../../components/Highlight';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import useDebounce from '../../utils/useDebounce';
import { downloadCSV } from '../../utils/csv';
import toast from 'react-hot-toast';

const SortIcon = ({ active, direction }) => {
  if (!active) return <HiSelector className="w-4 h-4 text-gray-300 dark:text-gray-600" />;
  return direction === 'ASC' ? <HiChevronUp className="w-4 h-4 text-blue-600" /> : <HiChevronDown className="w-4 h-4 text-blue-600" />;
};

export default function AdminStores() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [data, setData] = useState({ stores: [], total: 0 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortOrder, pageSize]);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/stores', { params: { search: debouncedSearch, sortBy, sortOrder, limit: pageSize, offset: (page - 1) * pageSize } }).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [debouncedSearch, sortBy, sortOrder, page, pageSize]);

  const toggleSort = (column) => {
    if (sortBy === column) setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    else { setSortBy(column); setSortOrder('ASC'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/admin/stores/${target.id}`);
      toast((t) => (
        <div className="flex items-center gap-3 text-sm">
          <span>{target.name} deleted</span>
          <button onClick={async () => { toast.dismiss(t.id); try { await api.post('/admin/stores', { name: target.name, email: target.email, address: target.address || '', owner_id: 1 }); toast.success('Store restored'); setPage(1); } catch { toast.error('Could not restore'); } }} className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-all">Undo</button>
        </div>
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete store');
    }
  };

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div className="space-y-5 fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { label: 'Stores' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stores</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadCSV(data.stores, 'stores', [{ label: 'Name', accessor: (s) => s.name }, { label: 'Email', accessor: (s) => s.email }, { label: 'Address', accessor: (s) => s.address }, { label: 'Rating', accessor: (s) => parseFloat(s.avg_rating).toFixed(1) }, { label: 'Ratings', accessor: (s) => s.rating_count }])} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" aria-label="Export CSV">
            <HiDownload className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">{data.total} store(s)</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
        <input ref={searchRef} placeholder="Search by name, email, address... (Ctrl+K)" value={search} onChange={(e) => setSearch(e.target.value)} className="glass-card w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" aria-label="Search stores" />
      </div>

      {loading ? <SkeletonTable rows={6} cols={5} /> : data.stores.length === 0 ? (
        <div className="glass-card-gradient rounded-2xl">
          <EmptyState title="No stores found" message="Try adjusting your search." />
        </div>
      ) : (
        <div className="glass-card-gradient rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  {['name', 'email', 'address', 'avg_rating'].map((col) => (
                    <th key={col} onClick={() => toggleSort(col)} className={`px-3 sm:px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none ${col === 'email' ? 'hidden md:table-cell' : col === 'address' ? 'hidden lg:table-cell' : ''}`}>
                      <div className="flex items-center gap-1">
                        {col === 'avg_rating' ? 'Rating' : col}
                        <SortIcon active={sortBy === col} direction={sortOrder} />
                      </div>
                    </th>
                  ))}
                  <th className="px-3 sm:px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {data.stores.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-3 sm:px-5 py-3 text-sm font-medium"><Link to={`/admin/stores/${s.id}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Highlight text={s.name} query={debouncedSearch} /></Link></td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell"><Highlight text={s.email} query={debouncedSearch} /></td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate hidden lg:table-cell"><Highlight text={s.address} query={debouncedSearch} /></td>
                    <td className="px-3 sm:px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1,2,3,4,5].map((star) => (
                            <HiStar key={star} className={`w-4 h-4 ${star <= Math.round(parseFloat(s.avg_rating)) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{parseFloat(s.avg_rating).toFixed(1)}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">({s.rating_count})</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/admin/stores/${s.id}/edit`)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" aria-label={`Edit ${s.name}`}>
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" aria-label={`Delete ${s.name}`}>
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-700">
            <Pagination page={page} totalPages={totalPages} total={data.total} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Store">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Its ratings will also be removed.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
