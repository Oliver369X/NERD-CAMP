import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useWalletStore } from './stores/walletStore';
import { useToastStore } from './stores/toastStore';
import Layout from './components/layout/Layout';
import ToastContainer from './components/ui/ToastContainer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PasanakusExplore from './pages/PasanakusExplore';
import PasanakuDetails from './pages/PasanakuDetails';
import CreatePasanaku from './pages/CreatePasanaku';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();
  const { checkForExistingSession } = useWalletStore();
  const { toasts, removeToast } = useToastStore();

  // Check if user already has an active session
  useEffect(() => {
    checkForExistingSession();
  }, [checkForExistingSession]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Landing />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<PasanakusExplore />} />
            <Route path="/pasanaku/:id" element={<PasanakuDetails />} />
            <Route path="/create" element={<CreatePasanaku />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default App;