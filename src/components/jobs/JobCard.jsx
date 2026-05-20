import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, DollarSign, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const TYPE_COLORS = {
  "Full Time":  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Internship": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Part Time":  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "Remote":     "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20",
};

export default function JobCard({ job, showApplyBtn = true }) {
  const navigate = useNavigate();
  const skills = Array.isArray(job.skills) ? job.skills : (job.skills || "").split(",").map(s => s.trim()).filter(Boolean);
  const deadlineStr = job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "";
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const typeColor = TYPE_COLORS[job.employmentType] || "bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)]";

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "var(--shadow-card)" }}
      className="glass-card hover:border-[var(--accent-primary)]/40 rounded-2xl p-6 flex flex-col gap-5 cursor-pointer transition-colors group"
      onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
    >
      {/* Header: logo + company + type */}
      <div className="flex items-start gap-4">
        {job.logoUrl ? (
          <img src={job.logoUrl} alt={job.companyName} className="w-14 h-14 rounded-2xl object-cover border border-[var(--border)] shrink-0 bg-white p-0.5 shadow-sm" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-display font-black text-xl shrink-0 shadow-[var(--glow)]">
            {(job.companyName || "?")[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-[var(--text-primary)] font-bold text-lg leading-tight truncate group-hover:text-[var(--accent-primary)] transition-colors">{job.role}</h3>
          <p className="text-[var(--text-muted)] text-sm truncate mt-1">{job.companyName}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${typeColor}`}>
          {job.employmentType}
        </span>
        {job.location && (
          <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--border)]">
            <MapPin className="w-3 h-3"/> {job.location}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
        {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5"/> {job.salary}</span>}
        {deadlineStr && (
          <span className={`flex items-center gap-1 ${isExpired ? "text-red-500 font-bold" : ""}`}>
            <Calendar className="w-3.5 h-3.5"/> {isExpired ? "Expired" : `Ends ${deadlineStr}`}
          </span>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {skills.slice(0, 4).map((s, i) => (
            <span key={i} className="text-[11px] font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] px-2.5 py-1 rounded-lg">{s}</span>
          ))}
          {skills.length > 4 && <span className="text-[11px] font-bold text-[var(--text-muted)] py-1">+{skills.length - 4} more</span>}
        </div>
      )}

      {/* Apply button */}
      {showApplyBtn && (
        <button
          onClick={e => { e.stopPropagation(); navigate(`/dashboard/jobs/${job.id}`); }}
          disabled={isExpired}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 mt-auto
            ${isExpired
              ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]"
              : "bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] hover:text-white border border-[var(--border)] hover:border-[var(--accent-primary)] shadow-sm hover:shadow-[var(--glow)] group-hover:bg-[var(--accent-primary)] group-hover:text-white"
            }`}
        >
          {isExpired ? "Deadline Passed" : <><ExternalLink className="w-4 h-4"/> View Opportunity</>}
        </button>
      )}
    </motion.div>
  );
}
