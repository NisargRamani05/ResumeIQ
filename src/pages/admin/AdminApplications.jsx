import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Filter } from 'lucide-react';

function AdminApplications() {
  const applications = [
    { id: 1, applicant: 'John Doe', job: 'Senior Frontend Developer', status: 'Pending', date: '2023-10-25', score: '92%' },
    { id: 2, applicant: 'Jane Smith', job: 'Product Manager', status: 'Interviewing', date: '2023-10-24', score: '88%' },
    { id: 3, applicant: 'Robert Johnson', job: 'UX Designer', status: 'Rejected', date: '2023-10-20', score: '45%' },
    { id: 4, applicant: 'Emily Davis', job: 'Data Scientist', status: 'Offer Extended', date: '2023-10-18', score: '98%' },
    { id: 5, applicant: 'Michael Brown', job: 'Senior Frontend Developer', status: 'Pending', date: '2023-10-26', score: '76%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications Tracking</h1>
          <p className="text-slate-400">Review and manage candidate applications across all jobs.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search applicants or jobs..." className="pl-9" />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" /> Filter Status
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Applied Job</th>
                  <th className="px-6 py-4 font-medium">AI Score</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-100">{app.applicant}</td>
                    <td className="px-6 py-4 text-slate-300">{app.job}</td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="text-blue-400 font-semibold">{app.score}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        app.status === 'Offer Extended' ? 'success' :
                        app.status === 'Interviewing' ? 'warning' :
                        app.status === 'Rejected' ? 'danger' : 'primary'
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{app.date}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="sm">Review</Button>
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

export default AdminApplications;
