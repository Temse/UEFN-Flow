/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './lib/LanguageContext';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import LoadingScreen from './components/LoadingScreen';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) return <LoadingScreen />;

  return (
    <LanguageProvider>
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#1a1a1a', 
            color: '#fff',
            border: '1px solid #333'
          } 
        }} 
      />
      <Router>
      <div className="min-h-screen bg-ue-bg text-ue-text">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<ProjectView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    </LanguageProvider>
  );
}
