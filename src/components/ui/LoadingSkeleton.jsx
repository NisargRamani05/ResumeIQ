import React from "react";

export function JobCardSkeleton() {
  return (
    <div className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="h-6 w-20 bg-slate-800 rounded-lg" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 bg-slate-800 rounded w-24" />
        <div className="h-3 bg-slate-800 rounded w-20" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => <div key={i} className="h-5 bg-slate-800 rounded-full w-16" />)}
      </div>
      <div className="h-10 bg-slate-800 rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-800 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#0d1a2d] border border-slate-800 rounded-2xl p-5 animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-800 rounded w-24" />
        <div className="w-8 h-8 bg-slate-800 rounded-lg" />
      </div>
      <div className="h-8 bg-slate-800 rounded w-16" />
      <div className="h-3 bg-slate-800 rounded w-32" />
    </div>
  );
}
