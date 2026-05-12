import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1120] pt-24 pb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                R
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Resume<span className="text-blue-400">IQ</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              The next-generation AI-powered career platform. Build stunning resumes, track applications, and land your dream job faster.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">AI Resume Builder</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Job Tracker</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">ATS Checker</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Templates</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ResumeIQ Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-400">
            <Link to="#" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <FiTwitter size={18} />
            </Link>
            <Link to="#" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <FiGithub size={18} />
            </Link>
            <Link to="#" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <FiLinkedin size={18} />
            </Link>
            <Link to="#" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <FiInstagram size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
