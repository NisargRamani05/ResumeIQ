import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Briefcase, Bell, Menu } from 'lucide-react';
import { cn } from '../utils/cn';

function DashboardLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <nav className="shrink-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold tracking-tight">ResumeIQ</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
            <Bell className="w-5 h-5" />
          </button>
          <Link
            to={isAdmin ? '/admin/settings' : '/dashboard/settings'}
            className="h-8 w-8 rounded-full bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 hover:ring-offset-slate-900 flex items-center justify-center font-bold text-sm transition-all text-white"
          >
            {isAdmin ? 'AD' : 'US'}
          </Link>
        </div>
      </nav>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar role={isAdmin ? 'admin' : 'user'} isOpen={isSidebarOpen} />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
