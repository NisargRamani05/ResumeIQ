import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Target, Search } from "lucide-react";
import FeatureCard from "../../components/FeatureCard";

const Typewriter = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1500);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 50 : 100, parseInt(Math.random() * 150)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="text-[var(--accent-primary)] font-bold">
      {`${words[index].substring(0, subIndex)}${subIndex === words[index].length + 1 ? "" : "|"}`}
    </span>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Zap,
      title: "Instant ATS Scoring",
      description: "Our AI breaks down your resume exactly how applicant tracking systems do, giving you a precise pass/fail probability.",
      delay: 0.1
    },
    {
      icon: Target,
      title: "Skill Gap Detection",
      description: "Upload a job description and we'll instantly highlight the exact keywords and skills your resume is missing.",
      delay: 0.2
    },
    {
      icon: Search,
      title: "Action Verb Analysis",
      description: "Replace weak phrases with powerful action verbs proven to increase interview callbacks by up to 40%.",
      delay: 0.3
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-primary)]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[var(--accent-secondary)]/5 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-screen">
        
        {/* Left: Copy */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--accent-primary)] tracking-wide uppercase mb-6 shadow-[var(--glow)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
            </span>
            ResumeIQ Engine v2.0 Live
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Your Resume.<br />
            <span className="text-[var(--text-muted)]">Analyzed by AI.</span><br />
            Perfected by You.
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 h-16 max-w-xl mx-auto lg:mx-0">
            Get an instant <Typewriter words={["ATS Score", "Keyword Analysis", "Skill Gap Detection"]} />
            <br className="hidden md:block"/> and land your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => navigate('/upload')}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto text-sm font-bold text-black bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[var(--glow)]"
            >
              Analyze My Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="#features"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto text-sm font-bold text-white bg-transparent border border-[var(--border)] rounded-full overflow-hidden transition-all hover:bg-white/5 hover:border-white/20"
            >
              <Play className="w-4 h-4 fill-white/20 group-hover:fill-white/80 transition-colors" /> See Demo
            </a>
          </div>
        </motion.div>

        {/* Right: Floating Resume Graphic */}
        <div className="flex-1 hidden lg:block relative w-full h-full min-h-[500px] z-10 perspective-[1000px]">
          <div className="animate-float absolute right-0 top-1/2 -translate-y-1/2 w-[380px] h-[480px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 transform rotate-y-[-10deg] rotate-x-[5deg] shadow-[var(--glow)]">
            <div className="w-16 h-16 bg-slate-800 rounded-full mb-2" />
            <div className="h-6 w-3/4 bg-slate-800 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-800/50 rounded-md mb-6" />
            
            <div className="space-y-3">
              <div className="h-3 w-full bg-slate-800 rounded-md" />
              <div className="h-3 w-full bg-slate-800 rounded-md" />
              <div className="h-3 w-5/6 bg-slate-800 rounded-md" />
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30 rounded-full" />
                <div className="h-6 w-24 bg-slate-800 rounded-full" />
                <div className="h-6 w-16 bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-primary)] z-20 animate-[scan_3s_ease-in-out_infinite]" />
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes scan {
                0%, 100% { top: 0%; opacity: 0; }
                10%, 90% { opacity: 1; }
                50% { top: 100%; }
              }
            `}} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-[var(--border)] bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">Perfection</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Stop guessing what recruiters want. Our AI decodes your experience and maps it perfectly to applicant tracking algorithms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <FeatureCard key={idx} {...feat} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
