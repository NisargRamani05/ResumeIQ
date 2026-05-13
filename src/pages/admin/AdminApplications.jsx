import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, ExternalLink, Filter, Loader } from "lucide-react";
import { getAllApplications, updateApplicationStatus } from "../../firebase/applications";
import { getJobs } from "../../firebase/jobs";
import StatusBadge from "../../components/jobs/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { TableRowSkeleton } from "../../components/ui/LoadingSkeleton";
import ResumeViewerModal from "../../components/admin/ResumeViewerModal";
import InterviewScheduleModal from "../../components/admin/InterviewScheduleModal";
import toast from "react-hot-toast";

const STATUSES = ["Applied","Shortlisted","Interview Scheduled","Rejected","Selected"];

export default function AdminApplications() {
  const location = useLocation();
  const prefilterJob = new URLSearchParams(location.search).get("job") || "";

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterJob, setFilterJob] = useState(prefilterJob);
  const [filterStatus, setFilterStatus] = useState("");
  const [updating, setUpdating] = useState(null);
  const [viewingResumeId, setViewingResumeId] = useState(null);
  const [schedulingApp, setSchedulingApp] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [apps, jobList] = await Promise.all([getAllApplications(), getJobs()]);
      setApplications(apps);
      setJobs(jobList);
    } catch (err) { 
      console.error(err);
      toast.error(err.message?.includes("permission") ? "Permission Denied: Update Firestore Rules" : "Failed to load applications"); 
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (appId, newStatus) => {
    if (newStatus === "Interview Scheduled") {
      setSchedulingApp({ appId, newStatus });
      return;
    }
    await processStatusUpdate(appId, newStatus, null);
  };

  const processStatusUpdate = async (appId, newStatus, interviewDate = null) => {
    setUpdating(appId);
    try {
      await updateApplicationStatus(appId, newStatus, interviewDate);
      setApplications(p => p.map(a => a.id===appId ? {...a, status:newStatus, interviewDate: interviewDate || a.interviewDate} : a));
      toast.success("Status updated");
    } catch { toast.error("Failed to update status"); }
    finally { setUpdating(null); }
  };

  const filtered = applications.filter(a => {
    const matchSearch = !search || a.userName?.toLowerCase().includes(search.toLowerCase()) || a.userEmail?.toLowerCase().includes(search.toLowerCase()) || a.jobTitle?.toLowerCase().includes(search.toLowerCase());
    const matchJob = !filterJob || a.jobId === filterJob;
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchJob && matchStatus;
  });

  const fmt = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Applications</h1>
        <p className="text-slate-400 text-sm mt-0.5">{applications.length} total application{applications.length!==1?"s":""}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email or role..." className="w-full bg-[#0d1a2d] border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white outline-none placeholder-slate-500 focus:border-blue-500 transition-colors"/>
        </div>
        <select value={filterJob} onChange={e=>setFilterJob(e.target.value)} className="bg-[#0d1a2d] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 min-w-[180px]">
          <option value="">All Jobs</option>
          {jobs.map(j=><option key={j.id} value={j.id}>{j.role} — {j.companyName}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-[#0d1a2d] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 min-w-[150px]">
          <option value="">All Statuses</option>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0d1a2d] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-slate-800 bg-slate-900/60">
              <tr>
                {["Applicant","Position","Applied On","Resume","Status","Update"].map(h=>(
                  <th key={h} className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:5}).map((_,i)=><TableRowSkeleton key={i} cols={6}/>) : filtered.length===0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-slate-500">No applications found</td></tr>
              ) : filtered.map(app=>(
                <tr key={app.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-white font-medium">{app.userName||"—"}</p>
                      <p className="text-slate-500 text-xs">{app.userEmail||"—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-slate-200 font-medium">{app.jobTitle||"—"}</p>
                      <p className="text-slate-500 text-xs">{app.companyName||"—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{fmt(app.appliedAt)}</td>
                  <td className="px-5 py-4">
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium" onClick={e=>e.stopPropagation()}>
                        <ExternalLink className="w-3.5 h-3.5"/> Open File
                      </a>
                    ) : app.resumeId ? (
                      <button onClick={() => setViewingResumeId(app.resumeId)} className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-medium">
                        <ExternalLink className="w-3.5 h-3.5"/> View Resume
                      </button>
                    ) : <span className="text-slate-600 text-xs">No file</span>}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={app.status}/>
                    {app.status === "Interview Scheduled" && app.interviewDate && (
                      <div className="text-[10px] text-blue-300 mt-1 whitespace-nowrap bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 inline-block">
                        {app.interviewDate}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={e=>handleStatusChange(app.id, e.target.value)}
                        disabled={updating===app.id}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                      {updating===app.id && <Loader className="w-3.5 h-3.5 text-blue-400 animate-spin"/>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {viewingResumeId && (
        <ResumeViewerModal resumeId={viewingResumeId} onClose={() => setViewingResumeId(null)} />
      )}

      {schedulingApp && (
        <InterviewScheduleModal 
          onClose={() => setSchedulingApp(null)}
          onSubmit={async (dateString) => {
            await processStatusUpdate(schedulingApp.appId, schedulingApp.newStatus, dateString);
            setSchedulingApp(null);
          }}
        />
      )}
    </div>
  );
}