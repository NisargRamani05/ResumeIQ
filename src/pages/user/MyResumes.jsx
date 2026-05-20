import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Pencil, Trash2, Eye, X, Calendar, Briefcase, Loader, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getUserResumes, deleteResume } from '../../firebase/resumes';
import ResumeTemplate from '../../components/resume/ResumeTemplate';

function ResumePreviewModal({ resume, onClose }) {
  const d = resume.data;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h3 className="text-[var(--text-primary)] font-bold font-display">{resume.title}</h3>
            <div className="flex items-center gap-2">
              <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2 text-sm font-semibold">
                <Download className="w-4 h-4" /> Export
              </button>
              <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 bg-[var(--bg-secondary)]/50">
            <ResumeTemplate data={d} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function MyResumes() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewResume, setViewResume] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserResumes(currentUser.uid);
      setResumes(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resumes. Check Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [currentUser]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteResume(id);
      setResumes(p => p.filter(r => r.id !== id));
      toast.success('Resume deleted');
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between relative z-10"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] tracking-tight">My Resumes</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {loading ? 'Loading documents...' : `Managing ${resumes.length} optimized document${resumes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/resumes/new')}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent-primary)] hover:scale-105 hover:shadow-[var(--glow)] text-white text-sm font-bold rounded-full transition-all"
        >
          <Plus className="w-4 h-4" /> Create New
        </button>
      </motion.div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {Array.from({length:3}).map((_,i)=>(
            <div key={i} className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] shrink-0"/>
                <div className="flex-1 space-y-2"><div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4"/><div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2"/></div>
              </div>
              <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/2"/>
              <div className="h-10 bg-[var(--bg-secondary)] rounded-xl"/>
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-secondary)]/50 text-center relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-6 shadow-sm border border-[var(--border)]">
            <FileText className="w-10 h-10 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-[var(--text-primary)] font-display font-bold text-2xl mb-2">No resumes yet</h3>
          <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">Create your first resume with our AI-powered builder and start landing interviews.</p>
          <button
            onClick={() => navigate('/dashboard/resumes/new')}
            className="flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] hover:scale-105 hover:shadow-[var(--glow)] text-white text-sm font-bold rounded-full transition-all"
          >
            <Plus className="w-4 h-4" /> Start Building
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {resumes.map((resume, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={resume.id} 
              className="group glass-card hover:border-[var(--accent-primary)]/50 rounded-2xl p-6 flex flex-col gap-5 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[var(--text-primary)] font-bold text-lg truncate group-hover:text-[var(--accent-primary)] transition-colors">{resume.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm mt-0.5 truncate">
                    {resume.data?.contact?.firstName} {resume.data?.contact?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                {resume.data?.experiences?.[0]?.jobTitle && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="truncate">{resume.data.experiences[0].jobTitle}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Modified {formatDate(resume.savedAt)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => setViewResume(resume)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)]/10 border border-[var(--border)] hover:border-[var(--accent-primary)]/30 rounded-xl transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => navigate(`/dashboard/resumes/${resume.id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:text-[#10b981] bg-[var(--bg-secondary)] hover:bg-[#10b981]/10 border border-[var(--border)] hover:border-[#10b981]/30 rounded-xl transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(resume.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:text-red-500 bg-[var(--bg-secondary)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 rounded-xl transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {viewResume && <ResumePreviewModal resume={viewResume} onClose={() => setViewResume(null)} />}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-red-500/30 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[var(--text-primary)] font-display font-bold text-xl mb-2">Delete Resume?</h3>
            <p className="text-[var(--text-muted)] text-sm mb-8">This action is permanent and cannot be undone. All data will be lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="flex-1 py-3 border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] rounded-xl text-[var(--text-primary)] text-sm font-bold transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-xl text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {deleting ? <><Loader className="w-4 h-4 animate-spin"/>Deleting</> : 'Delete Document'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
