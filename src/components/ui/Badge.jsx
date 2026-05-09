import React from 'react';
import { cn } from '../../utils/cn';

function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-slate-800 text-slate-100 border border-slate-700',
    primary: 'bg-blue-600/10 text-blue-400 border border-blue-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
