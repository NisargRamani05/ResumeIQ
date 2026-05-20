import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut, Search, ClipboardList, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

function Sidebar({ role = "user", isOpen = true }) {
  const location = useLocation();

  const userRoutes = [
    { name:"Dashboard",      path:"/dashboard",              icon:LayoutDashboard },
    { name:"My Resumes",     path:"/dashboard/resumes",      icon:FileText },
    { name:"Browse Jobs",    path:"/dashboard/jobs",         icon:Search },
    { name:"My Applications",path:"/dashboard/applications", icon:ClipboardList },
    { name:"Settings",       path:"/dashboard/settings",     icon:Settings },
  ];

  const adminRoutes = [
    { name:"Overview",       path:"/admin",                  icon:LayoutDashboard },
    { name:"Manage Jobs",    path:"/admin/jobs",             icon:Briefcase },
    { name:"Post New Job",   path:"/admin/jobs/new",         icon:Plus },
    { name:"Applications",   path:"/admin/applications",     icon:ClipboardList },
    { name:"Settings",       path:"/admin/settings",         icon:Settings },
  ];

  const routes = role === "admin" ? adminRoutes : userRoutes;

  const isActive = (path) => {
    if (path === "/dashboard" || path === "/admin") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={cn(
      "shrink-0 w-64 border-r border-[var(--border)] bg-[var(--bg-card)] flex flex-col overflow-y-auto transition-all duration-300",
      isOpen ? "" : "hidden"
    )}>
      <div className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {routes.map(route => {
            const active = isActive(route.path);
            const Icon = route.icon;
            return (
              <li key={route.path}>
                <Link to={route.path} className={cn(
                  "flex items-center p-3 rounded-xl font-medium transition-all group",
                  active
                    ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] shadow-[inset_0_0_0_1px_var(--accent-primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                )}>
                  <Icon className={cn("w-4 h-4 mr-3 transition-colors", active ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")} />
                  <span className="text-sm">{route.name}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"/>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-3 border-t border-[var(--border)]">
        <button onClick={async () => {
          const { logoutUser } = await import("../../firebase/auth");
          const { toast } = await import("react-hot-toast");
          try { await logoutUser(); toast.success("Logged out"); window.location.href = "/login"; }
          catch { toast.error("Failed to log out"); }
        }} className="w-full flex items-center p-3 rounded-xl font-medium text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors text-sm">
          <LogOut className="w-4 h-4 mr-3"/> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;