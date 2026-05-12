import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, ChevronRight, ChevronLeft, CheckCircle, User, Briefcase, GraduationCap, Star, FileText, X, Save, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { createResume, updateResume, getUserResumes } from "../../firebase/resumes";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i));
const DEGREES = ["High School Diploma", "HSC", "Bachelor of Science", "B.Tech", "Bachelor of Engineering", "Master of Science", "MBA", "Ph.D", "Other"];
const STEPS = [
  { id: "contact", label: "Contact", desc: "Personal info", icon: User },
  { id: "experience", label: "Experience", desc: "Work history", icon: Briefcase },
  { id: "education", label: "Education", desc: "Academic background", icon: GraduationCap },
  { id: "skills", label: "Skills", desc: "Your expertise", icon: Star },
  { id: "summary", label: "Summary", desc: "Career overview", icon: FileText },
];
const newExp = () => ({ id: Date.now(), jobTitle: "", employer: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", current: false, bullets: [""] });
const newEdu = () => ({ id: Date.now(), school: "", degree: "", field: "", gradMonth: "", gradYear: "" });
const INP = "w-full bg-[#0d1a2d] border border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-sm text-white outline-none placeholder-slate-500 transition-all";
const LBL = "block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const isEditing = Boolean(id);

  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingResume, setLoadingResume] = useState(isEditing);
  const [title, setTitle] = useState("My Resume");
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", state: "", linkedin: "" });
  const [experiences, setExperiences] = useState([newExp()]);
  const [educations, setEducations] = useState([newEdu()]);
  const [skills, setSkills] = useState([""]);
  const [summary, setSummary] = useState("");
  const [dir, setDir] = useState(1);

  // Load existing resume from Firestore if editing
  useEffect(() => {
    if (!isEditing || !currentUser) return;
    (async () => {
      setLoadingResume(true);
      try {
        const all = await getUserResumes(currentUser.uid);
        const found = all.find(r => r.id === id);
        if (found) {
          setTitle(found.title || "My Resume");
          setContact(found.data?.contact || { firstName: "", lastName: "", email: "", phone: "", city: "", state: "", linkedin: "" });
          setExperiences(found.data?.experiences || [newExp()]);
          setEducations(found.data?.educations || [newEdu()]);
          setSkills(found.data?.skills || [""]);
          setSummary(found.data?.summary || "");
        } else {
          toast.error("Resume not found");
          navigate("/dashboard/resumes");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load resume");
        navigate("/dashboard/resumes");
      } finally {
        setLoadingResume(false);
      }
    })();
  }, [id, isEditing, currentUser]);

  const go = (d) => { setDir(d); setStep(s => s + d); };
  const setC = (k, v) => setContact(p => ({ ...p, [k]: v }));
  const updExp = (eid, k, v) => setExperiences(p => p.map(e => e.id === eid ? { ...e, [k]: v } : e));
  const updBul = (eid, i, v) => setExperiences(p => p.map(e => e.id === eid ? { ...e, bullets: e.bullets.map((b, bi) => bi === i ? v : b) } : e));
  const addBul = (eid) => setExperiences(p => p.map(e => e.id === eid ? { ...e, bullets: [...e.bullets, ""] } : e));
  const remBul = (eid, i) => setExperiences(p => p.map(e => e.id === eid ? { ...e, bullets: e.bullets.filter((_, bi) => bi !== i) } : e));
  const updEdu = (eid, k, v) => setEducations(p => p.map(e => e.id === eid ? { ...e, [k]: v } : e));
  const updSkl = (i, v) => setSkills(p => p.map((s, si) => si === i ? v : s));

  const handleSave = async () => {
    if (!currentUser) { toast.error("Please log in to save"); return; }
    setSaving(true);
    const resumeData = { contact, experiences, educations, skills, summary };
    try {
      if (isEditing) {
        await updateResume(id, { title, data: resumeData });
        toast.success("Resume updated!");
      } else {
        await createResume(currentUser.uid, { title, data: resumeData });
        toast.success("Resume saved to cloud!");
      }
      navigate("/dashboard/resumes");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save resume. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  const previewContent = (
    <div className="bg-white rounded-lg p-8 text-slate-900" style={{ fontFamily: "Georgia,serif" }}>
      <header className="text-center border-b-2 border-slate-900 pb-4 mb-5">
        <h1 className="text-xl font-black uppercase tracking-widest">{(contact.firstName || "Your") + " " + (contact.lastName || "Name")}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-slate-500 mt-1">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <><span>|</span><span>{contact.phone}</span></>}
          {(contact.city || contact.state) && <><span>|</span><span>{[contact.city, contact.state].filter(Boolean).join(", ")}</span></>}
        </div>
      </header>
      {summary && <section className="mb-3"><h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Summary</h2><p className="text-xs text-slate-600 leading-relaxed">{summary}</p></section>}
      {experiences.some(e => e.jobTitle || e.employer) && (
        <section className="mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Experience</h2>
          {experiences.filter(e => e.jobTitle || e.employer).map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between"><span className="text-sm font-bold">{exp.jobTitle}</span><span className="text-xs text-slate-400">{exp.startMonth} {exp.startYear}{(exp.startMonth || exp.startYear) ? " – " : ""}{exp.current ? "Present" : `${exp.endMonth} ${exp.endYear}`}</span></div>
              <p className="text-xs text-slate-500 italic">{exp.employer}{exp.city ? `, ${exp.city}` : ""}</p>
              {exp.bullets.filter(b => b).map((b, i) => <div key={i} className="flex gap-1 mt-0.5"><span className="text-slate-400">•</span><span className="text-xs text-slate-600">{b}</span></div>)}
            </div>
          ))}
        </section>
      )}
      {educations.some(e => e.school) && (
        <section className="mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Education</h2>
          {educations.filter(e => e.school).map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between"><span className="text-sm font-bold">{edu.degree}{edu.field ? ` – ${edu.field}` : ""}</span><span className="text-xs text-slate-400">{edu.gradMonth} {edu.gradYear}</span></div>
              <p className="text-xs text-slate-500 italic">{edu.school}</p>
            </div>
          ))}
        </section>
      )}
      {skills.filter(s => s).length > 0 && (
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Skills</h2>
          <div className="flex flex-wrap gap-1">{skills.filter(s => s).map((s, i) => <span key={i} className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{s}</span>)}</div>
        </section>
      )}
    </div>
  );

  if (loadingResume) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <Loader className="w-8 h-8 text-blue-400 animate-spin" />
    </div>
  );

  return (
    <div className="flex h-full min-h-screen bg-slate-950" style={{ margin: "-24px" }}>
      {/* ── LEFT: form area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="shrink-0 bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard/resumes")} className="text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            className="bg-transparent border-b border-slate-700 focus:border-blue-500 text-white font-semibold text-sm outline-none px-1 py-0.5 w-52 transition-colors"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Resume title..."
          />
          <div className="flex-1" />
          <button onClick={() => setPreview(p => !p)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-blue-400 border border-slate-700 hover:border-blue-600/50 transition-all">
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? "Hide Preview" : "Preview"}
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22, ease: "easeInOut" }}>

                {step === 0 && (
                  <div className="space-y-6">
                    <div><h2 className="text-2xl font-bold text-white">Contact Information</h2><p className="text-slate-400 text-sm mt-1">How can employers reach you?</p></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={LBL}>First Name</label><input className={INP} value={contact.firstName} onChange={e => setC("firstName", e.target.value)} placeholder="John" /></div>
                      <div><label className={LBL}>Last Name</label><input className={INP} value={contact.lastName} onChange={e => setC("lastName", e.target.value)} placeholder="Doe" /></div>
                      <div><label className={LBL}>Email</label><input className={INP} type="email" value={contact.email} onChange={e => setC("email", e.target.value)} placeholder="john@example.com" /></div>
                      <div><label className={LBL}>Phone</label><input className={INP} value={contact.phone} onChange={e => setC("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
                      <div><label className={LBL}>City</label><input className={INP} value={contact.city} onChange={e => setC("city", e.target.value)} placeholder="Mumbai" /></div>
                      <div><label className={LBL}>State</label><input className={INP} value={contact.state} onChange={e => setC("state", e.target.value)} placeholder="Maharashtra" /></div>
                      <div className="col-span-2"><label className={LBL}>LinkedIn (optional)</label><input className={INP} value={contact.linkedin} onChange={e => setC("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" /></div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div><h2 className="text-2xl font-bold text-white">Work History</h2><p className="text-slate-400 text-sm mt-1">List your most recent positions first.</p></div>
                    {experiences.map((exp, ei) => (
                      <div key={exp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-300">Position {ei + 1}</span>
                          {experiences.length > 1 && <button onClick={() => setExperiences(p => p.filter(e => e.id !== exp.id))} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={LBL}>Job Title</label><input className={INP} value={exp.jobTitle} onChange={e => updExp(exp.id, "jobTitle", e.target.value)} placeholder="Software Engineer" /></div>
                          <div><label className={LBL}>Employer</label><input className={INP} value={exp.employer} onChange={e => updExp(exp.id, "employer", e.target.value)} placeholder="Company Name" /></div>
                          <div><label className={LBL}>City</label><input className={INP} value={exp.city} onChange={e => updExp(exp.id, "city", e.target.value)} placeholder="Mumbai" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={LBL}>Start Date</label><div className="flex gap-2"><select className={INP} value={exp.startMonth} onChange={e => updExp(exp.id, "startMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select><select className={INP} value={exp.startYear} onChange={e => updExp(exp.id, "startYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div></div>
                          {!exp.current && <div><label className={LBL}>End Date</label><div className="flex gap-2"><select className={INP} value={exp.endMonth} onChange={e => updExp(exp.id, "endMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select><select className={INP} value={exp.endYear} onChange={e => updExp(exp.id, "endYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div></div>}
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer"><input type="checkbox" checked={exp.current} onChange={e => updExp(exp.id, "current", e.target.checked)} className="accent-blue-500 w-4 h-4" />I currently work here</label>
                        <div>
                          <label className={LBL}>Key Achievements</label>
                          <div className="space-y-2">
                            {exp.bullets.map((b, bi) => (
                              <div key={bi} className="flex gap-2 items-center">
                                <span className="text-blue-500 text-lg leading-none">•</span>
                                <input className={`${INP} flex-1`} value={b} onChange={e => updBul(exp.id, bi, e.target.value)} placeholder="Describe an achievement..." />
                                {exp.bullets.length > 1 && <button onClick={() => remBul(exp.id, bi)} className="text-slate-600 hover:text-red-400"><X className="w-4 h-4" /></button>}
                              </div>
                            ))}
                            <button onClick={() => addBul(exp.id)} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add bullet</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setExperiences(p => [...p, newExp()])} className="w-full py-3 border-2 border-dashed border-slate-800 hover:border-blue-600/50 rounded-xl text-slate-500 hover:text-blue-400 text-sm flex items-center justify-center gap-2 transition-all"><Plus className="w-4 h-4" />Add Another Position</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div><h2 className="text-2xl font-bold text-white">Education</h2><p className="text-slate-400 text-sm mt-1">Your academic background.</p></div>
                    {educations.map((edu, ei) => (
                      <div key={edu.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-300">Education {ei + 1}</span>
                          {educations.length > 1 && <button onClick={() => setEducations(p => p.filter(e => e.id !== edu.id))} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2"><label className={LBL}>School / University</label><input className={INP} value={edu.school} onChange={e => updEdu(edu.id, "school", e.target.value)} placeholder="University of Mumbai" /></div>
                          <div><label className={LBL}>Degree</label><select className={INP} value={edu.degree} onChange={e => updEdu(edu.id, "degree", e.target.value)}><option value="">Select degree</option>{DEGREES.map(d => <option key={d}>{d}</option>)}</select></div>
                          <div><label className={LBL}>Field of Study</label><input className={INP} value={edu.field} onChange={e => updEdu(edu.id, "field", e.target.value)} placeholder="Computer Science" /></div>
                          <div><label className={LBL}>Graduation Date</label><div className="flex gap-2"><select className={INP} value={edu.gradMonth} onChange={e => updEdu(edu.id, "gradMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select><select className={INP} value={edu.gradYear} onChange={e => updEdu(edu.id, "gradYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div></div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setEducations(p => [...p, newEdu()])} className="w-full py-3 border-2 border-dashed border-slate-800 hover:border-blue-600/50 rounded-xl text-slate-500 hover:text-blue-400 text-sm flex items-center justify-center gap-2 transition-all"><Plus className="w-4 h-4" />Add Another School</button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div><h2 className="text-2xl font-bold text-white">Skills</h2><p className="text-slate-400 text-sm mt-1">Add relevant skills for the role you are targeting.</p></div>
                    <div className="grid grid-cols-2 gap-3">
                      {skills.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input className={`${INP} flex-1`} value={s} onChange={e => updSkl(i, e.target.value)} placeholder="e.g. React, Python..." />
                          {skills.length > 1 && <button onClick={() => setSkills(p => p.filter((_, si) => si !== i))} className="text-slate-600 hover:text-red-400"><X className="w-4 h-4" /></button>}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSkills(p => [...p, ""])} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1.5"><Plus className="w-4 h-4" />Add Skill</button>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div><h2 className="text-2xl font-bold text-white">Professional Summary</h2><p className="text-slate-400 text-sm mt-1">A compelling 2-4 sentence overview of your career.</p></div>
                    <div>
                      <textarea className={`${INP} min-h-[200px] resize-none`} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Dedicated software engineer with 5+ years of experience..." />
                      <p className="text-xs text-slate-600 mt-1.5 text-right">{summary.length} characters</p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
              <button onClick={() => go(-1)} disabled={step === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium">
                <ChevronLeft className="w-4 h-4" />Back
              </button>
              {step < STEPS.length - 1
                ? <button onClick={() => go(1)} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
                : <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : isEditing ? "Update Resume" : "Save Resume"}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Vertical Step Tracker ── */}
      <div className="hidden lg:flex w-64 shrink-0 bg-slate-900 border-l border-slate-800 flex-col py-10 px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Progress</p>
        <div className="relative flex flex-col gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const cur = i === step;
            const last = i === STEPS.length - 1;
            return (
              <div key={s.id} className="relative flex gap-4 cursor-pointer group" onClick={() => { setDir(i > step ? 1 : -1); setStep(i); }}>
                {/* Vertical connector line */}
                {!last && (
                  <div className="absolute left-5 top-10 w-0.5 h-full z-0" style={{ background: done ? "#2563eb" : "#1e293b" }} />
                )}
                {/* Icon circle */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 mt-0 ${done ? "bg-blue-600 border-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                    : cur ? "bg-blue-600/20 border-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.4)]"
                      : "bg-slate-900 border-slate-700 group-hover:border-slate-500"
                  }`}>
                  {done
                    ? <CheckCircle className="w-4 h-4 text-white" />
                    : <Icon className={`w-4 h-4 ${cur ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                  }
                </div>
                {/* Label */}
                <div className="pb-8">
                  <p className={`text-sm font-semibold transition-colors ${cur ? "text-blue-400" : done ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>{s.label}</p>
                  <p className={`text-xs mt-0.5 transition-colors ${cur ? "text-blue-400/70" : done ? "text-slate-400" : "text-slate-600"}`}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion indicator */}
        <div className="mt-auto">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Completion</span>
            <span>{Math.round((step / (STEPS.length - 1)) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setPreview(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed right-0 top-0 bottom-0 w-[480px] z-50 bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <span className="text-sm font-bold text-white">Resume Preview</span>
                <button onClick={() => setPreview(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{previewContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}