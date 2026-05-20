import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, Plus, ChevronLeft, Loader, Save } from "lucide-react";
import { createJob, updateJob, getJob, uploadCompanyLogo } from "../../firebase/jobs";
import toast from "react-hot-toast";

const INP = "w-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder-[var(--text-muted)] transition-all";
const LBL = "block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1.5";
const TYPES = ["Full Time","Internship","Part Time","Remote"];

export default function AdminAddJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const logoRef = useRef();

  const blank = { companyName:"",role:"",description:"",skills:[],employmentType:"Full Time",salary:"",location:"",deadline:"",eligibility:"",minCGPA:"",experience:"",certifications:"",preferredSkills:[],website:"",openings:"",logoUrl:"" };
  const [form, setForm] = useState(blank);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [prefInput, setPrefInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const job = await getJob(id);
        setForm({ ...blank, ...job, skills: Array.isArray(job.skills) ? job.skills : (job.skills||"").split(",").map(s=>s.trim()).filter(Boolean), preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills : [] });
        if (job.logoUrl) setLogoPreview(job.logoUrl);
      } catch { toast.error("Failed to load job"); navigate("/admin/jobs"); }
      finally { setFetching(false); }
    })();
  }, [id, isEdit]);

  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const addSkill = (key, input, setInput) => {
    const val = input.trim();
    if (!val) return;
    set(key, [...(form[key]||[]), val]);
    setInput("");
  };

  const removeSkill = (key, i) => set(key, form[key].filter((_,idx)=>idx!==i));

  const handleLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim()) return toast.error("Company name is required");
    if (!form.role.trim()) return toast.error("Job role is required");
    if (!form.description.trim()) return toast.error("Job description is required");
    if (!form.location.trim()) return toast.error("Location is required");

    setLoading(true);
    try {
      let logoUrl = form.logoUrl || "";
      if (logoFile) logoUrl = await uploadCompanyLogo(logoFile);
      const payload = { ...form, logoUrl, skills: form.skills, preferredSkills: form.preferredSkills };
      if (isEdit) { await updateJob(id, payload); toast.success("Job updated!"); }
      else { await createJob(payload); toast.success("Job posted successfully!"); }
      navigate("/admin/jobs");
    } catch(err) {
      console.error(err);
      const msg = err.message || "Failed to save job";
      toast.error(msg.includes("permission") ? "Permission Denied: Update your Firestore Rules!" : msg);
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="flex items-center justify-center h-64"><Loader className="w-8 h-8 text-[var(--accent-primary)] animate-spin"/></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={()=>navigate("/admin/jobs")} className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"><ChevronLeft className="w-5 h-5"/></button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">{isEdit?"Edit Job":"Post New Job"}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">{isEdit?"Update the job posting details":"Fill in the details to create a new job posting"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info */}
        <div className="glass-card border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wide border-b border-[var(--border)] pb-3">Company Information</h2>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div onClick={()=>logoRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent-primary)] cursor-pointer flex items-center justify-center overflow-hidden transition-colors bg-[var(--bg-secondary)] group">
                {logoPreview ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover"/> : <Upload className="w-8 h-8 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]"/>}
              </div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} className="hidden"/>
              <p className="text-xs text-[var(--text-muted)] mt-2 font-semibold text-center">Company Logo</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className={LBL}>Company Name *</label><input className={INP} value={form.companyName} onChange={e=>set("companyName",e.target.value)} placeholder="e.g. Google"/></div>
              <div><label className={LBL}>Website</label><input className={INP} value={form.website} onChange={e=>set("website",e.target.value)} placeholder="https://company.com"/></div>
              <div><label className={LBL}>No. of Openings</label><input className={INP} type="number" min="1" value={form.openings} onChange={e=>set("openings",e.target.value)} placeholder="e.g. 5"/></div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="glass-card border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wide border-b border-[var(--border)] pb-3">Job Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={LBL}>Job Role / Position *</label><input className={INP} value={form.role} onChange={e=>set("role",e.target.value)} placeholder="e.g. Frontend Engineer"/></div>
            <div>
              <label className={LBL}>Employment Type *</label>
              <select className={INP} value={form.employmentType} onChange={e=>set("employmentType",e.target.value)}>
                {TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={LBL}>Location *</label><input className={INP} value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Bangalore, India"/></div>
            <div><label className={LBL}>Salary / Stipend</label><input className={INP} value={form.salary} onChange={e=>set("salary",e.target.value)} placeholder="e.g. ₹12-18 LPA"/></div>
            <div><label className={LBL}>Application Deadline</label><input className={INP} type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)}/></div>
          </div>
          <div>
            <label className={LBL}>Job Description *</label>
            <textarea className={`${INP} min-h-[140px] resize-none`} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe the role, responsibilities, and what the candidate will work on..."/>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wide border-b border-[var(--border)] pb-3">Skills & Requirements</h2>
          <div>
            <label className={LBL}>Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input className={`${INP} flex-1`} value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addSkill("skills",skillInput,setSkillInput);}}} placeholder="Type a skill and press Enter"/>
              <button type="button" onClick={()=>addSkill("skills",skillInput,setSkillInput)} className="px-5 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-bold rounded-xl transition-colors"><Plus className="w-5 h-5"/></button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {form.skills.map((s,i)=><span key={i} className="inline-flex items-center gap-1.5 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"><span>{s}</span><button type="button" onClick={()=>removeSkill("skills",i)} className="hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5"/></button></span>)}
            </div>
          </div>
          <div className="pt-2">
            <label className={LBL}>Preferred Skills (optional)</label>
            <div className="flex gap-2 mb-2">
              <input className={`${INP} flex-1`} value={prefInput} onChange={e=>setPrefInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addSkill("preferredSkills",prefInput,setPrefInput);}}} placeholder="Type a skill and press Enter"/>
              <button type="button" onClick={()=>addSkill("preferredSkills",prefInput,setPrefInput)} className="px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] text-sm font-bold rounded-xl transition-colors"><Plus className="w-5 h-5"/></button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(form.preferredSkills||[]).map((s,i)=><span key={i} className="inline-flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"><span>{s}</span><button type="button" onClick={()=>removeSkill("preferredSkills",i)} className="hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5"/></button></span>)}
            </div>
          </div>
        </div>

        {/* Eligibility (optional) */}
        <div className="glass-card border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <h2 className="text-[var(--text-primary)] font-bold text-sm uppercase tracking-wide border-b border-[var(--border)] pb-3">Eligibility Criteria <span className="text-[var(--text-muted)] font-medium normal-case">(optional)</span></h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={LBL}>Eligibility</label><input className={INP} value={form.eligibility} onChange={e=>set("eligibility",e.target.value)} placeholder="e.g. B.Tech / BE in CS/IT"/></div>
            <div><label className={LBL}>Min. CGPA</label><input className={INP} type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={e=>set("minCGPA",e.target.value)} placeholder="e.g. 7.0"/></div>
            <div><label className={LBL}>Experience Required</label><input className={INP} value={form.experience} onChange={e=>set("experience",e.target.value)} placeholder="e.g. 0-2 years / Fresher"/></div>
            <div><label className={LBL}>Certifications</label><input className={INP} value={form.certifications} onChange={e=>set("certifications",e.target.value)} placeholder="e.g. AWS Certified"/></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={()=>navigate("/admin/jobs")} className="px-6 py-3 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-xl text-sm font-bold transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 hover:scale-105 shadow-[var(--glow)] disabled:opacity-60 disabled:hover:scale-100 text-white text-sm font-bold rounded-xl transition-all">
            {loading ? <><Loader className="w-4 h-4 animate-spin"/>Saving...</> : <><Save className="w-4 h-4"/>{isEdit?"Update Job":"Post Job"}</>}
          </button>
        </div>
      </form>
    </div>
  );
}