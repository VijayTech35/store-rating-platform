import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminStores = lazy(() => import('./pages/admin/Stores'));
const AdminStoreDetail = lazy(() => import('./pages/admin/StoreDetail'));
const AdminAddUser = lazy(() => import('./pages/admin/AddUser'));
const AdminAddStore = lazy(() => import('./pages/admin/AddStore'));
const AdminUserDetail = lazy(() => import('./pages/admin/UserDetail'));
const AdminEditUser = lazy(() => import('./pages/admin/EditUser'));
const AdminEditStore = lazy(() => import('./pages/admin/EditStore'));
const UserStores = lazy(() => import('./pages/user/Stores'));
const UserChangePassword = lazy(() => import('./pages/user/ChangePassword'));
const UserProfile = lazy(() => import('./pages/user/Profile'));
const OwnerDashboard = lazy(() => import('./pages/owner/Dashboard'));
const OwnerChangePassword = lazy(() => import('./pages/owner/ChangePassword'));
const UserStoreDetail = lazy(() => import('./pages/user/StoreDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LazyLoad({ children }) {
  return <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-lavender/30 border-t-lavender rounded-full" role="status"><span className="sr-only">Loading...</span></div></div>}>{children}</Suspense>;
}

function PageContent() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <ErrorBoundary>
      <Routes>
        <Route path="/login" element={user ? <RedirectBasedOnRole role={user.role} /> : <LazyLoad><Login /></LazyLoad>} />
        <Route path="/signup" element={user ? <RedirectBasedOnRole role={user.role} /> : <LazyLoad><Signup /></LazyLoad>} />
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminDashboard /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminUsers /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/users/:id" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminUserDetail /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/users/:id/edit" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminEditUser /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/stores" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminStores /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/stores/:id" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminStoreDetail /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/stores/:id/edit" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminEditStore /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/add-user" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminAddUser /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/add-store" element={<PrivateRoute roles={['admin']}><LazyLoad><AdminAddStore /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/profile" element={<PrivateRoute roles={['admin']}><LazyLoad><UserProfile /></LazyLoad></PrivateRoute>} />
        <Route path="/admin/change-password" element={<PrivateRoute roles={['admin']}><LazyLoad><UserChangePassword /></LazyLoad></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute roles={['user']}><LazyLoad><UserStores /></LazyLoad></PrivateRoute>} />
        <Route path="/user/profile" element={<PrivateRoute roles={['user']}><LazyLoad><UserProfile /></LazyLoad></PrivateRoute>} />
        <Route path="/user/change-password" element={<PrivateRoute roles={['user']}><LazyLoad><UserChangePassword /></LazyLoad></PrivateRoute>} />
        <Route path="/stores/:id" element={<PrivateRoute roles={['user']}><LazyLoad><UserStoreDetail /></LazyLoad></PrivateRoute>} />
        <Route path="/owner" element={<PrivateRoute roles={['store_owner']}><LazyLoad><OwnerDashboard /></LazyLoad></PrivateRoute>} />
        <Route path="/owner/profile" element={<PrivateRoute roles={['store_owner']}><LazyLoad><UserProfile /></LazyLoad></PrivateRoute>} />
        <Route path="/owner/change-password" element={<PrivateRoute roles={['store_owner']}><LazyLoad><OwnerChangePassword /></LazyLoad></PrivateRoute>} />
        <Route path="/404" element={<LazyLoad><NotFound /></LazyLoad>} />
        <Route path="*" element={user ? <LazyLoad><NotFound /></LazyLoad> : <Navigate to="/login" replace />} />
      </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-lavender/20 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-gray-400 dark:border-lavender border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy transition-colors relative">
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />
      <div className="orb orb-4" aria-hidden="true" />
      <a href="#main-content" id="skip-link" className="sr-only focus:not-sr-only">Skip to main content</a>
      <Navbar />
      <main id="main-content" className={user ? 'pt-20 pb-10 relative z-10' : 'relative z-10'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageContent />
        </div>
      </main>
    </div>
  );
}

function RedirectBasedOnRole({ role }) {
  const path = role === 'admin' ? '/admin' : role === 'store_owner' ? '/owner' : '/user';
  return <Navigate to={path} replace />;
}
