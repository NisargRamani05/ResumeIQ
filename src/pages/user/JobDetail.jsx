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
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader className="w-8 h-8 text-blue-400 animate-spin"/></div>
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
      <button onClick={()=>navigate("/dashboard/jobs")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ChevronLeft className="w-4 h-4"/> Back to Jobs
      </button>

      {/* Header card */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          {job.logoUrl ? (
            <img src={job.logoUrl} alt={job.companyName} className="w-16 h-16 rounded-2xl object-cover border border-slate-700 bg-white p-0.5 shrink-0"/>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shrink-0">
              {(job.companyName||"?")[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-white">{job.role}</h1>
            <p className="text-slate-400 mt-1">{job.companyName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
              {meta.map((m,i)=>(
                <span key={i} className="flex items-center gap-1.5">
                  <m.icon className="w-3.5 h-3.5 shrink-0"/>
                  {m.href ? <a href={m.href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{m.label}</a> : m.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Apply button */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          {applied ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-5 h-5"/> Application Submitted
            </div>
          ) : (
            <button
              onClick={()=>setShowModal(true)}
              disabled={isExpired || checkingApplied}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all
                ${isExpired ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"}`}
            >
              {isExpired ? "Application Deadline Passed" : "Apply Now"}
            </button>
          )}
          {isExpired && !applied && <p className="text-red-400 text-xs mt-2">This job posting has expired.</p>}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-lg">Job Description</h2>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
      </motion.div>

      {/* Skills */}
      {skills.length > 0 && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.12}} className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s,i)=><span key={i} className="bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium">{s}</span>)}
          </div>
          {prefSkills.length>0 && <>
            <h3 className="text-slate-300 font-medium text-sm pt-2">Preferred Skills</h3>
            <div className="flex flex-wrap gap-2">
              {prefSkills.map((s,i)=><span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full">{s}</span>)}
            </div>
          </>}
        </motion.div>
      )}

      {/* Eligibility */}
      {(job.eligibility || job.minCGPA || job.experience || job.certifications) && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.16}} className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-white font-semibold text-lg">Eligibility Criteria</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {job.eligibility && <div><p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Eligibility</p><p className="text-slate-200">{job.eligibility}</p></div>}
            {job.minCGPA && <div><p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Min. CGPA</p><p className="text-slate-200">{job.minCGPA}</p></div>}
            {job.experience && <div><p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Experience</p><p className="text-slate-200">{job.experience}</p></div>}
            {job.certifications && <div><p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Certifications</p><p className="text-slate-200">{job.certifications}</p></div>}
          </div>
        </motion.div>
      )}

      {showModal && <ResumeUploadModal job={job} onClose={()=>setShowModal(false)} onSuccess={()=>{ setApplied(true); setShowModal(false); }}/>}
    </div>
  );
}