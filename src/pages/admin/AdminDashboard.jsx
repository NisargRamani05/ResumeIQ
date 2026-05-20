import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Briefcase, FileText, CheckCircle, TrendingUp, Plus, ArrowRight, Activity, Search } from "lucide-react";
import { getJobs } from "../../firebase/jobs";
import { getAllApplications } from "../../firebase/applications";

function StatCard({ label, value, icon: Icon, color, trend, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-[var(--accent-primary)]/50 transition-all hover:scale-[1.02]"
    >
      <div className="absolute -right-6 -top-6 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
        <Icon className="w-32 h-32" style={{ color }} />
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-wider">{label}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
          <Icon className="w-5 h-5"/>
        </div>
      </div>
      <p className="text-4xl font-display font-bold text-[var(--text-primary)] relative z-10">{value}</p>
      {trend && (
        <p className="text-xs text-[var(--text-muted)] mt-2 font-semibold flex items-center gap-1.5 relative z-10">
          <TrendingUp className="w-3 h-3" style={{ color }} /> {trend}
        </p>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [jobs, apps] = await Promise.all([getJobs(), getAllApplications()]);
        const now = new Date();
        const active = jobs.filter(j => !j.deadline || new Date(j.deadline) >= now);
        const selected = apps.filter(a => a.status === "Selected");
        setStats({ jobs: jobs.length, apps: apps.length, active: active.length, selected: selected.length });
        setRecentJobs(jobs.slice(0,5));
        setRecentApps(apps.slice(0,5));
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const fmt = (ts) => { if (!ts) return "—"; const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleDateString("en-IN",{day:"numeric",month:"short"}); };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': return 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20';
      case 'Shortlisted': return 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20';
      case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Selected': return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      default: return 'text-[var(--text-muted)] bg-[var(--bg-secondary)] border-[var(--border)]';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-[var(--bg-secondary)] rounded-lg animate-pulse border border-[var(--border)]" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-36 glass-card rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] tracking-tight">Admin Console</h1>
          <p className="text-[var(--text-muted)] mt-1 font-medium">Platform overview and statistics</p>
        </div>
        <button 
          onClick={()=>navigate("/admin/jobs/new")} 
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 shadow-[var(--glow)]"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 relative z-10">
        <StatCard delay={0.1} label="Total Jobs" value={stats?.jobs??0} icon={Briefcase} color="var(--accent-primary)" trend="All time job postings" onClick={()=>navigate("/admin/jobs")}/>
        <StatCard delay={0.2} label="Applications" value={stats?.apps??0} icon={FileText} color="var(--accent-secondary)" trend="All submissions" onClick={()=>navigate("/admin/applications")}/>
        <StatCard delay={0.3} label="Active Openings" value={stats?.active??0} icon={Activity} color="#eab308" trend="Not yet expired"/>
        <StatCard delay={0.4} label="Hired Candidates" value={stats?.selected??0} icon={CheckCircle} color="#10b981" trend="Status: Selected"/>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 relative z-10">
        {/* Recent Jobs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-lg"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Active Postings</h3>
            <button onClick={()=>navigate("/admin/jobs")} className="text-sm font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5"/></button>
          </div>
          <div className="flex-1 bg-[var(--bg-primary)]/50">
            {recentJobs.length===0 ? (
              <p className="text-[var(--text-muted)] text-sm font-semibold text-center py-10">No jobs posted yet</p>
            ) : recentJobs.map((j, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                key={j.id} 
                className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                onClick={()=>navigate(`/admin/jobs/${j.id}/edit`)}
              >
                <div className="flex items-center gap-4">
                  {j.logoUrl ? (
                    <img src={j.logoUrl} className="w-10 h-10 rounded-xl object-cover border border-[var(--border)] bg-[var(--bg-card)] p-0.5 shadow-sm" alt=""/>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-display font-bold text-lg shadow-sm">
                      {(j.companyName||"?")[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-[var(--text-primary)] font-bold">{j.role}</p>
                    <p className="text-[var(--text-muted)] text-xs font-semibold mt-0.5">{j.companyName}</p>
                  </div>
                </div>
                <span className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider bg-[var(--bg-secondary)] px-3 py-1.5 rounded-md border border-[var(--border)] shadow-sm">
                  {j.deadline ? new Date(j.deadline).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "No deadline"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Applications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl overflow-hidden flex flex-col shadow-lg"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Recent Applicants</h3>
            <button onClick={()=>navigate("/admin/applications")} className="text-sm font-bold text-[var(--accent-primary)] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5"/></button>
          </div>
          <div className="flex-1 bg-[var(--bg-primary)]/50">
            {recentApps.length===0 ? (
              <p className="text-[var(--text-muted)] text-sm font-semibold text-center py-10">No applications yet</p>
            ) : recentApps.map((a, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
                key={a.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] font-display font-bold shadow-sm">
                    {(a.userName||a.userEmail||"U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-bold">{a.userName||a.userEmail||"User"}</p>
                    <p className="text-[var(--text-muted)] text-xs font-medium mt-0.5 truncate max-w-[200px]">{a.jobTitle} · {a.companyName}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-bold border shadow-sm ${getStatusColor(a.status)}`}>
                    {a.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}