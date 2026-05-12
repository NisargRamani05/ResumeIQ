import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, FileText, CheckCircle, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { getJobs } from "../../firebase/jobs";
import { getAllApplications } from "../../firebase/applications";
import { StatCardSkeleton } from "../../components/ui/LoadingSkeleton";

function StatCard({ label, value, icon: Icon, iconColor, trend, onClick }) {
  return (
    <div onClick={onClick} className={`bg-[#0d1a2d] border border-slate-800 rounded-2xl p-5 space-y-3 ${onClick?"cursor-pointer hover:border-blue-600/40 transition-colors":""}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}><Icon className="w-4 h-4"/></div>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      {trend && <p className="text-xs text-slate-500">{trend}</p>}
    </div>
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

  const STATUS_COLOR = { Applied:"text-blue-400", Shortlisted:"text-amber-400", "Interview Scheduled":"text-purple-400", Rejected:"text-red-400", Selected:"text-emerald-400" };

  if (loading) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map(i=><StatCardSkeleton key={i}/>)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back, Admin</p>
        </div>
        <button onClick={()=>navigate("/admin/jobs/new")} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4"/> Post New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Jobs" value={stats?.jobs??0} icon={Briefcase} iconColor="bg-blue-500/15 text-blue-400" trend="All time job postings" onClick={()=>navigate("/admin/jobs")}/>
        <StatCard label="Total Applications" value={stats?.apps??0} icon={FileText} iconColor="bg-purple-500/15 text-purple-400" trend="All submissions" onClick={()=>navigate("/admin/applications")}/>
        <StatCard label="Active Openings" value={stats?.active??0} icon={TrendingUp} iconColor="bg-amber-500/15 text-amber-400" trend="Not yet expired"/>
        <StatCard label="Selected Candidates" value={stats?.selected??0} icon={CheckCircle} iconColor="bg-emerald-500/15 text-emerald-400" trend="Status: Selected"/>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Jobs */}
        <div className="bg-[#0d1a2d] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h3 className="text-white font-semibold">Recent Job Postings</h3>
            <button onClick={()=>navigate("/admin/jobs")} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">View all <ArrowRight className="w-3 h-3"/></button>
          </div>
          {recentJobs.length===0 ? (
            <p className="text-slate-500 text-sm text-center py-10">No jobs posted yet</p>
          ) : recentJobs.map(j=>(
            <div key={j.id} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-3">
                {j.logoUrl ? <img src={j.logoUrl} className="w-8 h-8 rounded-lg object-cover border border-slate-700 bg-white p-0.5" alt=""/> : <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs">{(j.companyName||"?")[0]}</div>}
                <div>
                  <p className="text-white text-sm font-medium">{j.role}</p>
                  <p className="text-slate-500 text-xs">{j.companyName}</p>
                </div>
              </div>
              <span className="text-slate-500 text-xs">{j.deadline ? new Date(j.deadline).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "No deadline"}</span>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-[#0d1a2d] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h3 className="text-white font-semibold">Recent Applications</h3>
            <button onClick={()=>navigate("/admin/applications")} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">View all <ArrowRight className="w-3 h-3"/></button>
          </div>
          {recentApps.length===0 ? (
            <p className="text-slate-500 text-sm text-center py-10">No applications yet</p>
          ) : recentApps.map(a=>(
            <div key={a.id} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition-colors">
              <div>
                <p className="text-white text-sm font-medium">{a.userName||a.userEmail||"User"}</p>
                <p className="text-slate-500 text-xs">{a.jobTitle} · {a.companyName}</p>
              </div>
              <span className={`text-xs font-semibold ${STATUS_COLOR[a.status]||"text-slate-400"}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}