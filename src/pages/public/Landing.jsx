import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUp, Play, Zap, Target, Search, FileText, CheckCircle2, LayoutDashboard, Star, ChevronRight, BarChart } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const companies = ["Google", "Microsoft", "Meta", "Amazon", "Netflix", "Apple", "Spotify", "Tesla", "Airbnb"];

  const features = [
    { icon: FileText, title: "AI Resume Builder", desc: "Build ATS-friendly resumes in minutes with intelligent suggestions." },
    { icon: Zap, title: "ATS Score Checker", desc: "Instantly see how likely your resume is to pass automated HR filters." },
    { icon: LayoutDashboard, title: "Job Tracker", desc: "Manage all your applications and upcoming interviews in one place." },
    { icon: BarChart, title: "Resume Analytics", desc: "Deep insights into keyword density and action verb usage." },
    { icon: Target, title: "Smart Suggestions", desc: "Get actionable advice on missing skills and experience gaps." },
    { icon: Search, title: "Dashboard Insights", desc: "Track your overall hiring pipeline health visually." }
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Software Engineer @ Google", text: "ResumeIQ completely transformed my job hunt. The ATS scoring is incredibly accurate." },
    { name: "Michael Chang", role: "Product Manager @ Stripe", text: "I landed 3x more interviews after applying the smart keyword suggestions." },
    { name: "Elena Rodriguez", role: "UX Designer @ Airbnb", text: "The cleanest, most professional resume builder I've ever used. The UI is stunning." }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[var(--accent-primary)]/10 blur-[150px] pointer-events-none rounded-b-full mix-blend-screen" />
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center min-h-[90vh] justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 flex flex-col items-center max-w-4xl"
        >


          <h1 className="font-display text-5xl md:text-7xl font-bold text-[var(--text-primary)] leading-[1.1] mb-6 tracking-tight">
            Create Resumes. Analyze ATS. Track Jobs.<br />
            <span className="gradient-text">All in One Platform.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-10 leading-relaxed">
            Stop guessing what recruiters want. Our enterprise-grade AI analyzes your resume against millions of data points to guarantee ATS success.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/upload')}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto text-sm font-bold text-white bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 shadow-[var(--glow)]"
            >
              Start For Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden transition-all hover:bg-[var(--bg-card)]">
              <Play className="w-4 h-4 text-[var(--text-primary)]" /> Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trusted Companies Slider */}
      <section className="py-10 border-y border-[var(--border)] bg-[var(--bg-secondary)]/30 backdrop-blur-md relative z-10 overflow-hidden">
        <p className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Trusted by candidates at</p>
        <div className="relative w-full flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...companies, ...companies, ...companies].map((company, i) => (
              <span key={i} className="mx-8 text-2xl font-display font-bold text-[var(--text-muted)]/50 hover:text-[var(--text-primary)] transition-colors cursor-default">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Everything you need to <span className="gradient-text">get hired</span>.
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
            A complete suite of AI tools designed specifically to optimize your job application process from end to end.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl group hover:-translate-y-2 transition-transform duration-300 hover:border-[var(--accent-primary)]/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent-primary)]/10 transition-colors">
                <feat.icon className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
              </div>
              <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3">{feat.title}</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Mockup Showcase */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] rounded-[40px] p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--accent-primary)]/5 blur-[100px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1">
              <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-6">
                Your hiring pipeline, <br />visualized.
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-8">
                Track every application, analyze your resume scores, and prepare for interviews within a single, unified dashboard designed for modern job seekers.
              </p>
              <ul className="space-y-4 mb-10">
                {['Kanban board for applications', 'Real-time ATS scoring', 'Automated follow-up reminders'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--text-primary)] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[var(--accent-primary)]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full perspective-[2000px]">
              <motion.div
                initial={{ rotateY: 20, rotateX: 10, scale: 0.9 }}
                whileInView={{ rotateY: -10, rotateX: 5, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full glass-card rounded-2xl border-[8px] border-[var(--bg-card)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                {/* Mock Dashboard UI */}
                <div className="h-10 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="p-6 bg-[var(--bg-primary)] grid grid-cols-2 gap-4">
                  <div className="col-span-2 h-24 rounded-xl bg-[var(--bg-secondary)] p-4 flex items-center justify-between border border-[var(--border)]">
                    <div>
                      <div className="h-3 w-20 bg-[var(--text-muted)]/30 rounded mb-2" />
                      <div className="h-6 w-32 bg-[var(--accent-primary)]/80 rounded" />
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-[var(--accent-primary)] border-l-transparent animate-spin" />
                  </div>
                  <div className="h-32 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4">
                    <div className="h-2 w-full bg-[var(--text-muted)]/20 rounded mb-2" />
                    <div className="h-2 w-5/6 bg-[var(--text-muted)]/20 rounded mb-2" />
                    <div className="h-2 w-4/6 bg-[var(--text-muted)]/20 rounded" />
                  </div>
                  <div className="h-32 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 flex flex-col gap-2">
                    <div className="flex-1 bg-[var(--accent-secondary)]/20 rounded border border-[var(--accent-secondary)]/30" />
                    <div className="flex-1 bg-[var(--accent-primary)]/20 rounded border border-[var(--accent-primary)]/30" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 px-6 relative z-10 max-w-7xl mx-auto">
        <h2 className="text-center font-display text-4xl font-bold text-[var(--text-primary)] mb-16">
          Loved by top <span className="gradient-text">talent</span>.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 rounded-3xl relative"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />)}
              </div>
              <p className="text-[var(--text-primary)] text-lg mb-8">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-primary)]">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{t.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative z-10 flex justify-center">
        <div className="relative w-full max-w-5xl rounded-[40px] overflow-hidden p-16 text-center border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-90 mix-blend-multiply dark:mix-blend-color" />
          <div className="absolute inset-0 bg-[var(--bg-primary)] opacity-80" />

          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
              Ready to get hired?
            </h2>
            <p className="text-[var(--text-muted)] text-xl max-w-2xl mx-auto mb-10">
              Join thousands of professionals landing their dream jobs with ResumeIQ.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold text-white bg-[var(--accent-primary)] rounded-full hover:scale-105 transition-transform shadow-[var(--glow)]"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              zIndex: 9999,
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "var(--accent-primary)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--glow), 0 8px 32px rgba(0,0,0,0.3)",
            }}
            whileHover={{ scale: 1.15, y: -3 }}
            whileTap={{ scale: 0.92 }}
          >
            <ArrowUp style={{ width: "22px", height: "22px", color: "#fff", strokeWidth: 2.5 }} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
