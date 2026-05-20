import React from "react";

export function JobCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-[var(--bg-secondary)] rounded w-3/4" />
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2" />
        </div>
        <div className="h-6 w-20 bg-[var(--bg-secondary)] rounded-full" />
      </div>
      <div className="flex gap-4">
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-24" />
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-20" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => <div key={i} className="h-6 bg-[var(--bg-secondary)] rounded-lg w-16" />)}
      </div>
      <div className="h-12 bg-[var(--bg-secondary)] rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-[var(--border)] animate-pulse bg-[var(--bg-card)]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-24" />
        <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-xl" />
      </div>
      <div className="h-10 bg-[var(--bg-secondary)] rounded w-20" />
      <div className="h-4 bg-[var(--bg-secondary)] rounded w-32" />
    </div>
  );
}
