import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Briefcase, Zap } from 'lucide-react';
import Button from '../../components/ui/Button';

function Landing() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="heading-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Build Your Resume & Track Jobs with AI
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            ResumeIQ is the ultimate platform for modern professionals. Create stunning resumes, track your applications, and land your dream job faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="heading-2">Everything You Need to Succeed</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              Our platform provides all the tools required to stand out in today's competitive job market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Resume Builder</h3>
              <p className="text-slate-400">
                Create ATS-friendly resumes in minutes with our intelligent drag-and-drop builder and AI suggestions.
              </p>
            </div>

            <div className="glass-card p-8 space-y-4 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-500">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Application Tracker</h3>
              <p className="text-slate-400">
                Keep track of all your job applications, interviews, and offers in one centralized kanban board.
              </p>
            </div>

            <div className="glass-card p-8 space-y-4 hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center text-green-500">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant Feedback</h3>
              <p className="text-slate-400">
                Get real-time feedback on your resume and interview preparation using our advanced AI models.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
