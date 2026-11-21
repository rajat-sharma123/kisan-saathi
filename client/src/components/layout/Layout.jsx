import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import OfflineBanner from '../common/OfflineBanner';

export default function Layout({ children }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Landing page and auth pages don't need left sidebar
  const showSidebar = !isLandingPage && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-agri-bg text-agri-text">
      {/* Offline Connectivity Status Bar */}
      <OfflineBanner />

      {/* Main Top Header */}
      <Navbar />

      {/* Body Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 w-full min-w-0 ${showSidebar ? 'p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Sticky Navigation */}
      {showSidebar && <MobileBottomNav />}
    </div>
  );
}
