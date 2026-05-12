import React from "react";

const STATUSES = {
  "Applied":             { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/30",    dot: "bg-blue-400" },
  "Shortlisted":         { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/30",   dot: "bg-amber-400" },
  "Interview Scheduled": { bg: "bg-purple-500/15",  text: "text-purple-400",  border: "border-purple-500/30",  dot: "bg-purple-400" },
  "Rejected":            { bg: "bg-red-500/15",      text: "text-red-400",     border: "border-red-500/30",     dot: "bg-red-400" },
  "Selected":            { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
};

export default function StatusBadge({ status }) {
  const s = STATUSES[status] || STATUSES["Applied"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
