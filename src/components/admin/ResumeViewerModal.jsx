import React, { useEffect, useState } from "react";
import { X, Loader } from "lucide-react";
import { getResumeById } from "../../firebase/resumes";
import ResumeTemplate from "../resume/ResumeTemplate";

export default function ResumeViewerModal({ resumeId, onClose }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getResumeById(resumeId);
        setResume(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <Loader className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="glass-card border border-[var(--border)] rounded-2xl p-8 shadow-2xl text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
          <h3 className="text-[var(--text-primary)] font-display font-bold text-lg mb-2">Resume Not Found</h3>
          <p className="text-[var(--text-muted)] text-sm mb-6">This resume might have been deleted.</p>
          <button onClick={onClose} className="w-full py-3 bg-[var(--accent-primary)] hover:scale-105 text-white font-bold rounded-xl transition-all shadow-sm">Close</button>
        </div>
      </div>
    );
  }

  const { contact = {}, experiences = [], educations = [], skills = [], summary = "" } = resume.data || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card border border-[var(--border)] flex flex-col shadow-2xl w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
          <span className="text-base font-display font-bold text-[var(--text-primary)]">Resume Viewer - <span className="font-medium text-[var(--text-muted)]">{resume.title || "Untitled"}</span></span>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--bg-secondary)]">
          <ResumeTemplate data={resume.data || {}} />
        </div>
      </div>
    </div>
  );
}
