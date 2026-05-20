import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Calendar, Briefcase, Globe, Users, ChevronLeft, CheckCircle, Loader } from "lucide-react";
import { getJob } from "../../firebase/jobs";
import { hasUserApplied } from "../../firebase/applications";
import { useAuth } from "../../context/AuthContext";
import ResumeUploadModal from "../../components/jobs/ResumeUploadModal";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getJob(id);
        setJob(data);
        if (currentUser) {
          const a = await hasUserApplied(currentUser.uid, id);
          setApplied(a);
        }
      } catch { toast.error("Job not found"); navigate("/dashboard/jobs"); }
      finally { setLoading(false); setCheckingApplied(false); }
    })();
  }, [id, currentUser, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader className="w-8 h-8 text-[var(--accent-primary)] animate-spin"/></div>
  );

  const skills = Array.isArray(job.skills) ? job.skills : (job.skills||"").split(",").map(s=>s.trim()).filter(Boolean);
  const prefSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const isExpired = deadline && deadline < new Date();

  const meta = [
    { icon: MapPin, label: job.location },
    { icon: DollarSign, label: job.salary },
    { icon: Briefcase, label: job.employmentType },
    { icon: Calendar, label: deadline ? deadline.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : null },
    { icon: Users, label: job.openings ? `${job.openings} opening${job.openings>1?"s":""}` : null },
    { icon: Globe, label: job.website, href: job.website },
  ].filter(m=>m.label);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={()=>navigate("/dashboard/jobs")} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm font-semibold">
        <ChevronLeft className="w-4 h-4"/> Back to Jobs
      </button>

      {/* Header card */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="glass-card rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt={job.companyName} className="w-20 h-20 rounded-2xl object-cover border border-[var(--border)] bg-[var(--bg-primary)] p-0.5 shadow-sm shrink-0"/>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-display font-black text-3xl shrink-0 shadow-[var(--glow)]">
              {(job.companyName||"?")[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">{job.role}</h1>
            <p className="text-[var(--text-muted)] mt-1 font-semibold">{job.companyName}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-[var(--text-muted)] font-medium">
              {meta.map((m,i)=>(
                <span key={i} className="flex items-center gap-2">
                  <m.icon className="w-4 h-4 shrink-0 text-[var(--text-muted)]"/>
                  {m.href ? <a href={m.href} target="_blank" rel="noreferrer" className="text-[var(--accent-primary)] hover:underline">{m.label}</a> : m.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Apply button */}
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          {applied ? (
            <div className="flex items-center gap-2 text-[#10b981] font-bold">
              <CheckCircle className="w-5 h-5"/> Application Submitted Successfully
            </div>
          ) : (
            <button
              onClick={()=>setShowModal(true)}
              disabled={isExpired || checkingApplied}
              className={`px-8 py-3.5 rounded-xl text-sm font-bold transition-all w-full sm:w-auto
                ${isExpired ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]" : "bg-[var(--accent-primary)] hover:scale-105 text-white shadow-[var(--glow)]"}`}
            >
              {isExpired ? "Application Deadline Passed" : "Apply Now"}
            </button>
          )}
          {isExpired && !applied && <p className="text-red-500 font-semibold text-xs mt-3">This job posting has expired.</p>}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="glass-card rounded-2xl p-8 space-y-4">
        <h2 className="text-[var(--text-primary)] font-display font-bold text-xl border-b border-[var(--border)] pb-2">Job Description</h2>
        <p className="text-[var(--text-primary)] text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
      </motion.div>

      {/* Skills */}
      {skills.length > 0 && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.12}} className="glass-card rounded-2xl p-8 space-y-4">
          <h2 className="text-[var(--text-primary)] font-display font-bold text-xl border-b border-[var(--border)] pb-2">Required Skills</h2>
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((s,i)=><span key={i} className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs px-4 py-2 rounded-full font-bold">{s}</span>)}
          </div>
          {prefSkills.length>0 && <>
            <h3 className="text-[var(--text-primary)] font-display font-bold text-lg pt-4 border-t border-[var(--border)]">Preferred Skills</h3>
            <div className="flex flex-wrap gap-2">
              {prefSkills.map((s,i)=><span key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-xs px-4 py-2 rounded-full font-semibold">{s}</span>)}
            </div>
          </>}
        </motion.div>
      )}

      {/* Eligibility */}
      {(job.eligibility || job.minCGPA || job.experience || job.certifications) && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.16}} className="glass-card rounded-2xl p-8 space-y-4">
          <h2 className="text-[var(--text-primary)] font-display font-bold text-xl border-b border-[var(--border)] pb-2">Eligibility Criteria</h2>
          <div className="grid grid-cols-2 gap-6 pt-2">
            {job.eligibility && <div><p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wide mb-1">Eligibility</p><p className="text-[var(--text-primary)] font-medium">{job.eligibility}</p></div>}
            {job.minCGPA && <div><p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wide mb-1">Min. CGPA</p><p className="text-[var(--text-primary)] font-medium">{job.minCGPA}</p></div>}
            {job.experience && <div><p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wide mb-1">Experience</p><p className="text-[var(--text-primary)] font-medium">{job.experience}</p></div>}
            {job.certifications && <div><p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wide mb-1">Certifications</p><p className="text-[var(--text-primary)] font-medium">{job.certifications}</p></div>}
          </div>
        </motion.div>
      )}

      {showModal && <ResumeUploadModal job={job} onClose={()=>setShowModal(false)} onSuccess={()=>{ setApplied(true); setShowModal(false); }}/>}
    </div>
  );
}