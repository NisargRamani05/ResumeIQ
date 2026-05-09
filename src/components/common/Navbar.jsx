import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from '../ui/Button';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold text-white tracking-tight">ResumeIQ</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link to="/#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
          <Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
