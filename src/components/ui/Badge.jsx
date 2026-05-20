import React from 'react';
import { cn } from '../../utils/cn';

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)]',
    primary: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20',
    success: 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20',
    warning: 'bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors shadow-sm',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
