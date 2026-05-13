import React from "react";
import { motion } from "framer-motion";
import { Download, ChevronRight, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import ScoreRing from "../../components/ScoreRing";

export default function Results() {
  const score = 84;

  const breakdowns = [
    { label: "Experience Match", score: 90, color: "var(--accent-secondary)" },
    { label: "Skills Density", score: 65, color: "#eab308" },
    { label: "Action Verbs", score: 85, color: "var(--accent-primary)" },
    { label: "Formatting (ATS)", score: 100, color: "var(--accent-secondary)" },
  ];

  const missingKeywords = ["Kubernetes", "Microservices", "CI/CD", "GraphQL", "Agile Leadership"];

  const suggestions = [
    { type: "critical", text: "Add 'Kubernetes' and 'CI/CD' to your skills section to pass the primary ATS filter." },
    { type: "improvement", text: "Quantify your impact in the 'Software Engineer' role. E.g., 'Improved performance by X%'." },
    { type: "good", text: "Excellent use of action verbs in your recent experience." },
    { type: "improvement", text: "Shorten your professional summary. Keep it to 3 impactful sentences." },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Score & Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50" />
            <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-8">Overall Match</h2>
            <ScoreRing score={score} size={220} strokeWidth={14} />
            
            <button className="mt-10 group relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10 hover:border-[var(--border)]">
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              Download Report
            </button>
          </motion.div>

          {/* Breakdown Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-3xl p-8"
          >
            <h3 className="font-display text-lg font-bold text-white mb-6">Score Breakdown</h3>
            <div className="space-y-6">
              {breakdowns.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-primary)]">{item.label}</span>
                    <span className="font-bold font-display" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: 0.5 + (idx * 0.1), ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}80` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Insights & Keywords */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Missing Keywords */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-3xl p-8 border-l-[4px] border-l-[#eab308]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Missing Keywords</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Add these to pass ATS filters for this role.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#eab308]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#eab308]" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {missingKeywords.map((kw, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1), type: "spring" }}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:border-[#eab308]/50 hover:text-white transition-colors cursor-default"
                >
                  + {kw}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card rounded-3xl p-8 flex-1"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl font-bold text-white">AI Recommendations</h3>
              <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
            </div>

            <div className="space-y-4">
              {suggestions.map((sug, i) => {
                const isCritical = sug.type === "critical";
                const isGood = sug.type === "good";
                
                let icon = <ChevronRight className="w-4 h-4 text-slate-500" />;
                if (isCritical) icon = <AlertTriangle className="w-4 h-4 text-red-400" />;
                if (isGood) icon = <CheckCircle className="w-4 h-4 text-[var(--accent-secondary)]" />;

                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (i * 0.15) }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-[var(--border)] hover:bg-slate-900 transition-colors group"
                  >
                    <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-black/50 border border-[var(--border)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      {icon}
                    </div>
                    <div>
                      <p className={`text-sm leading-relaxed ${isCritical ? "text-slate-200" : "text-[var(--text-muted)]"}`}>
                        {sug.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10">
              <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-black bg-[var(--accent-primary)] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[var(--glow)] w-full md:w-auto">
                Edit Resume <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
