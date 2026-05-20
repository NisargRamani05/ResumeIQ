import React from "react";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-secondary)]/50"
    >
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm">
          <Icon className="w-10 h-10 text-[var(--text-muted)]" />
        </div>
      )}
      <h3 className="text-[var(--text-primary)] font-display font-bold text-2xl mb-2">{title}</h3>
      {description && <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm">{description}</p>}
      {action}
    </motion.div>
  );
}
