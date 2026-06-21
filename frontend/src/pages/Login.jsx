import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiSun, HiMoon } from 'react-icons/hi';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#AE7DAC', '#F1916D', '#F3DADF'] });
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'store_owner' ? '/owner' : '/user');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="glass-card-gradient rounded-2xl p-8">
            <div className="flex justify-center mb-8">
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl skeleton-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full skeleton-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 skeleton-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full skeleton-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md fade-in">
        <div className="glass-card-gradient rounded-2xl p-8">
          <div className="text-center mb-8 relative">
            <button onClick={toggle} className="absolute -top-2 right-0 p-2 rounded-xl text-gray-400 dark:text-palepink/40 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 transition-all" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <div className="flex justify-center mb-4">
              <Logo size="large" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-palepink">Welcome back</h1>
            <p className="text-gray-500 dark:text-palepink/60 text-sm mt-1">Sign in to your account</p>
            <p className="text-xs text-lavender/50 italic mt-3">Your vibe, your rating.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-600 dark:text-palepink/70 mb-1.5">Email</label>
              <div className="relative gradient-focus rounded-xl">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-palepink/40" aria-hidden="true" />
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink rounded-xl text-sm outline-none transition-shadow placeholder-gray-400 dark:placeholder-palepink/30" placeholder="you@example.com" required autoComplete="email" aria-label="Email address" />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-600 dark:text-palepink/70 mb-1.5">Password</label>
              <div className="relative gradient-focus rounded-xl">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-palepink/40" aria-hidden="true" />
                <input id="login-password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-deepblue/50 text-gray-900 dark:text-palepink rounded-xl text-sm outline-none transition-shadow placeholder-gray-400 dark:placeholder-palepink/30" placeholder="Enter your password" required autoComplete="current-password" aria-label="Password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-lavender to-peach text-navy font-semibold rounded-xl text-sm hover:brightness-110 focus:ring-2 focus:ring-lavender focus:ring-offset-2 disabled:opacity-60 transition-all shadow-md shadow-lavender/20 btn-click btn-premium" aria-label="Sign in to your account">
              Sign in
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-palepink/70 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 dark:text-peach font-medium hover:text-gray-900 dark:text-palepink transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
