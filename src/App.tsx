import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Index } from './pages/Index';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { ServicePage } from './pages/ServicePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/accounts" element={<ServicePage />} />
            <Route path="/dashboard/cards" element={<ServicePage />} />
            <Route path="/dashboard/transactions" element={<ServicePage />} />
            <Route path="/dashboard/investments" element={<ServicePage />} />
            <Route path="/dashboard/loans" element={<ServicePage />} />
            <Route path="/dashboard/insurance" element={<ServicePage />} />
            <Route path="/dashboard/payments" element={<ServicePage />} />
            <Route path="/dashboard/services/*" element={<ServicePage />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
