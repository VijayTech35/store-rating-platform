import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import Avatar from './Avatar';
import { HiMenu, HiX, HiLogout, HiUser, HiHome, HiOfficeBuilding, HiCollection, HiKey, HiSun, HiMoon, HiStar, HiCog } from 'react-icons/hi';

const navLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: HiHome },
    { to: '/admin/users', label: 'Users', icon: HiUser },
    { to: '/admin/stores', label: 'Stores', icon: HiOfficeBuilding },
    { to: '/admin/add-user', label: 'Add User', icon: HiCollection },
    { to: '/admin/add-store', label: 'Add Store', icon: HiOfficeBuilding },
    { to: '/admin/change-password', label: 'Security', icon: HiKey },
  ],
  user: [
    { to: '/user', label: 'Stores', icon: HiOfficeBuilding },
    { to: '/user/change-password', label: 'Security', icon: HiKey },
  ],
  store_owner: [
    { to: '/owner', label: 'Dashboard', icon: HiHome },
    { to: '/owner/change-password', label: 'Security', icon: HiKey },
  ],
};

const roleColors = {
  admin: 'bg-violet-100 dark:bg-lavender/20 text-violet-700 dark:text-lavender ring-1 ring-violet-200 dark:ring-lavender/30',
  user: 'bg-orange-100 dark:bg-peach/20 text-orange-500 dark:text-peach ring-1 ring-orange-200 dark:ring-peach/30',
  store_owner: 'bg-pink-100 dark:bg-palepink/20 text-gray-900 dark:text-palepink ring-1 ring-pink-200 dark:ring-palepink/30',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const links = navLinks[user.role] || [];
  const homePath = user.role === 'admin' ? '/admin' : user.role === 'store_owner' ? '/owner' : '/user';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav" role="navigation" aria-label="Main navigation">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lavender/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo linkTo={homePath} />

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-100/50 dark:bg-lavender/15 text-violet-700 dark:text-lavender shadow-sm nav-link-active'
                      : 'text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

            <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl text-gray-400 dark:text-palepink/50 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 transition-all theme-toggle"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5 text-sm border-l border-gray-200 dark:border-white/10 pl-3 ml-1">
              <Avatar name={user.name} size="sm" />
              <span className="text-gray-700 dark:text-palepink/80 font-medium truncate max-w-[100px]">{user.name}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${roleColors[user.role]}`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <Link to={`/${user.role}/profile`} className="p-2.5 rounded-xl text-gray-400 dark:text-palepink/50 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 transition-all" aria-label="Profile settings">
              <HiCog className="w-5 h-5" />
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-400 dark:text-palepink/50 hover:text-orange-500 dark:hover:text-peach hover:bg-orange-50 dark:hover:bg-peach/10 rounded-xl transition-all btn-click" aria-label="Logout">
              <HiLogout className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          <button className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <HiX className="w-6 h-6 text-gray-900 dark:text-palepink" /> : <HiMenu className="w-6 h-6 text-gray-900 dark:text-palepink" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-navy/95 backdrop-blur-lg slide-down slide-in-right">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-violet-100/50 dark:bg-lavender/15 text-violet-700 dark:text-lavender' : 'text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <hr className="divider-gradient my-2" />
            <button onClick={toggle} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">
              {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              {dark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link to={`/${user.role}/profile`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 dark:text-palepink/60 hover:text-gray-900 dark:text-palepink hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all">
              <HiCog className="w-5 h-5" /> Profile Settings
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 dark:text-palepink/50">
              <Avatar name={user.name} size="sm" />
              <span className="font-medium text-gray-700 dark:text-palepink/80">{user.name}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roleColors[user.role]}`}>{user.role.replace('_', ' ')}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-orange-500 dark:text-peach hover:bg-orange-50 dark:bg-peach/10 rounded-xl transition-all btn-click">
              <HiLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
