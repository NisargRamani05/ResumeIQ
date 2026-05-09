import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Search, Filter } from 'lucide-react';

function JobTracker() {
  const applications = [
    { id: 1, company: 'Acme Corp', role: 'Frontend Developer', status: 'Interview', date: '2023-10-25', location: 'Remote' },
    { id: 2, company: 'Globex UI', role: 'UX Designer', status: 'Applied', date: '2023-10-23', location: 'New York, NY' },
    { id: 3, company: 'Soylent', role: 'Full Stack Engineer', status: 'Rejected', date: '2023-10-15', location: 'San Francisco, CA' },
    { id: 4, company: 'Initech', role: 'Software Engineer', status: 'Offer', date: '2023-10-10', location: 'Austin, TX' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Tracker</h1>
          <p className="text-slate-400">Manage and track all your job applications in one place.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Application
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search company or role..." className="pl-9" />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date Applied</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-100">{app.company}</td>
                    <td className="px-6 py-4">{app.role}</td>
                    <td className="px-6 py-4 text-slate-400">{app.location}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        app.status === 'Offer' ? 'success' :
                        app.status === 'Interview' ? 'warning' :
                        app.status === 'Rejected' ? 'danger' : 'primary'
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{app.date}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
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

export default JobTracker;
