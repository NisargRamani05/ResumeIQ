import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

function AdminJobs() {
  const jobs = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Active', applicants: 45 },
    { id: 2, title: 'Product Manager', department: 'Product', location: 'New York, NY', type: 'Full-time', status: 'Active', applicants: 12 },
    { id: 3, title: 'UX Designer', department: 'Design', location: 'San Francisco, CA', type: 'Contract', status: 'Closed', applicants: 89 },
    { id: 4, title: 'Data Scientist', department: 'Data', location: 'Remote', type: 'Full-time', status: 'Draft', applicants: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="text-slate-400">Create and manage job postings on the platform.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search jobs by title or department..." className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Job Title</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Applicants</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">{job.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{job.type} • {job.location}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{job.department}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        job.status === 'Active' ? 'success' :
                        job.status === 'Draft' ? 'warning' : 'default'
                      }>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      {job.applicants}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminJobs;
