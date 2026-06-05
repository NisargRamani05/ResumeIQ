import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, CheckCircle, Loader, Briefcase } from "lucide-react";
import { applyToJob, hasUserApplied } from "../../firebase/applications";
import { getUserResumes } from "../../firebase/resumes";
import { sendNotification } from "../../firebase/notifications";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ResumeUploadModal({ job, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const data = await getUserResumes(currentUser.uid);
        setResumes(data);
        if (data.length > 0) setSelectedResumeId(data[0].id);
      } catch (err) {
        toast.error("Failed to load your resumes");
      } finally {
        setFetching(false);
      }
    })();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) { toast.error("Please select a resume"); return; }
    
    setLoading(true);
    try {
      const alreadyApplied = await hasUserApplied(currentUser.uid, job.id);
      if (alreadyApplied) { 
        toast.error("You have already applied for this job!"); 
        setLoading(false); 
        return; 
      }

      const selectedResume = resumes.find(r => r.id === selectedResumeId);

      await applyToJob({
        userId: currentUser.uid,
        jobId: job.id,
        resumeId: selectedResumeId,
        resumeTitle: selectedResume?.title || "Untitled Resume",
        message,
        userName: currentUser.displayName || currentUser.email.split("@")[0],
        userEmail: currentUser.email,
        jobTitle: job.role,
        companyName: job.companyName,
      });

      // Notify admin about the new application (fire-and-forget)
      const applicantName = currentUser.displayName || currentUser.email.split("@")[0];
      sendNotification({
        recipientId: "admin",
        type: "application_received",
        title: `New Application: ${job.role}`,
        body: `${applicantName} applied for "${job.role}" at ${job.companyName}.`,
        link: "/admin/applications",
      }).catch(console.error);

      setDone(true);
      toast.success("Application submitted successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
            <div>
              <h3 className="text-[var(--text-primary)] font-bold font-display text-lg">Apply for Position</h3>
              <p className="text-[var(--text-muted)] text-sm font-semibold mt-0.5">{job.role} · {job.companyName}</p>
            </div>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {done ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#10b981]/15 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#10b981]" />
              </div>
              <h3 className="text-[var(--text-primary)] font-bold text-lg">Application Submitted!</h3>
              <p className="text-[var(--text-muted)] text-sm text-center px-8 font-medium">You can track your application status in My Applications.</p>
              <button onClick={onClose} className="mt-2 px-8 py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-bold rounded-xl transition-colors">Done</button>
            </div>
          ) : fetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
              <p className="text-[var(--text-muted)] text-sm font-semibold">Fetching your resumes...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {resumes.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mx-auto mb-4 shadow-sm border border-[var(--border)]">
                    <FileText className="w-8 h-8 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-[var(--text-primary)] text-base font-bold">No resumes found</p>
                  <p className="text-[var(--text-muted)] text-sm mt-1 mb-6">You need to create a resume in the builder first.</p>
                  <button type="button" onClick={() => window.location.href='/dashboard/resumes/new'} className="px-6 py-2.5 bg-[var(--accent-primary)] text-white text-sm font-bold rounded-full hover:scale-105 shadow-[var(--glow)] transition-all">Go to Resume Builder</button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3">Select Resume <span className="text-red-500">*</span></label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {resumes.map(r => (
                      <label key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedResumeId === r.id ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-sm' : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--text-muted)]'}`}>
                        <input type="radio" name="resume" value={r.id} checked={selectedResumeId === r.id} onChange={() => setSelectedResumeId(r.id)} className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedResumeId === r.id ? 'border-[var(--accent-primary)]' : 'border-[var(--border)]'}`}>
                          {selectedResumeId === r.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--text-primary)] text-sm font-bold truncate">{r.title}</p>
                          <p className="text-[var(--text-muted)] text-xs font-medium mt-0.5">Saved {r.savedAt?.toDate ? r.savedAt.toDate().toLocaleDateString() : 'recent'}</p>
                        </div>
                        <FileText className={`w-5 h-5 ${selectedResumeId === r.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover message */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-3">Cover Message <span className="text-[var(--text-muted)] lowercase tracking-normal">(optional)</span></label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tell us why you're a great fit..."
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] font-medium outline-none placeholder-[var(--text-muted)] transition-all resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || resumes.length === 0}
                className="w-full py-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 disabled:opacity-60 disabled:hover:scale-100 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[var(--glow)] hover:scale-[1.02]"
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin"/> Submitting...</> : "Submit Application"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
