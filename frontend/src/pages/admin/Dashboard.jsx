import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiUser, HiOfficeBuilding, HiStar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, Area } from 'recharts';
import AnimatedCounter from '../../components/AnimatedCounter';
import Breadcrumb from '../../components/Breadcrumb';
import Sparkline from '../../components/Sparkline';

const COLORS = ['#AE7DAC', '#F1916D', '#F3DADF', '#413B61', '#19305C'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data)).catch(() => setError('Failed to load dashboard'));
    api.get('/admin/stores', { params: { limit: 50 } }).then(({ data }) => setStores(data.stores)).catch(() => {});
  }, []);

  if (error) return <div className="bg-orange-50 dark:bg-peach/10 border border-peach/20 text-orange-500 dark:text-peach rounded-xl p-4 text-sm">{error}</div>;
  if (!stats) return (
    <div className="space-y-6">
        <div className="h-8 rounded-lg w-64 skeleton-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1,2,3].map((i) => <div key={i} className="h-28 rounded-2xl skeleton-pulse" />)}
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

  const sparklineData = stores.length > 1
    ? stores.map(s => parseFloat(s.avg_rating) || 0).filter(r => r > 0)
    : [2.5, 3.1, 2.8, 3.5, 3.2, 3.8, 3.6, 4.0, 3.7, 4.2];

  return (
    <div className="space-y-6 fade-in">
      <Breadcrumb items={[{ label: 'Dashboard' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink">Admin Dashboard</h1>
        <span className="text-sm text-gray-400 dark:text-palepink/50">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-in-up-stagger">
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-lavender to-mutedpurple rounded-xl flex items-center justify-center shadow-lg shadow-lavender/20 metric-icon">
              <HiUser className="w-6 h-6 text-navy" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-violet-500 dark:text-lavender/70 font-medium">Total Users</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-palepink">
                  <AnimatedCounter value={stats.totalUsers} />
                </p>
                <Sparkline data={sparklineData.slice(0, 8)} color="#AE7DAC" />
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-peach to-mutedpurple rounded-xl flex items-center justify-center shadow-lg shadow-peach/20 metric-icon">
              <HiOfficeBuilding className="w-6 h-6 text-navy" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-violet-500 dark:text-lavender/70 font-medium">Total Stores</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-palepink">
                  <AnimatedCounter value={stats.totalStores} />
                </p>
                <Sparkline data={sparklineData.slice(2, 10)} color="#F1916D" />
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card-gradient rounded-2xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-palepink to-lavender rounded-xl flex items-center justify-center shadow-lg shadow-palepink/20 metric-icon">
              <HiStar className="w-6 h-6 text-navy" />
            </div>
              <div className="flex-1">
              <p className="text-sm text-violet-500 dark:text-lavender/70 font-medium">Total Ratings</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-palepink">
                  <AnimatedCounter value={stats.totalRatings} />
                </p>
                <Sparkline data={sparklineData} color="#AE7DAC" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider-gradient my-2" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in-up-stagger">
        {barChartData.length > 0 && (
          <div className="glass-card-gradient rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-lavender to-peach" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">Store Ratings</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,125,172,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#AE7DAC' }} angle={-20} textAnchor="end" />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#AE7DAC' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(174,125,172,0.2)', fontSize: '13px', background: 'rgba(25,48,92,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', color: '#F3DADF' }} />
                  <Bar dataKey="rating" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    {barChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {pieData.some((d) => d.value > 0) && (
          <div className="glass-card-gradient rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-peach to-palepink" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">Rating Distribution</h2>
            </div>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(174,125,172,0.2)', fontSize: '13px', background: 'rgba(25,48,92,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', color: '#F3DADF' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {trendData.length > 1 && (
        <div className="glass-card-gradient rounded-2xl p-6 fade-in-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-mutedpurple to-lavender" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-palepink">Rating Distribution Curve</h2>
          </div>
          <p className="text-xs text-gray-400 dark:text-palepink/50 mb-4 ml-[22px]">Sorted ratings across stores</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(174,125,172,0.08)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#AE7DAC' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: '#AE7DAC' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(174,125,172,0.2)', fontSize: '13px', background: 'rgba(25,48,92,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', color: '#F3DADF' }} formatter={(v) => [v.toFixed(1), 'Rating']} />
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#AE7DAC" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#AE7DAC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="rating" stroke="none" fill="url(#trendGradient)" fillOpacity={1} />
                <Line type="monotone" dataKey="rating" stroke="#AE7DAC" strokeWidth={2.5} dot={{ r: 4, fill: '#AE7DAC', stroke: '#03122F', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#AE7DAC', stroke: '#03122F', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
