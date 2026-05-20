import React, { useState, useEffect } from "react";
import { ExternalLink, Briefcase, CheckCircle, Clock, XCircle, AlertCircle, FileText } from "lucide-react";
import { getUserApplications } from "../../firebase/applications";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/jobs/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STEPS = ["Applied","Shortlisted","Interview Scheduled","Selected"];
const STEP_ICONS = { Applied: Clock, Shortlisted: CheckCircle, "Interview Scheduled": AlertCircle, Selected: CheckCircle };

export default function JobTracker() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const data = await getUserApplications(currentUser.uid);
        setApplications(data);
      } catch (err) { 
        console.error(err);
        toast.error(err.message?.includes("permission") ? "Permission Denied: Update Firestore Rules" : "Failed to load applications"); 
      }
      finally { setLoading(false); }
    })();
  }, [currentUser]);

  const fmt = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  };

  const getStepIndex = (status) => {
    if (status === "Rejected") return -1;
    return STEPS.indexOf(status);
  };

  if (loading) return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">My Applications</h1>
      <div className="space-y-4">{Array.from({length:3}).map((_,i)=>(
        <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-28"/>
      ))}</div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] tracking-tight">My Applications</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">{applications.length} application{applications.length!==1?"s":""} submitted</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Browse available jobs and apply to get started."
          action={<button onClick={()=>navigate("/dashboard/jobs")} className="px-8 py-3 bg-[var(--accent-primary)] hover:scale-105 shadow-[var(--glow)] text-white text-sm font-bold rounded-full transition-all mt-4">Browse Jobs</button>}
        />
      ) : (
        <div className="space-y-5 relative z-10">
          {applications.map(app => {
            const stepIdx = getStepIndex(app.status);
            const isRejected = app.status === "Rejected";
            const isExpanded = expanded === app.id;
            return (
              <div key={app.id} className="glass-card hover:border-[var(--accent-primary)]/40 rounded-2xl overflow-hidden transition-all hover:shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 cursor-pointer group" onClick={()=>setExpanded(isExpanded?null:app.id)}>
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-display font-black text-lg shrink-0 shadow-[var(--glow)] group-hover:scale-110 transition-transform">
                      {(app.companyName||"?")[0]}
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-bold text-lg group-hover:text-[var(--accent-primary)] transition-colors">{app.jobTitle||"Position"}</p>
                      <p className="text-[var(--text-muted)] text-sm font-medium">{app.companyName||"Company"} · Applied {fmt(app.appliedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0 self-end sm:self-auto">
                    <StatusBadge status={app.status}/>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                      <span className="text-xs font-bold">{isExpanded?"▲":"▼"}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded: progress + resume */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-[var(--border)] pt-5 space-y-6 bg-[var(--bg-secondary)]/30">
                    {isRejected ? (
                      <div className="flex items-center gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <XCircle className="w-6 h-6 text-red-500 shrink-0"/>
                        <p className="text-red-500 font-semibold text-sm">Your application was not selected for this position. Keep applying!</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wide mb-5">Application Progress</p>
                        <div className="relative">
                          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[var(--border)]"/>
                          <div className="absolute left-[19px] top-4 w-0.5 bg-[var(--accent-primary)] transition-all duration-500 shadow-[var(--glow)]" style={{height:`${(stepIdx/(STEPS.length-1))*100}%`}}/>
                          <div className="space-y-6 relative">
                            {STEPS.map((s,i)=>{
                              const done = i < stepIdx || (s==="Selected" && app.status==="Selected");
                              const cur = STEPS[stepIdx]===s;
                              const Icon = STEP_ICONS[s]||Clock;
                              return (
                                <div key={s} className="flex items-center gap-5">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 relative z-10 transition-all ${done?"bg-[var(--accent-primary)] border-[var(--accent-primary)] shadow-[var(--glow)]":cur?"bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]":"bg-[var(--bg-secondary)] border-[var(--border)]"}`}>
                                    <Icon className={`w-4 h-4 ${done||cur?"text-white":"text-[var(--text-muted)]"}`}/>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold ${done||cur?"text-[var(--text-primary)]":"text-[var(--text-muted)]"}`}>{s}</span>
                                    {cur && <span className="text-xs text-[var(--accent-primary)] font-bold bg-[var(--accent-primary)]/10 px-2 py-0.5 rounded border border-[var(--accent-primary)]/20 shadow-[0_0_10px_rgba(56,189,248,0.2)]">Current Stage</span>}
                                    {cur && s === "Interview Scheduled" && app.interviewDate && (
                                      <span className="text-xs text-white font-bold bg-[#10b981] px-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-[#10b981]/20 ml-2">
                                        {app.interviewDate}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[var(--border)]">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] border border-[var(--border)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                          <FileText className="w-4 h-4"/> View Submitted Resume <ExternalLink className="w-3.5 h-3.5"/>
                        </a>
                      )}
                    </div>

                    {app.message && (
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 shadow-inner">
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide mb-2 font-bold">Your Cover Message</p>
                        <p className="text-[var(--text-primary)] text-sm font-medium italic">"{app.message}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}