import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, CheckCircle, Loader, Briefcase } from "lucide-react";
import { applyToJob, hasUserApplied } from "../../firebase/applications";
import { getUserResumes } from "../../firebase/resumes";
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
          className="bg-[#0d1a2d] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div>
              <h3 className="text-white font-bold">Apply for Position</h3>
              <p className="text-slate-400 text-xs mt-0.5">{job.role} · {job.companyName}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {done ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-white font-bold text-lg">Application Submitted!</h3>
              <p className="text-slate-400 text-sm text-center px-8">You can track your application status in My Applications.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">Done</button>
            </div>
          ) : fetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-slate-400 text-sm">Fetching your resumes...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {resumes.length === 0 ? (
                <div className="text-center py-6 px-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-300 text-sm font-medium">No resumes found</p>
                  <p className="text-slate-500 text-xs mt-1 mb-4">You need to create a resume in the builder first.</p>
                  <button type="button" onClick={() => window.location.href='/dashboard/resumes/new'} className="text-blue-400 hover:text-blue-300 text-xs font-semibold underline">Go to Resume Builder</button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Select Resume *</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {resumes.map(r => (
                      <label key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedResumeId === r.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                        <input type="radio" name="resume" value={r.id} checked={selectedResumeId === r.id} onChange={() => setSelectedResumeId(r.id)} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedResumeId === r.id ? 'border-blue-500' : 'border-slate-700'}`}>
                          {selectedResumeId === r.id && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{r.title}</p>
                          <p className="text-slate-500 text-[10px]">Saved on {r.savedAt?.toDate ? r.savedAt.toDate().toLocaleDateString() : 'recent'}</p>
                        </div>
                        <FileText className="w-4 h-4 text-slate-600" />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover message */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Cover Message (optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tell us why you're a great fit..."
                  className="w-full bg-slate-900 border border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-slate-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || resumes.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
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

