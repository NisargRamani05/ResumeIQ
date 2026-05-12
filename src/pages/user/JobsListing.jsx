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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Jobs</h1>
        <p className="text-slate-400 text-sm mt-0.5">{loading ? "Loading..." : `${filtered.length} opportunit${filtered.length===1?"y":"ies"} found`}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search role, company, location..."
            className="w-full bg-[#0d1a2d] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none placeholder-slate-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t=>(
            <button key={t} onClick={()=>setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border
                ${typeFilter===t ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-[#0d1a2d] border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:6}).map((_,i)=><JobCardSkeleton key={i}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try adjusting your search or filters to find opportunities."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(job=><JobCard key={job.id} job={job}/>)}
        </div>
      )}
    </div>
  );
}