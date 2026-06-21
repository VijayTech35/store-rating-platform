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
  if (!active) return <HiSelector className="w-4 h-4 text-gray-400 dark:text-mutedpurple" />;
  return direction === 'ASC' ? <HiChevronUp className="w-4 h-4 text-violet-700 dark:text-lavender" /> : <HiChevronDown className="w-4 h-4 text-violet-700 dark:text-lavender" />;
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
          <button onClick={async () => { toast.dismiss(t.id); try { await api.post('/admin/stores', { name: target.name, email: target.email, address: target.address || '', owner_id: 1 }); toast.success('Store restored'); setPage(1); } catch { toast.error('Could not restore'); } }} className="px-3 py-1 text-xs font-medium bg-violet-100 dark:bg-lavender/20 text-violet-700 dark:text-lavender rounded-lg hover:bg-lavender/30 transition-all">Undo</button>
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink">Stores</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadCSV(data.stores, 'stores', [{ label: 'Name', accessor: (s) => s.name }, { label: 'Email', accessor: (s) => s.email }, { label: 'Address', accessor: (s) => s.address }, { label: 'Rating', accessor: (s) => parseFloat(s.avg_rating).toFixed(1) }, { label: 'Ratings', accessor: (s) => s.rating_count }])} className="p-2 rounded-lg text-gray-400 dark:text-palepink/50 hover:text-violet-700 dark:text-lavender hover:bg-violet-50 dark:bg-lavender/10 transition-all" aria-label="Export CSV">
            <HiDownload className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-400 dark:text-palepink/50">{data.total} store(s)</span>
        </div>
      </div>

      <div className="relative max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-mutedpurple" aria-hidden="true" />
        <input ref={searchRef} placeholder="Search by name, email, address... (Ctrl+K)" value={search} onChange={(e) => setSearch(e.target.value)} className="glass-card w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-lavender/30 outline-none transition-shadow text-gray-900 dark:text-palepink placeholder-gray-400 dark:placeholder-palepink/30" aria-label="Search stores" />
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
                <tr className="bg-white dark:bg-deepblue/50">
                  {['name', 'email', 'address', 'avg_rating'].map((col) => (
                    <th key={col} onClick={() => toggleSort(col)} className={`px-3 sm:px-5 py-3 text-left text-xs font-semibold text-violet-500 dark:text-lavender/70 uppercase tracking-wider cursor-pointer hover:text-violet-700 dark:text-lavender select-none ${col === 'email' ? 'hidden md:table-cell' : col === 'address' ? 'hidden lg:table-cell' : ''}`}>
                      <div className="flex items-center gap-1">
                        {col === 'avg_rating' ? 'Rating' : col}
                        <SortIcon active={sortBy === col} direction={sortOrder} />
                      </div>
                    </th>
                  ))}
                  <th className="px-3 sm:px-5 py-3 text-right text-xs font-semibold text-violet-500 dark:text-lavender/70 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <hr className="divider-gradient m-0" />
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {data.stores.map((s) => (
                  <tr key={s.id} className="hover:bg-violet-50/50 dark:bg-lavender/5 transition-colors group">
                    <td className="px-3 sm:px-5 py-3 text-sm font-medium"><Link to={`/admin/stores/${s.id}`} className="text-gray-900 dark:text-palepink hover:text-violet-700 dark:text-lavender transition-colors"><Highlight text={s.name} query={debouncedSearch} /></Link></td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-600 dark:text-palepink/70 hidden md:table-cell"><Highlight text={s.email} query={debouncedSearch} /></td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-400 dark:text-palepink/50 max-w-[200px] truncate hidden lg:table-cell"><Highlight text={s.address} query={debouncedSearch} /></td>
                    <td className="px-3 sm:px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map((star) => (
                            <HiStar key={star} className={`w-4 h-4 ${star <= Math.round(parseFloat(s.avg_rating)) ? 'text-orange-500 dark:text-peach' : 'text-gray-400 dark:text-mutedpurple'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-palepink">{parseFloat(s.avg_rating).toFixed(1)}</span>
                        <span className="text-xs text-gray-400 dark:text-palepink/40">({s.rating_count})</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/admin/stores/${s.id}/edit`)} className="p-1.5 rounded-lg text-gray-400 dark:text-palepink/40 hover:text-violet-700 dark:text-lavender hover:bg-violet-50 dark:bg-lavender/10 transition-all" aria-label={`Edit ${s.name}`}>
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-gray-400 dark:text-palepink/40 hover:text-orange-500 dark:text-peach hover:bg-orange-50 dark:bg-peach/10 transition-all" aria-label={`Delete ${s.name}`}>
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="divider-gradient m-0" />
          <div className="px-3 sm:px-5 py-3">
            <Pagination page={page} totalPages={totalPages} total={data.total} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />
          </div>
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Store">
        <p className="text-sm text-gray-600 dark:text-palepink/70 mb-4">Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Its ratings will also be removed.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-navy bg-peach hover:bg-peach/90 rounded-xl transition-all shadow-sm">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
