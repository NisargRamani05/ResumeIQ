import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, ExternalLink, Filter, Loader } from "lucide-react";
import { getAllApplications, updateApplicationStatus } from "../../firebase/applications";
import { getJobs } from "../../firebase/jobs";
import { sendNotification } from "../../firebase/notifications";
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

  const buildStatusNotif = (newStatus, app, interviewDate) => {
    const role = app.jobTitle || "the position";
    const company = app.companyName || "the company";
    switch (newStatus) {
      case "Shortlisted":
        return {
          title: `You've been Shortlisted! 🎉`,
          body: `Great news! Your application for "${role}" at ${company} has been shortlisted. Stay tuned for next steps.`,
        };
      case "Interview Scheduled":
        return {
          title: `Interview Scheduled 📅`,
          body: `Your interview for "${role}" at ${company} has been scheduled${interviewDate ? ` on ${interviewDate}` : ""}. Be prepared!`,
        };
      case "Selected":
        return {
          title: `Congratulations! You're Selected 🏆`,
          body: `You have been selected for "${role}" at ${company}! The HR team will reach out with further details.`,
        };
      case "Rejected":
        return {
          title: `Application Update for ${role}`,
          body: `Thank you for applying to "${role}" at ${company}. Unfortunately, we won't be moving forward at this time. Keep applying!`,
        };
      default:
        return {
          title: `Application Status Updated`,
          body: `Your application for "${role}" at ${company} has been updated to: ${newStatus}.`,
        };
    }
  };

  const handleStatusChange = async (app, newStatus) => {
    if (newStatus === "Interview Scheduled") {
      setSchedulingApp({ app, newStatus });
      return;
    }
    await processStatusUpdate(app, newStatus, null);
  };

  const processStatusUpdate = async (app, newStatus, interviewDate = null) => {
    const appId = app.id;
    setUpdating(appId);
    try {
      await updateApplicationStatus(appId, newStatus, interviewDate);
      setApplications(p => p.map(a => a.id === appId ? { ...a, status: newStatus, interviewDate: interviewDate || a.interviewDate } : a));
      toast.success("Status updated");

      // Notify the applicant about their status change (fire-and-forget)
      if (app.userId) {
        const { title, body } = buildStatusNotif(newStatus, app, interviewDate);
        sendNotification({
          recipientId: app.userId,
          type: "status_changed",
          title,
          body,
          link: "/dashboard/applications",
        }).catch(console.error);
      }
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
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Applications</h1>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">{applications.length} total application{applications.length!==1?"s":""}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email or role..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors"/>
        </div>
        <select value={filterJob} onChange={e=>setFilterJob(e.target.value)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] min-w-[180px]">
          <option value="">All Jobs</option>
          {jobs.map(j=><option key={j.id} value={j.id}>{j.role} — {j.companyName}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] min-w-[150px]">
          <option value="">All Statuses</option>
          {STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <tr>
                {["Applicant","Position","Applied On","Resume","Status","Update"].map(h=>(
                  <th key={h} className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:5}).map((_,i)=><TableRowSkeleton key={i} cols={6}/>) : filtered.length===0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-[var(--text-muted)]">No applications found</td></tr>
              ) : filtered.map(app=>(
                <tr key={app.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-[var(--text-primary)] font-bold">{app.userName||"—"}</p>
                      <p className="text-[var(--text-muted)] text-xs font-semibold">{app.userEmail||"—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-[var(--text-primary)] font-bold">{app.jobTitle||"—"}</p>
                      <p className="text-[var(--text-muted)] text-xs font-semibold">{app.companyName||"—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)] font-medium">{fmt(app.appliedAt)}</td>
                  <td className="px-5 py-4">
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[var(--accent-primary)] hover:underline text-xs font-bold" onClick={e=>e.stopPropagation()}>
                        <ExternalLink className="w-3.5 h-3.5"/> Open File
                      </a>
                    ) : app.resumeId ? (
                      <button onClick={() => setViewingResumeId(app.resumeId)} className="flex items-center gap-1.5 text-[#10b981] hover:underline text-xs font-bold">
                        <ExternalLink className="w-3.5 h-3.5"/> View Resume
                      </button>
                    ) : <span className="text-[var(--text-muted)] text-xs font-semibold">No file</span>}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={app.status}/>
                    {app.status === "Interview Scheduled" && app.interviewDate && (
                      <div className="text-[10px] text-white font-bold mt-2 whitespace-nowrap bg-[#10b981] px-2 py-0.5 rounded-full border border-[#10b981]/20 inline-block shadow-sm">
                        {app.interviewDate}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={e => handleStatusChange(app, e.target.value)}
                        disabled={updating===app.id}
                        className="bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold rounded-lg px-2 py-1.5 outline-none focus:border-[var(--accent-primary)] disabled:opacity-50"
                      >
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                      {updating===app.id && <Loader className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-spin"/>}
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
            await processStatusUpdate(schedulingApp.app, schedulingApp.newStatus, dateString);
            setSchedulingApp(null);
          }}
        />
      )}
    </div>
  );
}