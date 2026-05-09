import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileText, Briefcase, Star, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Resume
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-slate-500">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Applications Sent</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500">+4 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Interviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-slate-500">Next one in 3 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: 'Acme Corp', role: 'Frontend Developer', status: 'Interview', date: '2 days ago' },
                { company: 'Globex UI', role: 'UX Designer', status: 'Applied', date: '4 days ago' },
                { company: 'Soylent', role: 'Full Stack Engineer', status: 'Rejected', date: '1 week ago' },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{app.company}</p>
                    <p className="text-sm text-slate-400">{app.role}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={app.status === 'Interview' ? 'warning' : app.status === 'Applied' ? 'primary' : 'danger'}>
                      {app.status}
                    </Badge>
                    <span className="text-xs text-slate-500">{app.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resume Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-slate-800">
              <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
                <circle
                  cx="60"
                  cy="60"
                  r="56"
                  className="stroke-blue-600"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="351"
                  strokeDashoffset="70"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-2xl font-bold">80%</span>
            </div>
            <p className="text-center text-sm text-slate-400">
              Your main profile is almost complete. Add your latest project to reach 100%.
            </p>
            <Button variant="secondary" size="sm">Update Profile</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserDashboard;
