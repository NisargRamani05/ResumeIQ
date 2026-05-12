import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Pencil, Trash2, Eye, X, Calendar, Briefcase, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getUserResumes, deleteResume } from '../../firebase/resumes';

function ResumePreviewModal({ resume, onClose }) {
  const d = resume.data;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1a2d] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-white font-semibold">{resume.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg p-8 text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
            <header className="text-center border-b-2 border-slate-900 pb-4 mb-5">
              <h1 className="text-2xl font-black uppercase tracking-widest">
                {(d.contact?.firstName || 'Your') + ' ' + (d.contact?.lastName || 'Name')}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-slate-500 mt-2">
                {d.contact?.email && <span>{d.contact.email}</span>}
                {d.contact?.phone && <><span>|</span><span>{d.contact.phone}</span></>}
                {(d.contact?.city || d.contact?.state) && <><span>|</span><span>{[d.contact.city, d.contact.state].filter(Boolean).join(', ')}</span></>}
              </div>
            </header>
            {d.summary && (
              <section className="mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Summary</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{d.summary}</p>
              </section>
            )}
            {d.experiences?.some(e => e.jobTitle || e.employer) && (
              <section className="mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Experience</h2>
                {d.experiences.filter(e => e.jobTitle || e.employer).map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">{exp.jobTitle}</span>
                      <span className="text-xs text-slate-400">{exp.startMonth} {exp.startYear}{(exp.startMonth || exp.startYear) ? ' – ' : ''}{exp.current ? 'Present' : `${exp.endMonth} ${exp.endYear}`}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">{exp.employer}{exp.city ? `, ${exp.city}` : ''}</p>
                    {exp.bullets?.filter(b => b).map((b, bi) => <div key={bi} className="flex gap-1.5 mt-0.5"><span>•</span><span className="text-xs text-slate-600">{b}</span></div>)}
                  </div>
                ))}
              </section>
            )}
            {d.educations?.some(e => e.school) && (
              <section className="mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Education</h2>
                {d.educations.filter(e => e.school).map((edu, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">{edu.degree}{edu.field ? ` – ${edu.field}` : ''}</span>
                      <span className="text-xs text-slate-400">{edu.gradMonth} {edu.gradYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">{edu.school}</p>
                  </div>
                ))}
              </section>
            )}
            {d.skills?.filter(s => s).length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {d.skills.filter(s => s).map((s, i) => <span key={i} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">{s}</span>)}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
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
    // Handle Firestore Timestamps and ISO strings
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Resumes</h1>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? 'Loading...' : `${resumes.length} resume${resumes.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/resumes/new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <Plus className="w-4 h-4" /> Create Resume
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:3}).map((_,i)=>(
            <div key={i} className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0"/>
                <div className="flex-1 space-y-2"><div className="h-4 bg-slate-800 rounded w-3/4"/><div className="h-3 bg-slate-800 rounded w-1/2"/></div>
              </div>
              <div className="h-3 bg-slate-800 rounded w-1/2"/>
              <div className="h-10 bg-slate-800 rounded-xl"/>
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-800 rounded-2xl text-center">
          <FileText className="w-12 h-12 text-slate-700 mb-4" />
          <h3 className="text-slate-300 font-semibold text-lg mb-1">No resumes yet</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first resume to get started</p>
          <button
            onClick={() => navigate('/dashboard/resumes/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map(resume => (
            <div key={resume.id} className="group bg-[#0d1a2d] border border-slate-800 hover:border-blue-600/40 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              {/* Icon + Title */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{resume.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">
                    {resume.data?.contact?.firstName} {resume.data?.contact?.lastName}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5">
                {resume.data?.experiences?.[0]?.jobTitle && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                    <span className="truncate">{resume.data.experiences[0].jobTitle}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Saved {formatDate(resume.savedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => setViewResume(resume)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => navigate(`/dashboard/resumes/${resume.id}/edit`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 hover:text-emerald-400 hover:bg-emerald-600/10 rounded-lg transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(resume.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewResume && <ResumePreviewModal resume={viewResume} onClose={() => setViewResume(null)} />}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1a2d] border border-slate-700 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Delete Resume?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="flex-1 py-2.5 border border-slate-700 rounded-xl text-slate-300 hover:border-slate-500 text-sm font-medium transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-60 rounded-xl text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {deleting ? <><Loader className="w-4 h-4 animate-spin"/>Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
