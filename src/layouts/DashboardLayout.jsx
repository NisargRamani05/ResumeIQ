import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Briefcase, Bell, User } from 'lucide-react';

function DashboardLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Navbar for Dashboard */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md h-16 flex items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">ResumeIQ <span className="text-sm font-normal text-slate-500 ml-2">{isAdmin ? 'Admin' : 'Dashboard'}</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            {isAdmin ? 'AD' : 'US'}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar role={isAdmin ? 'admin' : 'user'} />

      {/* Main Content Area */}
      <main className="md:ml-64 pt-16 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
