import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FiArrowRight, FiFileText, FiBriefcase, FiPieChart, FiCpu, FiLayout, FiCheckCircle } from 'react-icons/fi';
import { FaGoogle, FaMicrosoft, FaSpotify, FaAmazon, FaAirbnb } from 'react-icons/fa';

function Landing() {
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="bg-[#0B1120] text-slate-200 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              ResumeIQ v2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Engineering the <br />
              <span className="text-gradient">Future of Careers</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed mb-10">
              The AI-powered platform that builds ATS-optimized resumes, tracks your applications, and provides intelligent career insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
                Start Building Free <FiArrowRight className="ml-2" />
              </button>
              <button className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg">
                View Templates
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B1120] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>Joined by <span className="text-white font-medium">10,000+</span> professionals</p>
            </div>
          </motion.div>

          {/* Hero Right Mockup - Resume Builder UI */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            style={{ y: yOffset }}
            className="relative lg:h-[600px] flex items-center justify-center hidden md:flex"
          >
            <div className="relative w-full max-w-[600px] aspect-[4/3] glass-card rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-2">
              {/* Mockup Header */}
              <div className="h-10 bg-[#111827] border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Resume Editor</div>
              </div>
              
              {/* Mockup Content (Resume Builder Layout) */}
              <div className="flex h-[calc(100%-40px)] bg-[#0B1120]/50 relative">
                {/* Sidebar (Form Inputs) */}
                <div className="w-1/3 border-r border-white/5 p-4 flex flex-col gap-4 overflow-hidden relative">
                  <div className="w-full h-8 bg-[#1F2937] rounded-md border border-white/5 flex items-center px-3 gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div></div>
                    <div className="w-16 h-2 bg-slate-600 rounded"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-24 h-2 bg-slate-600 rounded mb-1"></div>
                    <div className="w-full h-6 bg-[#111827] border border-white/5 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-1/2 h-6 bg-[#111827] border border-white/5 rounded"></div>
                      <div className="w-1/2 h-6 bg-[#111827] border border-white/5 rounded"></div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-2">
                    <div className="w-20 h-2 bg-slate-600 rounded mb-1"></div>
                    <div className="w-full h-16 bg-[#111827] border border-white/5 rounded"></div>
                  </div>
                  
                  {/* Glowing active field */}
                  <motion.div 
                    animate={{ borderColor: ['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.6)', 'rgba(59,130,246,0.2)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 left-4 right-4 h-10 bg-blue-500/5 border border-blue-500/50 rounded flex items-center px-3"
                  >
                    <div className="w-20 h-2 bg-blue-400/50 rounded"></div>
                    <div className="w-[1px] h-4 bg-blue-400 ml-1 animate-pulse"></div>
                  </motion.div>
                </div>

                {/* Main Area (Resume Preview) */}
                <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-br from-[#111827]/50 to-[#0B1120]/50 relative">
                  {/* A4 Paper Mockup */}
                  <div className="w-full h-full max-w-[280px] bg-white rounded-sm shadow-2xl p-5 flex flex-col gap-4 origin-top transition-transform">
                    {/* Header */}
                    <div className="flex flex-col items-center gap-2 border-b border-slate-200 pb-3">
                      <div className="w-32 h-3 bg-slate-800 rounded"></div>
                      <div className="w-40 h-2 bg-slate-400 rounded"></div>
                      <div className="flex gap-3">
                        <div className="w-12 h-1.5 bg-slate-300 rounded"></div>
                        <div className="w-16 h-1.5 bg-slate-300 rounded"></div>
                        <div className="w-12 h-1.5 bg-slate-300 rounded"></div>
                      </div>
                    </div>
                    {/* Experience */}
                    <div className="space-y-2">
                      <div className="w-20 h-2 bg-slate-800 rounded mb-2"></div>
                      <div className="flex justify-between items-center">
                        <div className="w-24 h-2 bg-slate-600 rounded"></div>
                        <div className="w-12 h-1.5 bg-slate-300 rounded"></div>
                      </div>
                      <div className="w-32 h-1.5 bg-slate-400 rounded"></div>
                      <div className="space-y-1.5 pl-2 mt-2">
                        <div className="w-full h-1.5 bg-slate-200 rounded"></div>
                        <div className="w-full h-1.5 bg-slate-200 rounded"></div>
                        <div className="w-4/5 h-1.5 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    {/* Education */}
                    <div className="space-y-2 mt-2">
                      <div className="w-20 h-2 bg-slate-800 rounded mb-2"></div>
                      <div className="flex justify-between items-center">
                        <div className="w-28 h-2 bg-slate-600 rounded"></div>
                        <div className="w-10 h-1.5 bg-slate-300 rounded"></div>
                      </div>
                      <div className="w-20 h-1.5 bg-slate-400 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Scanning Effect over resume */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                    className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10 opacity-50"
                  />
                </div>
              </div>
              
              {/* Floating Element Over Mockup */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 bottom-8 bg-[#1F2937] border border-white/10 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                  <FiCheckCircle size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">ATS Score: 98%</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Perfect match</p>
                </div>
              </motion.div>

              {/* Floating AI Suggestion */}
              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-20 bg-[#1F2937] border border-blue-500/30 px-3 py-2 rounded-lg shadow-xl flex items-center gap-2 backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <p className="text-[11px] font-medium text-blue-100">AI: Rephrased for impact</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TRUSTED BY (Infinite Marquee) --- */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col items-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">Trusted by professionals at</p>
          <div className="w-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B1120] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B1120] to-transparent z-10" />
            <div className="flex w-[200%] animate-marquee opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center justify-around w-1/2">
                <FaGoogle className="text-4xl text-white" />
                <FaMicrosoft className="text-4xl text-white" />
                <FaSpotify className="text-4xl text-white" />
                <FaAmazon className="text-4xl text-white" />
                <FaAirbnb className="text-4xl text-white" />
              </div>
              <div className="flex items-center justify-around w-1/2">
                <FaGoogle className="text-4xl text-white" />
                <FaMicrosoft className="text-4xl text-white" />
                <FaSpotify className="text-4xl text-white" />
                <FaAmazon className="text-4xl text-white" />
                <FaAirbnb className="text-4xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <h2 className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-4">About ResumeIQ</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Built for the modern <br /> job seeker.
              </h3>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                ResumeIQ was born from a simple frustration: building a high-quality, ATS-optimized resume shouldn't require a degree in design or hours of formatting in Word.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                We're on a mission to democratize career growth. By combining cutting-edge AI with world-class design, we've created a platform that not only helps you build a stunning resume but actively guides you through the entire application process. We're here to help you land the interview and secure the offer.
              </p>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <div className="bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#1F2937]/50 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
                  <FiCpu size={24} />
                </div>
                <h4 className="text-white font-bold mb-2">AI-Driven</h4>
                <p className="text-slate-400 text-sm">Powered by advanced LLMs to write compelling copy.</p>
              </div>
              <div className="bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center mt-8 hover:bg-[#1F2937]/50 transition-colors">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4">
                  <FiCheckCircle size={24} />
                </div>
                <h4 className="text-white font-bold mb-2">ATS-Optimized</h4>
                <p className="text-slate-400 text-sm">Engineered to pass automated screening systems.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">A powerful suite of tools</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to navigate the modern job market, perfectly integrated into a single blazing-fast platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiCpu, title: "AI Resume Generator", desc: "Instantly create tailored resumes based on job descriptions using advanced LLMs." },
              { icon: FiPieChart, title: "ATS Optimization", desc: "Real-time scoring and keyword suggestions to ensure you pass automated screens." },
              { icon: FiBriefcase, title: "Smart Job Tracker", desc: "Kanban boards and automated status updates for all your ongoing applications." },
              { icon: FiLayout, title: "Premium Templates", desc: "Dozens of pixel-perfect, professionally designed templates exported to PDF in seconds." },
              { icon: FiFileText, title: "Cover Letter AI", desc: "Generate compelling cover letters that match your resume's tone and the job's requirements." },
              { icon: FiCheckCircle, title: "Interview Prep", desc: "AI-driven mock interview questions tailored to the exact role you are applying for." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 group hover:scale-[1.02] hover:bg-[#1F2937]/50 transition-all duration-300 border-white/5 hover:border-blue-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DASHBOARD SHOWCASE (Parallax) --- */}
      <section id="dashboard" className="py-32 relative overflow-hidden bg-gradient-to-b from-[#0B1120] to-[#111827]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Command center for your career
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Stop using spreadsheets. Our intuitive dashboard gives you a bird's-eye view of your entire job search journey. Track interviews, offers, and rejections with beautiful analytics.
              </p>
              <ul className="space-y-4 mb-10">
                {['Drag-and-drop Kanban board', 'Automated email parsing', 'Real-time analytics & conversion rates'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <FiCheckCircle size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary">Explore Dashboard <FiArrowRight className="ml-2" /></button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex-1 w-full"
            >
              <div className="relative w-full aspect-[4/3] bg-[#0B1120] rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-2">
                {/* Simulated UI App inside */}
                <div className="w-full h-full bg-[#111827] rounded-xl border border-white/5 flex flex-col">
                   <div className="h-12 border-b border-white/5 flex items-center justify-between px-6">
                      <div className="text-white font-bold text-sm">Dashboard</div>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                        <div className="w-6 h-6 bg-white/10 rounded-full"></div>
                      </div>
                   </div>
                   <div className="flex-1 p-6 flex gap-6">
                      <div className="flex-1 bg-[#1F2937]/50 rounded-lg border border-white/5 p-4 flex flex-col gap-3">
                         <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                         <div className="w-full h-16 bg-white/5 rounded"></div>
                         <div className="w-full h-16 bg-white/5 rounded"></div>
                      </div>
                      <div className="flex-1 bg-[#1F2937]/50 rounded-lg border border-white/5 p-4 flex flex-col gap-3">
                         <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                         <div className="w-full h-16 bg-white/5 rounded border-l-2 border-blue-500"></div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATISTICS --- */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 text-center">
            {[
              { num: "10K+", label: "Resumes Built" },
              { num: "5K+", label: "Job Applications" },
              { num: "95%", label: "ATS Optimization" },
              { num: "1000+", label: "Active Users" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center px-4"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.num}</div>
                <div className="text-sm text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-[#0B1120] z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 relative z-10 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Ready to upgrade your <br />
            <span className="text-gradient">Career Trajectory?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals landing interviews at top tech companies using ResumeIQ's intelligent tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="btn-primary text-lg px-10 py-5 w-full sm:w-auto shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              Get Started for Free
            </button>
            <p className="text-sm text-slate-500 mt-4 sm:mt-0 sm:ml-4">No credit card required.</p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

export default Landing;
