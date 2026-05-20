import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Users, Loader, Briefcase } from "lucide-react";
import { getJobs, deleteJob } from "../../firebase/jobs";
import { getJobApplications } from "../../firebase/applications";
import EmptyState from "../../components/ui/EmptyState";
import { TableRowSkeleton } from "../../components/ui/LoadingSkeleton";
import StatusBadge from "../../components/jobs/StatusBadge";
import toast from "react-hot-toast";

const TYPE_COLORS = {
  "Full Time":"bg-blue-500/15 text-blue-500",
  "Internship":"bg-purple-500/15 text-purple-500",
  "Part Time":"bg-amber-500/15 text-amber-500",
  "Remote":"bg-emerald-500/15 text-emerald-500",
};

export default function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
      const counts = {};
      await Promise.all(data.map(async j => {
        const apps = await getJobApplications(j.id);
        counts[j.id] = apps.length;
      }));
      setAppCounts(counts);
    } catch(e) { toast.error("Failed to load jobs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob(deleteTarget.id, deleteTarget.logoUrl);
      toast.success("Job deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete job"); }
    finally { setDeleting(false); }
  };

  const filtered = jobs.filter(j =>
    j.role?.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Manage Jobs</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">{jobs.length} job{jobs.length!==1?"s":""} posted</p>
        </div>
        <button onClick={()=>navigate("/admin/jobs/new")} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] hover:scale-105 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4"/> Post New Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"/>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by role, company, location..."
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <tr>
                {["Company","Role","Type","Location","Deadline","Applicants","Actions"].map(h=>(
                  <th key={h} className="px-5 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({length:5}).map((_,i)=><TableRowSkeleton key={i} cols={7}/>) : filtered.length===0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">No jobs found</td></tr>
              ) : filtered.map(job=>(
                <tr key={job.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {job.logoUrl ? <img src={job.logoUrl} className="w-8 h-8 rounded-lg object-cover border border-[var(--border)] bg-[var(--bg-card)] p-0.5" alt=""/> : <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm">{(job.companyName||"?")[0]}</div>}
                      <span className="text-[var(--text-primary)] font-bold">{job.companyName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-primary)] font-semibold">{job.role}</td>
                  <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${TYPE_COLORS[job.employmentType]||"bg-[var(--bg-secondary)] text-[var(--text-muted)]"}`}>{job.employmentType}</span></td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">{job.location}</td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">{job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}</td>
                  <td className="px-5 py-4">
                    <button onClick={()=>navigate(`/admin/applications?job=${job.id}`)} className="flex items-center gap-1.5 text-[var(--accent-primary)] hover:underline font-bold">
                      <Users className="w-3.5 h-3.5"/> {appCounts[job.id]||0}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>navigate(`/admin/jobs/${job.id}/edit`)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-secondary)] transition-colors"><Pencil className="w-4 h-4"/></button>
                      <button onClick={()=>setDeleteTarget(job)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card border border-red-500/30 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3"/>
            <h3 className="text-[var(--text-primary)] font-display font-bold text-lg mb-1">Delete Job Posting?</h3>
            <p className="text-[var(--text-muted)] text-sm mb-2">{deleteTarget.role} at {deleteTarget.companyName}</p>
            <p className="text-red-500/80 text-xs font-semibold mb-6">This will also delete all associated applicant data.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteTarget(null)} className="flex-1 py-2.5 border border-[var(--border)] bg-[var(--bg-secondary)] rounded-xl text-[var(--text-primary)] text-sm font-bold hover:bg-[var(--bg-card)] transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-xl text-white text-sm font-bold transition-colors">
                {deleting?"Deleting...":"Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}