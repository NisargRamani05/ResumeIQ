import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, DollarSign, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_COLORS = {
  "Full Time":  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Internship": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Part Time":  "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Remote":     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function JobCard({ job, showApplyBtn = true }) {
  const navigate = useNavigate();
  const skills = Array.isArray(job.skills) ? job.skills : (job.skills || "").split(",").map(s => s.trim()).filter(Boolean);
  const deadlineStr = job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "";
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const typeColor = TYPE_COLORS[job.employmentType] || "bg-slate-700/50 text-slate-400 border-slate-600";

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 20px 60px rgba(59,130,246,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-[#0d1a2d] border border-slate-800 hover:border-blue-600/40 rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-colors"
      onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
    >
      {/* Header: logo + company + type */}
      <div className="flex items-start gap-3">
        {job.logoUrl ? (
          <img src={job.logoUrl} alt={job.companyName} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 bg-white p-0.5" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shrink-0">
            {(job.companyName || "?")[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base leading-tight truncate">{job.role}</h3>
          <p className="text-slate-400 text-sm truncate mt-0.5">{job.companyName}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ${typeColor}`}>
          {job.employmentType}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>}
        {job.salary   && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3"/> {job.salary}</span>}
        {deadlineStr  && (
          <span className={`flex items-center gap-1 ${isExpired ? "text-red-400" : ""}`}>
            <Calendar className="w-3 h-3"/> {isExpired ? "Expired" : deadlineStr}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map((s, i) => (
            <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {skills.length > 5 && <span className="text-xs text-slate-500">+{skills.length - 5} more</span>}
        </div>
      )}

      {/* Apply button */}
      {showApplyBtn && (
        <button
          onClick={e => { e.stopPropagation(); navigate(`/dashboard/jobs/${job.id}`); }}
          disabled={isExpired}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 mt-auto
            ${isExpired
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            }`}
        >
          {isExpired ? "Deadline Passed" : <><ExternalLink className="w-3.5 h-3.5"/> View & Apply</>}
        </button>
      )}
    </motion.div>
  );
}
