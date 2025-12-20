import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Skeleton } from './components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const ServicePage = lazy(() => import('./pages/ServicePage').then(module => ({ default: module.ServicePage })));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage').then(module => ({ default: module.TransactionsPage })));
const FixedDeposits = lazy(() => import('./pages/FixedDeposits').then(module => ({ default: module.FixedDeposits })));
const Accounts = lazy(() => import('./pages/Accounts').then(module => ({ default: module.Accounts })));
const Cards = lazy(() => import('./pages/Cards').then(module => ({ default: module.Cards })));
const Loans = lazy(() => import('./pages/Loans').then(module => ({ default: module.Loans })));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile').then(module => ({ default: module.CustomerProfile })));
const NotFound = lazy(() => import('./pages/NotFound')); // Already default export

// Loading fallback component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-nmb-smoke">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route path="/dashboard/accounts" element={<Accounts />} />
                <Route path="/dashboard/cards" element={<Cards />} />
                <Route path="/dashboard/transactions" element={<TransactionsPage />} />
                <Route path="/dashboard/fixed-deposits" element={<FixedDeposits />} />
                <Route path="/dashboard/investments" element={<ServicePage />} />
                <Route path="/dashboard/loans" element={<Loans />} />
                <Route path="/profile" element={<CustomerProfile />} />
                <Route path="/dashboard/insurance" element={<ServicePage />} />
                <Route path="/dashboard/payments" element={<ServicePage />} />
                <Route path="/dashboard/services/*" element={<ServicePage />} />
                <Route path="/services/:slug" element={<ServicePage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
