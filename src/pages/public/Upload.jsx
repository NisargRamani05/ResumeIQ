import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, X } from "lucide-react";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobDescription, setJobDescription] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const simulateProcessing = () => {
    setProcessing(true);
    let curr = 0;
    const interval = setInterval(() => {
      curr += Math.floor(Math.random() * 10) + 5;
      if (curr >= 100) {
        curr = 100;
        setProgress(curr);
        clearInterval(interval);
        setTimeout(() => {
          navigate("/results");
        }, 600);
      } else {
        setProgress(curr);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-6 relative flex flex-col items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Analyze Your <span className="text-[var(--accent-primary)]">Resume</span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg">
            Upload your PDF and paste a job description for tailored insights.
          </p>
        </div>

        <div className="glass-card p-6 md:p-10 rounded-3xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-[var(--accent-primary)]/10 blur-[80px] pointer-events-none" />

          {/* Upload Zone */}
          {!file && (
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 scale-[1.02]" 
                  : "border-[var(--border)] hover:border-[var(--accent-primary)]/50 bg-black/20"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`absolute inset-0 rounded-2xl border-2 border-[var(--accent-primary)]/30 border-dashed pointer-events-none transition-opacity duration-300 spin-border ${isDragging ? 'opacity-100' : 'opacity-0'}`} style={{ borderStyle: 'dashed', borderRadius: '1rem', animationDuration: '10s' }} />
              
              <div className="w-20 h-20 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full flex items-center justify-center mb-6 shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                <UploadCloud className={`w-8 h-8 ${isDragging ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 relative z-10">Drag & Drop your resume</h3>
              <p className="text-sm text-[var(--text-muted)] relative z-10">Supports PDF, DOCX (Max 5MB)</p>
              
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
            </div>
          )}

          {/* File Selected State */}
          {file && !processing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/30 border border-[var(--border)] rounded-2xl p-6 flex items-center gap-5"
            >
              <div className="w-14 h-14 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[var(--accent-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{file.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 bg-[var(--bg-secondary)] rounded-full transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Processing State */}
          {processing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 flex flex-col items-center justify-center"
            >
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-6 relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[var(--accent-primary)] shadow-[var(--glow)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-3">
                {progress < 100 ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-[var(--accent-secondary)]" />
                )}
                <span className="font-display font-bold text-white tracking-wide">
                  {progress < 100 ? "Analyzing Resume Data..." : "Analysis Complete!"}
                </span>
              </div>
            </motion.div>
          )}

          {/* Job Description (Optional) */}
          <AnimatePresence>
            {file && !processing && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                  Job Description (Optional)
                </label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a tailored ATS match score..."
                  className="w-full h-32 bg-black/30 border border-[var(--border)] hover:border-slate-700 focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-2xl p-4 text-sm text-white outline-none resize-none transition-all placeholder:text-slate-600 custom-scrollbar"
                />

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={simulateProcessing}
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-black bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[var(--glow)]"
                  >
                    Run Analysis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
