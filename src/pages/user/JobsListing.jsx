import React, { useState, useEffect } from "react";
import { Search, Briefcase } from "lucide-react";
import { getJobs } from "../../firebase/jobs";
import JobCard from "../../components/jobs/JobCard";
import EmptyState from "../../components/ui/EmptyState";
import { JobCardSkeleton } from "../../components/ui/LoadingSkeleton";
import toast from "react-hot-toast";

const TYPES = ["All","Full Time","Internship","Part Time","Remote"];

export default function JobsListing() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch { toast.error("Failed to load jobs"); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.role?.toLowerCase().includes(search.toLowerCase()) || j.companyName?.toLowerCase().includes(search.toLowerCase()) || j.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || j.employmentType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[var(--accent-secondary)]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] tracking-tight">Browse Jobs</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">{loading ? "Loading available positions..." : `Found ${filtered.length} opportunit${filtered.length===1?"y":"ies"} matching your criteria`}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"/>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search role, company, location..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)]">
          {TYPES.map(t=>(
            <button key={t} onClick={()=>setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                ${typeFilter===t ? "bg-[var(--accent-primary)] text-white shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({length:6}).map((_,i)=><JobCardSkeleton key={i}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-secondary)]/50 text-center relative z-10">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-6 shadow-sm border border-[var(--border)]">
              <Briefcase className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-[var(--text-primary)] font-display font-bold text-2xl mb-2">No jobs found</h3>
            <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">Try adjusting your search criteria or resetting the filters to see more opportunities.</p>
            <button
              onClick={() => { setSearch(''); setTypeFilter('All'); }}
              className="flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] hover:scale-105 hover:shadow-[var(--glow)] text-white text-sm font-bold rounded-full transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(job=><JobCard key={job.id} job={job}/>)}
          </div>
        )}
      </div>
    </div>
  );
}