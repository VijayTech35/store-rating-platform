import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { HiSearch, HiChevronUp, HiChevronDown, HiSelector, HiChevronRight, HiPencil, HiTrash, HiDownload } from 'react-icons/hi';
import { SkeletonTable } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import Breadcrumb from '../../components/Breadcrumb';
import Avatar from '../../components/Avatar';
import Highlight from '../../components/Highlight';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import useDebounce from '../../utils/useDebounce';
import { downloadCSV } from '../../utils/csv';
import toast from 'react-hot-toast';

const roleBadge = (role) => {
  const map = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    store_owner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  };
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${map[role] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{role.replace('_', ' ')}</span>;
};

const SortIcon = ({ active, direction }) => {
  if (!active) return <HiSelector className="w-4 h-4 text-gray-300 dark:text-gray-600" />;
  return direction === 'ASC' ? <HiChevronUp className="w-4 h-4 text-blue-600" /> : <HiChevronDown className="w-4 h-4 text-blue-600" />;
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [data, setData] = useState({ users: [], total: 0 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [roleFilter, setRoleFilter] = useState('');
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
  }, [debouncedSearch, roleFilter, sortBy, sortOrder, pageSize]);

  useEffect(() => {
    setLoading(true);
    const params = { search: debouncedSearch, sortBy, sortOrder, limit: pageSize, offset: (page - 1) * pageSize };
    if (roleFilter) params.role = roleFilter;
    api.get('/admin/users', { params }).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [debouncedSearch, roleFilter, sortBy, sortOrder, page, pageSize]);

  const toggleSort = (column) => {
    if (sortBy === column) setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    else { setSortBy(column); setSortOrder('ASC'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/admin/users/${target.id}`);
      toast((t) => (
        <div className="flex items-center gap-3 text-sm">
          <span>{target.name} deleted</span>
          <button onClick={() => { toast.dismiss(t.id); setPage(1); }} className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Dismiss</button>
        </div>
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const totalPages = Math.ceil(data.total / pageSize);

  return (
    <div className="space-y-5 fade-in">
      <Breadcrumb items={[{ to: '/admin', label: 'Dashboard' }, { label: 'Users' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadCSV(data.users, 'users', [{ label: 'Name', accessor: (u) => u.name }, { label: 'Email', accessor: (u) => u.email }, { label: 'Address', accessor: (u) => u.address }, { label: 'Role', accessor: (u) => u.role }])} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" aria-label="Export CSV">
            <HiDownload className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">{data.total} user(s)</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          <input ref={searchRef} placeholder="Search by name, email, address... (Ctrl+K)" value={search} onChange={(e) => setSearch(e.target.value)} className="glass-card w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" aria-label="Search users" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="glass-card px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" aria-label="Filter by role">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </div>

      {loading ? <SkeletonTable rows={6} cols={4} /> : data.users.length === 0 ? (
        <div className="glass-card-gradient rounded-2xl">
          <EmptyState title="No users found" message="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="glass-card-gradient rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  {['name', 'email', 'address', 'role'].map((col) => (
                    <th key={col} onClick={() => toggleSort(col)} className={`px-3 sm:px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none ${col === 'email' ? 'hidden md:table-cell' : col === 'address' ? 'hidden lg:table-cell' : ''}`}>
                      <div className="flex items-center gap-1">
                        {col}
                        <SortIcon active={sortBy === col} direction={sortOrder} />
                      </div>
                    </th>
                  ))}
                  <th className="px-3 sm:px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {data.users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-3 sm:px-5 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="xs" />
                        <span className="text-gray-900 dark:text-white font-medium"><Highlight text={u.name} query={debouncedSearch} /></span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell"><Highlight text={u.email} query={debouncedSearch} /></td>
                    <td className="px-3 sm:px-5 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate hidden lg:table-cell"><Highlight text={u.address} query={debouncedSearch} /></td>
                    <td className="px-3 sm:px-5 py-3">{roleBadge(u.role)}</td>
                    <td className="px-3 sm:px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${u.id}/edit`); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" aria-label={`Edit ${u.name}`}>
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(u); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" aria-label={`Delete ${u.name}`}>
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

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Their ratings will also be removed.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
