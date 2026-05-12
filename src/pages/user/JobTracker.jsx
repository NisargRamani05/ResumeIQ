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
      <h1 className="text-2xl font-bold text-white">My Applications</h1>
      <div className="space-y-4">{Array.from({length:3}).map((_,i)=>(
        <div key={i} className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-5 animate-pulse h-24"/>
      ))}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <p className="text-slate-400 text-sm mt-0.5">{applications.length} application{applications.length!==1?"s":""} submitted</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Browse available jobs and apply to get started."
          action={<button onClick={()=>navigate("/dashboard/jobs")} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">Browse Jobs</button>}
        />
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const stepIdx = getStepIndex(app.status);
            const isRejected = app.status === "Rejected";
            const isExpanded = expanded === app.id;
            return (
              <div key={app.id} className="bg-[#0d1a2d] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between p-5 cursor-pointer" onClick={()=>setExpanded(isExpanded?null:app.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(app.companyName||"?")[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{app.jobTitle||"Position"}</p>
                      <p className="text-slate-400 text-sm">{app.companyName||"Company"} · Applied {fmt(app.appliedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status}/>
                    <span className="text-slate-600 text-xs">{isExpanded?"▲":"▼"}</span>
                  </div>
                </div>

                {/* Expanded: progress + resume */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-800 pt-4 space-y-4">
                    {isRejected ? (
                      <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-400 shrink-0"/>
                        <p className="text-red-300 text-sm">Your application was not selected for this position. Keep applying!</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-4">Application Progress</p>
                        <div className="relative">
                          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-800"/>
                          <div className="absolute left-4 top-4 w-0.5 bg-blue-600 transition-all duration-500" style={{height:`${(stepIdx/(STEPS.length-1))*100}%`}}/>
                          <div className="space-y-4 relative">
                            {STEPS.map((s,i)=>{
                              const done = i < stepIdx || (s==="Selected" && app.status==="Selected");
                              const cur = STEPS[stepIdx]===s;
                              const Icon = STEP_ICONS[s]||Clock;
                              return (
                                <div key={s} className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 relative z-10 transition-all ${done?"bg-blue-600 border-blue-600":cur?"bg-blue-600/20 border-blue-500":"bg-slate-900 border-slate-700"}`}>
                                    <Icon className={`w-3.5 h-3.5 ${done||cur?"text-white":"text-slate-600"}`}/>
                                  </div>
                                  <span className={`text-sm font-medium ${done||cur?"text-white":"text-slate-500"}`}>{s}</span>
                                  {cur && <span className="text-xs text-blue-400 font-medium">← Current</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors">
                        <FileText className="w-3.5 h-3.5"/> View Submitted Resume <ExternalLink className="w-3 h-3"/>
                      </a>
                    )}

                    {app.message && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-semibold">Your Cover Message</p>
                        <p className="text-slate-300 text-sm">{app.message}</p>
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