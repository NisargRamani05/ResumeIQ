import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileText, Briefcase, Star, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getUserResumes } from '../../firebase/resumes';
import { getUserApplications } from '../../firebase/applications';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const [resData, appData] = await Promise.all([
          getUserResumes(currentUser.uid),
          getUserApplications(currentUser.uid)
        ]);
        setResumes(resData);
        setApplications(appData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  const interviews = applications.filter(a => a.status === 'Interview Scheduled').length;
  const recentApps = applications.slice(0, 3); // Applications are already sorted by date descending

  const fmt = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN",{day:"numeric",month:"short"});
  };

  const getBadgeVariant = (status) => {
    if (status === 'Interview Scheduled' || status === 'Shortlisted') return 'warning';
    if (status === 'Rejected') return 'danger';
    if (status === 'Selected') return 'primary'; // Or success if you add that variant
    return 'primary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#0d1a2d] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? "-" : resumes.length}</div>
            <p className="text-xs text-slate-500">Created so far</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1a2d] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Applications Sent</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? "-" : applications.length}</div>
            <p className="text-xs text-slate-500">Total applied</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1a2d] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Interviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loading ? "-" : interviews}</div>
            <p className="text-xs text-slate-500">Scheduled interviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#0d1a2d] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500">Loading...</p>
            ) : recentApps.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 mb-3">You haven't applied to any jobs yet.</p>
                <Button onClick={() => navigate('/dashboard/jobs')} size="sm">Browse Jobs</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApps.map((app, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-200">{app.companyName || 'Company'}</p>
                      <p className="text-sm text-slate-400">{app.jobTitle || 'Position'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={getBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                      <span className="text-xs text-slate-500">{fmt(app.appliedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-[#0d1a2d] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Resume ATS Scores</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-slate-500">Loading scores...</p>
            ) : resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <p className="text-sm text-slate-500">No resumes found</p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/resumes/new')}>Create Resume</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumes.slice(0, 4).map(r => {
                  // Calculate ATS Score heuristic based on resume completeness
                  const d = r.data || {};
                  let score = 0;
                  if (d.contact?.firstName && d.contact?.email) score += 15;
                  if (d.summary?.length > 20) score += 15;
                  if (d.experiences?.filter(e => e.jobTitle).length > 0) score += 30;
                  if (d.experiences?.some(e => e.bullets?.filter(b=>b.trim()).length > 1)) score += 10;
                  if (d.educations?.filter(e => e.school).length > 0) score += 15;
                  if (d.skills?.filter(s => s.trim()).length > 2) score += 15;
                  
                  // Cap at 98 for realism if missing slight things
                  score = Math.min(100, score);
                  
                  // Determine color based on score
                  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";

                  return (
                    <div key={r.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-200 truncate pr-4">{r.title}</p>
                        <span className={`text-xs font-bold ${score >= 80 ? "text-emerald-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                          {score}/100
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })}
                {resumes.length > 4 && (
                   <p className="text-xs text-center text-slate-500 pt-2">+ {resumes.length - 4} more resumes</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserDashboard;
