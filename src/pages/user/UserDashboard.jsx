import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, Star, Plus, TrendingUp, ChevronRight, Activity, Award, X, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserResumes } from '../../firebase/resumes';
import { getUserApplications } from '../../firebase/applications';
import { analyzeResume } from '../../services/aiService';
import ScoreRing from '../../components/ScoreRing';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profileName, setProfileName] = useState('');
  const [loading, setLoading] = useState(true);

  // ATS Modal state
  const [selectedResume, setSelectedResume] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const [resData, appData, profile] = await Promise.all([
          getUserResumes(currentUser.uid),
          getUserApplications(currentUser.uid),
          import('../../firebase/firestore').then(m => m.getUserProfile(currentUser.uid))
        ]);
        setResumes(resData);
        setApplications(appData);
        setProfileName(profile?.name || currentUser.displayName || '');
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const interviews = applications.filter(a => a.status === 'Interview Scheduled').length;
  const recentApps = applications.slice(0, 4);

  const fmt = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      case 'Shortlisted': return 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20';
      case 'Rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Selected': return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      default: return 'text-[var(--text-muted)] bg-[var(--bg-secondary)] border-[var(--border)]';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const resumeToText = (data) => {
    let text = `${data?.contact?.firstName || ''} ${data?.contact?.lastName || ''}\n`;
    text += `${data?.summary || ''}\n`;
    data?.experiences?.forEach(e => { text += `${e.jobTitle} at ${e.company}\n${e.bullets?.join('\n')}\n`; });
    data?.educations?.forEach(e => { text += `${e.degree} at ${e.school}\n`; });
    data?.skills?.forEach(s => { text += `${s}\n`; });
    return text;
  };

  const handleAnalyzeClick = async (resume) => {
    setSelectedResume(resume);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    
    try {
      const text = resumeToText(resume.data);
      const result = await analyzeResume(text, "");
      setAnalysisResult(result);
    } catch (err) {
      toast.error(err.message || "Analysis failed");
      setSelectedResume(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] tracking-tight">Overview</h1>
          <p className="text-[var(--text-muted)] mt-1">Welcome back, {profileName || 'User'}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/resumes/new')}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[var(--glow)]"
        >
          <Plus className="w-4 h-4" /> New Resume
        </button>
      </motion.div>

      {/* Stat Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        {[
          { title: "Total Resumes", value: resumes.length, icon: FileText, color: "var(--accent-secondary)", text: "Created so far" },
          { title: "Applications", value: applications.length, icon: Briefcase, color: "var(--accent-primary)", text: "Sent to recruiters" },
          { title: "Interviews", value: interviews, icon: Star, color: "#eab308", text: "Currently scheduled" }
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <stat.icon className="w-24 h-24" style={{ color: stat.color }} />
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <h3 className="font-semibold text-[var(--text-muted)]">{stat.title}</h3>
            </div>
            
            <div className="relative z-10">
              {loading ? (
                <div className="h-10 w-24 bg-[var(--bg-secondary)] animate-pulse rounded-lg" />
              ) : (
                <div className="text-4xl font-display font-bold text-[var(--text-primary)] tracking-tight">
                  {stat.value}
                </div>
              )}
              <p className="text-sm text-[var(--text-muted)] mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {stat.text}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Recent Applications Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Recent Applications</h2>
            </div>
            <button onClick={() => navigate('/dashboard/applications')} className="text-sm font-semibold text-[var(--accent-primary)] hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-[var(--bg-primary)] rounded" />
                    <div className="h-3 w-1/4 bg-[var(--bg-primary)] rounded" />
                  </div>
                </div>
              ))
            ) : recentApps.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)]/50">
                <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                <p className="text-[var(--text-primary)] font-semibold mb-2">No applications yet</p>
                <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto">Start tracking your job applications to see them appear here.</p>
                <button onClick={() => navigate('/dashboard/jobs')} className="px-6 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold rounded-xl transition-colors">
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="relative border-l-2 border-[var(--border)] ml-6 space-y-8 pb-4">
                {recentApps.map((app, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    key={i} 
                    className="relative pl-8 group"
                  >
                    {/* Timeline Node */}
                    <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[var(--bg-card)] border-4 border-[var(--accent-primary)] group-hover:scale-125 transition-transform" />
                    
                    <div className="glass-card p-5 rounded-2xl hover:border-[var(--accent-primary)]/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-[var(--text-primary)] text-lg">{app.jobTitle || 'Position'}</h4>
                          <p className="text-sm text-[var(--text-muted)] mt-1">{app.companyName || 'Company'}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{fmt(app.appliedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ATS Scores Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-[var(--accent-secondary)]" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">ATS Health</h2>
          </div>

          <div className="flex-1 space-y-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="h-4 w-1/2 bg-[var(--bg-secondary)] rounded" />
                  <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full" />
                </div>
              ))
            ) : resumes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                  <FileText className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
                </div>
                <p className="text-sm text-[var(--text-muted)]">No resumes analyzed</p>
              </div>
            ) : (
              resumes.slice(0, 5).map((r, i) => {
                const d = r.data || {};
                let score = 0;
                if (d.contact?.firstName && d.contact?.email) score += 15;
                if (d.summary?.length > 20) score += 15;
                if (d.experiences?.filter(e => e.jobTitle).length > 0) score += 30;
                if (d.experiences?.some(e => e.bullets?.filter(b=>b.trim()).length > 1)) score += 10;
                if (d.educations?.filter(e => e.school).length > 0) score += 15;
                if (d.skills?.filter(s => s.trim()).length > 2) score += 15;
                score = Math.min(100, score);
                
                const isHigh = score >= 80;
                const isMed = score >= 60 && score < 80;
                const color = isHigh ? "#10b981" : isMed ? "#eab308" : "#ef4444";

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    key={r.id} 
                    onClick={() => handleAnalyzeClick(r)}
                    className="space-y-3 group cursor-pointer hover:bg-[var(--bg-secondary)]/30 p-2 -mx-2 rounded-xl transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate pr-4 group-hover:text-[var(--accent-primary)] transition-colors">
                        {r.title}
                      </p>
                      <span className="text-sm font-display font-bold" style={{ color }}>{score}%</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.8 + (i * 0.1), ease: "easeOut" }}
                        className="h-full rounded-full relative" 
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[scan_2s_linear_infinite]" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

      </div>

      {/* Analysis Modal Overlay */}
      <AnimatePresence>
        {selectedResume && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[var(--bg-primary)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[var(--border)] relative custom-scrollbar flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                    ATS Score Analysis
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] font-semibold mt-1">
                    {selectedResume.title}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedResume(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border)] transition-colors text-[var(--text-muted)] hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 rounded-full border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-6" />
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)] animate-pulse">
                      Analyzing Resume Data with AI...
                    </h3>
                  </div>
                ) : analysisResult ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left: Score & Breakdown */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                      <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden bg-[var(--bg-card)]">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50" />
                        <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Overall Match</h2>
                        <ScoreRing score={analysisResult.score || 0} size={180} strokeWidth={12} />
                      </div>

                      <div className="glass-card rounded-3xl p-6 bg-[var(--bg-card)]">
                        <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-5">Score Breakdown</h3>
                        <div className="space-y-5">
                          {(analysisResult.breakdowns || []).map((item, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-[var(--text-primary)] font-bold">{item.label}</span>
                                <span className="font-bold font-display" style={{ color: item.color }}>{item.score}%</span>
                              </div>
                              <div className="h-2 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.score}%` }}
                                  transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}80` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Insights */}
                    <div className="md:col-span-7 flex flex-col gap-6">
                      {/* Missing Keywords */}
                      <div className="glass-card rounded-3xl p-6 border-l-[4px] border-l-[#eab308] bg-[var(--bg-card)]">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-5 h-5 text-[#eab308]" />
                          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Missing Keywords</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(analysisResult.missingKeywords || []).length > 0 ? (
                            analysisResult.missingKeywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-sm font-bold text-[var(--text-primary)]">
                                + {kw}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-[var(--text-muted)] font-medium">No critical keywords missing.</p>
                          )}
                        </div>
                      </div>

                      {/* Suggestions */}
                      <div className="glass-card rounded-3xl p-6 bg-[var(--bg-card)] flex-1">
                        <div className="flex items-center gap-3 mb-6">
                          <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
                          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">AI Suggestions</h3>
                        </div>
                        <div className="space-y-3">
                          {(analysisResult.suggestions || []).map((sug, i) => {
                            const isCritical = sug.type === "critical";
                            const isGood = sug.type === "good";
                            let icon = <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />;
                            if (isCritical) icon = <AlertTriangle className="w-4 h-4 text-red-500" />;
                            if (isGood) icon = <CheckCircle className="w-4 h-4 text-[#10b981]" />;

                            return (
                              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${isCritical ? "bg-red-500/5 border-red-500/20" : isGood ? "bg-[#10b981]/5 border-[#10b981]/20" : "bg-[var(--bg-secondary)]/50 border-[var(--border)]"}`}>
                                <div className="mt-0.5 shrink-0">{icon}</div>
                                <p className={`text-sm leading-relaxed ${isCritical ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-primary)] font-medium"}`}>
                                  {sug.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={() => navigate(`/dashboard/resumes/${selectedResume.id}/edit`)}
                          className="px-6 py-3 bg-[var(--accent-primary)] text-white font-bold rounded-full text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[var(--glow)]"
                        >
                          Edit Resume Now <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
