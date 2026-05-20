import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-8 rounded-2xl group transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--glow)] hover:border-[var(--accent-primary)]/30 cursor-default relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:border-[var(--accent-primary)]/50 transition-colors duration-300 shadow-sm">
          <Icon className="w-7 h-7 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
        </div>
        
        <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3 tracking-wide">
          {title}
        </h3>
        
        <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
