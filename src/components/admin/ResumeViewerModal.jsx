import React, { useEffect, useState } from "react";
import { X, Loader } from "lucide-react";
import { getResumeById } from "../../firebase/resumes";

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
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-[#0d1a2d] border border-slate-700 rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
          <h3 className="text-white font-bold mb-4">Resume Not Found</h3>
          <p className="text-slate-400 text-sm mb-6">This resume might have been deleted.</p>
          <button onClick={onClose} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">Close</button>
        </div>
      </div>
    );
  }

  const { contact = {}, experiences = [], educations = [], skills = [], summary = "" } = resume.data || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 flex flex-col shadow-2xl w-full max-w-2xl max-h-[90vh] rounded-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <span className="text-sm font-bold text-white">Resume Viewer - {resume.title || "Untitled"}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="bg-white rounded-lg p-8 text-slate-900" style={{ fontFamily: "Georgia,serif" }}>
            <header className="text-center border-b-2 border-slate-900 pb-4 mb-5">
              <h1 className="text-xl font-black uppercase tracking-widest">{(contact.firstName || "Your") + " " + (contact.lastName || "Name")}</h1>
              <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-slate-500 mt-1">
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <><span>|</span><span>{contact.phone}</span></>}
                {(contact.city || contact.state) && <><span>|</span><span>{[contact.city, contact.state].filter(Boolean).join(", ")}</span></>}
              </div>
            </header>
            
            {summary && (
              <section className="mb-3">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Summary</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{summary}</p>
              </section>
            )}
            
            {experiences.some(e => e.jobTitle || e.employer) && (
              <section className="mb-3">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Experience</h2>
                {experiences.filter(e => e.jobTitle || e.employer).map(exp => (
                  <div key={exp.id} className="mb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">{exp.jobTitle}</span>
                      <span className="text-xs text-slate-400">{exp.startMonth} {exp.startYear}{(exp.startMonth || exp.startYear) ? " – " : ""}{exp.current ? "Present" : `${exp.endMonth} ${exp.endYear}`}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">{exp.employer}{exp.city ? `, ${exp.city}` : ""}</p>
                    {exp.bullets?.filter(b => b).map((b, i) => (
                      <div key={i} className="flex gap-1 mt-0.5">
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{b}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}
            
            {educations.some(e => e.school) && (
              <section className="mb-3">
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Education</h2>
                {educations.filter(e => e.school).map(edu => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold">{edu.degree}{edu.field ? ` – ${edu.field}` : ""}</span>
                      <span className="text-xs text-slate-400">{edu.gradMonth} {edu.gradYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">{edu.school}</p>
                  </div>
                ))}
              </section>
            )}
            
            {skills.filter(s => s).length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {skills.filter(s => s).map((s, i) => (
                    <span key={i} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
