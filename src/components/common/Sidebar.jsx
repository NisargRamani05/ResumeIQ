import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings, Users, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';

function Sidebar({ role = 'user' }) {
  const location = useLocation();

  const userRoutes = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', path: '/dashboard/resumes', icon: FileText },
    { name: 'Job Tracker', path: '/dashboard/jobs', icon: Briefcase },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const adminRoutes = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const routes = role === 'admin' ? adminRoutes : userRoutes;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-900/95 backdrop-blur-md pt-16 flex flex-col hidden md:flex">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {routes.map((route) => {
            const isActive = location.pathname === route.path;
            const Icon = route.icon;
            return (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg font-medium transition-colors group",
                    isActive 
                      ? "bg-blue-600/10 text-blue-500" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mr-3 transition-colors",
                    isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  {route.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 border-t border-slate-800">
        <Link 
          to="/login"
          className="flex items-center p-3 rounded-lg font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
