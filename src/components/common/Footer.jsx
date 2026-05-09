import React from 'react';
import { Briefcase } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 py-12 text-slate-400">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold text-white tracking-tight">ResumeIQ</span>
            </div>
            <p className="text-sm">
              The AI-powered platform for building professional resumes and tracking job applications seamlessly.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Resume Builder</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Job Tracker</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Career Advice</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Interview Prep</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm">© {new Date().getFullYear()} ResumeIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
