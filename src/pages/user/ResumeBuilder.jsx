import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, ChevronRight, ChevronLeft, CheckCircle, User, Briefcase, GraduationCap, Star, FileText, X, Save, Loader, Award, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { createResume, updateResume, getUserResumes } from "../../firebase/resumes";
import ResumeTemplate from "../../components/resume/ResumeTemplate";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i));
const DEGREES = ["High School Diploma", "HSC", "Bachelor of Science", "B.Tech", "Bachelor of Engineering", "Master of Science", "MBA", "Ph.D", "Other"];
const STEPS = [
  { id: "contact", label: "Contact", desc: "Personal info", icon: User },
  { id: "experience", label: "Experience", desc: "Work history", icon: Briefcase },
  { id: "education", label: "Education", desc: "Academic background", icon: GraduationCap },
  { id: "skills", label: "Skills", desc: "Your expertise", icon: Star },
  { id: "achievements", label: "Achievements", desc: "Awards & milestones", icon: Award },
  { id: "summary", label: "Bio & Summary", desc: "Profile overview", icon: BookOpen },
];
const newExp = () => ({ id: Date.now(), jobTitle: "", employer: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", current: false, bullets: [""] });
const newEdu = () => ({ id: Date.now(), school: "", degree: "", field: "", gradMonth: "", gradYear: "", status: "Completed", cgpa: "", startYear: "", location: "" });
const INP = "w-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder-[var(--text-muted)] transition-all";
const LBL = "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2";

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
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", city: "", state: "", linkedin: "", github: "", jobTitle: "" });
  const [experiences, setExperiences] = useState([newExp()]);
  const [educations, setEducations] = useState([newEdu()]);
  const [skills, setSkills] = useState([""]);
  const [summary, setSummary] = useState("");
  const [bio, setBio] = useState("");
  const [achievements, setAchievements] = useState([""]);
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
          setContact(found.data?.contact || { firstName: "", lastName: "", email: "", phone: "", city: "", state: "", linkedin: "", github: "", jobTitle: "" });
          setExperiences(found.data?.experiences || [newExp()]);
          setEducations(found.data?.educations || [newEdu()]);
          setSkills(found.data?.skills || [""]);
          setSummary(found.data?.summary || "");
          setBio(found.data?.bio || "");
          setAchievements(found.data?.achievements || [""]);
          
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
    const resumeData = { contact, experiences, educations, skills, summary, bio, achievements };
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

  const previewContent = <ResumeTemplate data={{ contact, experiences, educations, skills, summary, bio, achievements }} />;

  if (loadingResume) return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
      <Loader className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
    </div>
  );

  return (
    <div className="flex h-full min-h-screen bg-[var(--bg-primary)]" style={{ margin: "-24px" }}>
      {/* ── LEFT: form area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="shrink-0 bg-[var(--bg-card)] border-b border-[var(--border)] px-8 py-5 flex items-center gap-5 shadow-sm">
          <button onClick={() => navigate("/dashboard/resumes")} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] p-2 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <input
            className="bg-transparent border-b-2 border-transparent focus:border-[var(--accent-primary)] text-[var(--text-primary)] font-display font-bold text-lg outline-none px-1 py-1 w-64 transition-colors placeholder-[var(--text-muted)]"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Resume title..."
          />
          <div className="flex-1" />
          <button onClick={() => setPreview(p => !p)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/10 transition-all shadow-sm">
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? "Hide Preview" : "Preview"}
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-8 py-10 relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeInOut" }}>

                {step === 0 && (
                  <div className="space-y-6">
                    <div><h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Contact Information</h2><p className="text-[var(--text-muted)] text-sm mt-1">How can employers reach you?</p></div>
                    <div className="glass-card border border-[var(--border)] rounded-2xl p-8 grid grid-cols-2 gap-6">
                      <div><label className={LBL}>First Name</label><input className={INP} value={contact.firstName} onChange={e => setC("firstName", e.target.value)} placeholder="John" /></div>
                      <div><label className={LBL}>Last Name</label><input className={INP} value={contact.lastName} onChange={e => setC("lastName", e.target.value)} placeholder="Doe" /></div>
                      <div className="col-span-2"><label className={LBL}>Job Title / Role</label><input className={INP} value={contact.jobTitle} onChange={e => setC("jobTitle", e.target.value)} placeholder="DevOps / Cloud Engineer" /></div>
                      <div><label className={LBL}>Email</label><input className={INP} type="email" value={contact.email} onChange={e => setC("email", e.target.value)} placeholder="john@example.com" /></div>
                      <div><label className={LBL}>Phone</label><input className={INP} value={contact.phone} onChange={e => setC("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
                      <div><label className={LBL}>City</label><input className={INP} value={contact.city} onChange={e => setC("city", e.target.value)} placeholder="Mumbai" /></div>
                      <div><label className={LBL}>State</label><input className={INP} value={contact.state} onChange={e => setC("state", e.target.value)} placeholder="Maharashtra" /></div>
                      <div><label className={LBL}>LinkedIn (optional)</label><input className={INP} value={contact.linkedin} onChange={e => setC("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" /></div>
                      <div><label className={LBL}>GitHub (optional)</label><input className={INP} value={contact.github} onChange={e => setC("github", e.target.value)} placeholder="github.com/yourname" /></div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div><h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Work History</h2><p className="text-[var(--text-muted)] text-sm mt-1">List your most recent positions first.</p></div>
                    {experiences.map((exp, ei) => (
                      <div key={exp.id} className="glass-card border border-[var(--border)] rounded-3xl p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                          <span className="text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] px-4 py-1.5 rounded-full border border-[var(--border)]">Position {ei + 1}</span>
                          {experiences.length > 1 && <button onClick={() => setExperiences(p => p.filter(e => e.id !== exp.id))} className="text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div><label className={LBL}>Job Title</label><input className={INP} value={exp.jobTitle} onChange={e => updExp(exp.id, "jobTitle", e.target.value)} placeholder="Software Engineer" /></div>
                          <div><label className={LBL}>Employer</label><input className={INP} value={exp.employer} onChange={e => updExp(exp.id, "employer", e.target.value)} placeholder="Company Name" /></div>
                          <div className="col-span-2"><label className={LBL}>City</label><input className={INP} value={exp.city} onChange={e => updExp(exp.id, "city", e.target.value)} placeholder="Mumbai" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div><label className={LBL}>Start Date</label><div className="flex gap-2"><select className={INP} value={exp.startMonth} onChange={e => updExp(exp.id, "startMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select><select className={INP} value={exp.startYear} onChange={e => updExp(exp.id, "startYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div></div>
                          {!exp.current && <div><label className={LBL}>End Date</label><div className="flex gap-2"><select className={INP} value={exp.endMonth} onChange={e => updExp(exp.id, "endMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select><select className={INP} value={exp.endYear} onChange={e => updExp(exp.id, "endYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div></div>}
                        </div>
                        <label className="flex items-center gap-3 text-sm text-[var(--text-primary)] font-semibold cursor-pointer select-none bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"><input type="checkbox" checked={exp.current} onChange={e => updExp(exp.id, "current", e.target.checked)} className="accent-[var(--accent-primary)] w-5 h-5 cursor-pointer" />I currently work here</label>
                        <div className="pt-2">
                          <label className={LBL}>Key Achievements</label>
                          <div className="space-y-3">
                            {exp.bullets.map((b, bi) => (
                              <div key={bi} className="flex gap-3 items-start">
                                <span className="text-[var(--accent-primary)] text-xl leading-none pt-2">•</span>
                                <input className={`${INP} flex-1`} value={b} onChange={e => updBul(exp.id, bi, e.target.value)} placeholder="Describe an achievement..." />
                                {exp.bullets.length > 1 && <button onClick={() => remBul(exp.id, bi)} className="text-[var(--text-muted)] hover:text-red-500 p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-colors"><X className="w-4 h-4" /></button>}
                              </div>
                            ))}
                            <button onClick={() => addBul(exp.id)} className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-sm font-bold flex items-center gap-1.5 mt-2 px-4 py-2 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"><Plus className="w-4 h-4" />Add bullet point</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setExperiences(p => [...p, newExp()])} className="w-full py-4 border-2 border-dashed border-[var(--border)] hover:border-[var(--accent-primary)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--accent-primary)]/5 rounded-2xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] font-bold text-sm flex items-center justify-center gap-2 transition-all"><Plus className="w-5 h-5" />Add Another Position</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div><h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Education</h2><p className="text-[var(--text-muted)] text-sm mt-1">Your academic background.</p></div>
                    {educations.map((edu, ei) => (
                      <div key={edu.id} className="glass-card border border-[var(--border)] rounded-3xl p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                          <span className="text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] px-4 py-1.5 rounded-full border border-[var(--border)]">Education {ei + 1}</span>
                          {educations.length > 1 && <button onClick={() => setEducations(p => p.filter(e => e.id !== edu.id))} className="text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="col-span-2"><label className={LBL}>School / University</label><input className={INP} value={edu.school} onChange={e => updEdu(edu.id, "school", e.target.value)} placeholder="CHARUSAT University" /></div>
                          <div><label className={LBL}>Degree</label><select className={INP} value={edu.degree} onChange={e => updEdu(edu.id, "degree", e.target.value)}><option value="">Select degree</option>{DEGREES.map(d => <option key={d}>{d}</option>)}</select></div>
                          <div><label className={LBL}>Field of Study</label><input className={INP} value={edu.field} onChange={e => updEdu(edu.id, "field", e.target.value)} placeholder="Computer Science" /></div>
                          <div><label className={LBL}>Location</label><input className={INP} value={edu.location} onChange={e => updEdu(edu.id, "location", e.target.value)} placeholder="Changa, Gujarat" /></div>
                          <div>
                            <label className={LBL}>Status</label>
                            <select className={INP} value={edu.status} onChange={e => updEdu(edu.id, "status", e.target.value)}>
                              <option value="Completed">Completed</option>
                              <option value="Pursuing">Pursuing</option>
                            </select>
                          </div>
                          <div><label className={LBL}>CGPA / Percentage</label><input className={INP} value={edu.cgpa} onChange={e => updEdu(edu.id, "cgpa", e.target.value)} placeholder="8.97 / 10" /></div>
                          {edu.status === 'Pursuing' ? (
                            <div><label className={LBL}>Start Year</label><select className={INP} value={edu.startYear} onChange={e => updEdu(edu.id, "startYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                          ) : (
                            <div><label className={LBL}>Graduation Date</label><div className="flex gap-2"><select className={INP} value={edu.gradMonth} onChange={e => updEdu(edu.id, "gradMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select><select className={INP} value={edu.gradYear} onChange={e => updEdu(edu.id, "gradYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div></div>
                          )}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setEducations(p => [...p, newEdu()])} className="w-full py-4 border-2 border-dashed border-[var(--border)] hover:border-[var(--accent-primary)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--accent-primary)]/5 rounded-2xl text-[var(--text-muted)] hover:text-[var(--accent-primary)] font-bold text-sm flex items-center justify-center gap-2 transition-all"><Plus className="w-5 h-5" />Add Another School</button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div><h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Skills</h2><p className="text-[var(--text-muted)] text-sm mt-1">Add relevant skills for the role you are targeting.</p></div>
                    <div className="glass-card border border-[var(--border)] rounded-3xl p-8 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {skills.map((s, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input className={`${INP} flex-1`} value={s} onChange={e => updSkl(i, e.target.value)} placeholder="e.g. React, Python..." />
                            {skills.length > 1 && <button onClick={() => setSkills(p => p.filter((_, si) => si !== i))} className="text-[var(--text-muted)] hover:text-red-500 p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:border-red-500/50 hover:bg-red-500/10 transition-colors"><X className="w-4 h-4" /></button>}
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSkills(p => [...p, ""])} className="text-[var(--accent-primary)] hover:text-[var(--accent-primary)] font-bold text-sm flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors mt-2"><Plus className="w-4 h-4" />Add Skill</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div><h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Achievements</h2><p className="text-[var(--text-muted)] text-sm mt-1">Hackathons, awards, certifications, notable projects.</p></div>
                    <div className="glass-card border border-[var(--border)] rounded-3xl p-8 space-y-4">
                      {achievements.map((a, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="text-[var(--accent-primary)] text-xl leading-none pt-2">🏆</span>
                          <input className={`${INP} flex-1`} value={a} onChange={e => setAchievements(p => p.map((x, xi) => xi === i ? e.target.value : x))} placeholder="Smart India Hackathon 2025: Built a Gamified Learning Platform..." />
                          {achievements.length > 1 && <button onClick={() => setAchievements(p => p.filter((_, xi) => xi !== i))} className="text-[var(--text-muted)] hover:text-red-500 p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-colors"><X className="w-4 h-4" /></button>}
                        </div>
                      ))}
                      <button onClick={() => setAchievements(p => [...p, ""])} className="text-[var(--accent-primary)] font-bold text-sm flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"><Plus className="w-4 h-4" />Add Achievement</button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div><h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">Bio & Summary</h2><p className="text-[var(--text-muted)] text-sm mt-1">A short bio and a professional career summary.</p></div>
                    <div className="glass-card border border-[var(--border)] rounded-3xl p-8 space-y-6">
                      <div>
                        <label className={LBL}>Profile Bio <span className="normal-case font-normal">(shown as PROFILE section)</span></label>
                        <textarea className={`${INP} min-h-[120px] resize-none leading-relaxed`} value={bio} onChange={e => setBio(e.target.value)} placeholder="Passionate software engineer focused on building scalable systems..." />
                        <p className="text-xs font-semibold text-[var(--text-muted)] mt-2 text-right">{bio.length} chars</p>
                      </div>
                      <div>
                        <label className={LBL}>Professional Summary <span className="normal-case font-normal">(shown as SUMMARY section)</span></label>
                        <textarea className={`${INP} min-h-[160px] resize-none leading-relaxed`} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Dedicated software engineer with 5+ years of experience in building cloud-native applications..." />
                        <p className="text-xs font-semibold text-[var(--text-muted)] mt-2 text-right">{summary.length} chars</p>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--border)] mb-10 relative z-10">
              <button onClick={() => go(-1)} disabled={step === 0} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-card)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm">
                <ChevronLeft className="w-4 h-4" />Back
              </button>
              {step < STEPS.length - 1
                ? <button onClick={() => go(1)} className="flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] hover:scale-105 hover:shadow-[var(--glow)] text-white text-sm font-bold rounded-xl transition-all">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
                : <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-[#10b981] hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:hover:scale-100">
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : isEditing ? "Update Resume" : "Save Resume"}
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Vertical Step Tracker ── */}
      <div className="hidden lg:flex w-[320px] shrink-0 bg-[var(--bg-card)] border-l border-[var(--border)] flex-col py-10 px-8 relative z-20 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-10">Builder Progress</p>
        <div className="relative flex flex-col gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const cur = i === step;
            const last = i === STEPS.length - 1;
            return (
              <div key={s.id} className="relative flex gap-5 cursor-pointer group" onClick={() => { setDir(i > step ? 1 : -1); setStep(i); }}>
                {/* Vertical connector line */}
                {!last && (
                  <div className="absolute left-[23px] top-12 w-0.5 h-full z-0 transition-colors duration-500" style={{ background: done ? "var(--accent-primary)" : "var(--border)" }} />
                )}
                {/* Icon circle */}
                <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-all duration-300 mt-0 ${done ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] shadow-[var(--glow)]"
                    : cur ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]"
                      : "bg-[var(--bg-secondary)] border-[var(--border)] group-hover:border-[var(--text-muted)]"
                  }`}>
                  {done
                    ? <CheckCircle className="w-5 h-5 text-white" />
                    : <Icon className={`w-5 h-5 ${cur ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}`} />
                  }
                </div>
                {/* Label */}
                <div className="pb-10 pt-1">
                  <p className={`text-sm font-bold transition-colors ${cur ? "text-[var(--accent-primary)]" : done ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}`}>{s.label}</p>
                  <p className={`text-xs mt-1 font-medium transition-colors ${cur ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion indicator */}
        <div className="mt-auto pt-6 border-t border-[var(--border)]">
          <div className="mb-3 flex justify-between text-xs font-bold text-[var(--text-muted)]">
            <span className="uppercase tracking-wider">Completion Profile</span>
            <span className={step === STEPS.length - 1 ? "text-[#10b981]" : "text-[var(--text-primary)]"}>{Math.round((step / (STEPS.length - 1)) * 100)}%</span>
          </div>
          <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border)]">
            <div className={`h-full rounded-full transition-all duration-700 ease-out ${step === STEPS.length - 1 ? "bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-[var(--accent-primary)] shadow-[var(--glow)]"}`} style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setPreview(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed right-0 top-0 bottom-0 w-[550px] z-50 bg-[var(--bg-secondary)] border-l border-[var(--border)] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-card)]">
                <span className="text-base font-display font-bold text-[var(--text-primary)]">Live Document Preview</span>
                <button onClick={() => setPreview(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-[var(--bg-secondary)]">{previewContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}