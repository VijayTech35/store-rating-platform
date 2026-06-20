import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiUser, HiOfficeBuilding, HiStar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, Area } from 'recharts';
import AnimatedCounter from '../../components/AnimatedCounter';
import Breadcrumb from '../../components/Breadcrumb';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => setError('Failed to load dashboard'));
    api.get('/admin/stores', { params: { limit: 50 } }).then(({ data }) => setStores(data.stores)).catch(() => {});
  }, []);

  if (error) return <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">{error}</div>;
  if (!stats) return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 skeleton-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1,2,3].map((i) => <div key={i} className="h-28 bg-white dark:bg-gray-800 rounded-2xl skeleton-pulse border border-gray-100 dark:border-gray-700" />)}
      </div>
    </div>
  );

  const barChartData = stores.map((s) => ({
    name: s.name.length > 12 ? s.name.slice(0, 12) + '...' : s.name,
    rating: parseFloat(s.avg_rating) || 0,
  }));

  const ratingDist = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  stores.forEach((s) => {
    const r = Math.round(parseFloat(s.avg_rating) || 0);
    if (r >= 1 && r <= 5) ratingDist[String(r)]++;
  });
  const pieData = Object.entries(ratingDist).map(([k, v]) => ({ name: `${k} Star${k > 1 ? 's' : ''}`, value: v }));

  const storeRatings = stores.map(s => parseFloat(s.avg_rating) || 0).filter(r => r > 0).sort((a,b) => a - b);
  const trendData = storeRatings.length >= 2
    ? storeRatings.map((r, i) => ({ name: `#${i + 1}`, rating: r, index: i }))
    : stores.slice(0, 7).map((s, i) => ({
        name: s.name.length > 10 ? s.name.slice(0, 10) + '...' : s.name,
        rating: parseFloat(s.avg_rating) || 0,
        index: i,
      }));

  return (
    <div className="space-y-6 fade-in">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-in-stagger">
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
              <HiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats.totalUsers} />
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/30">
              <HiOfficeBuilding className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Stores</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats.totalStores} />
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/30">
              <HiStar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Ratings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={stats.totalRatings} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {barChartData.length > 0 && (
          <div className="glass-card-gradient rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Ratings</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                  <Bar dataKey="rating" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {barChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {pieData.some((d) => d.value > 0) && (
          <div className="glass-card-gradient rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Distribution</h2>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {trendData.length > 1 && (
        <div className="glass-card-gradient rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Rating Distribution Curve</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Sorted ratings across stores</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px' }} formatter={(v) => [v.toFixed(1), 'Rating']} />
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="rating" stroke="none" fill="url(#trendGradient)" fillOpacity={1} />
                <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
