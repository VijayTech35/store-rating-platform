import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiMail, HiLockClosed, HiUser, HiLocationMarker, HiEye, HiEyeOff, HiSun, HiMoon } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const PASSWORD_REQUIREMENTS = [
  { label: '8-16 characters', test: (pw) => pw.length >= 8 && pw.length <= 16 },
  { label: 'At least 1 uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'At least 1 special character', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (form.name.length < 20 || form.name.length > 60) errs.name = 'Must be 20-60 characters';
    if (form.address.length > 400) errs.address = 'Max 400 characters';
    if (form.password.length < 8 || form.password.length > 16) errs.password = 'Must be 8-16 characters';
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Need 1 uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) errs.password = 'Need 1 special character';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signup(form);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin' : user.role === 'store_owner' ? '/owner' : '/user');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-lg fade-in">
        <div className="glass-card-gradient rounded-2xl p-8">
          <div className="text-center mb-8 relative">
            <button onClick={toggle} className="absolute -top-2 right-0 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <div className="flex justify-center mb-4">
              <Logo size="large" showText={false} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join VibeRate today</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-3">Your vibe, your rating.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="signup-name" type="text" value={form.name} onChange={update('name')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow dark:bg-gray-700 dark:text-gray-100 ${errors.name ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`} placeholder="Enter your full name (20-60 chars)" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'signup-name-error' : undefined} />
              </div>
              <div className="flex items-center justify-between">
                {errors.name && <p id="signup-name-error" className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
                <span className={`text-xs ml-auto mt-1 ${form.name.length < 20 ? 'text-gray-400 dark:text-gray-500' : form.name.length <= 60 ? 'text-emerald-500' : 'text-red-500'}`}>{form.name.length}/60</span>
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="signup-email" type="email" value={form.email} onChange={update('email')} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow dark:bg-gray-700 dark:text-gray-100 ${errors.email ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`} placeholder="you@example.com" required autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'signup-email-error' : undefined} />
              </div>
              {errors.email && <p id="signup-email-error" className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="signup-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
              <div className="relative">
                <HiLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
                <textarea id="signup-address" value={form.address} onChange={update('address')} rows={2} className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none dark:bg-gray-700 dark:text-gray-100 ${errors.address ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`} placeholder="Enter your address" required aria-invalid={!!errors.address} aria-describedby={errors.address ? 'signup-address-error' : undefined} />
              </div>
              <div className="flex items-center justify-between">
                {errors.address && <p id="signup-address-error" className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.address}</p>}
                <span className={`text-xs ml-auto mt-1 ${form.address.length <= 400 ? 'text-gray-400 dark:text-gray-500' : 'text-red-500'}`}>{form.address.length}/400</span>
              </div>
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                <input id="signup-password" type={showPw ? 'text' : 'password'} value={form.password} onChange={update('password')} className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow dark:bg-gray-700 dark:text-gray-100 ${errors.password ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}`} placeholder="Create a strong password" required autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby="password-requirements" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              <div id="password-requirements" className="mt-2 space-y-1">
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <div key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${req.test(form.password) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${req.test(form.password) ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {req.test(form.password) ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
                    </svg>
                    {req.label}
                  </div>
                ))}
              </div>
              {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1" role="alert">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-60 transition-all shadow-md shadow-blue-200 dark:shadow-blue-900 btn-click btn-premium mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
