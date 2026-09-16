import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200" />
        <div className="space-y-1.5">
          <div className="w-32 h-4 bg-slate-200 rounded" />
          <div className="w-24 h-3 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="w-20 h-7 bg-amber-100 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="w-full h-4 bg-slate-200 rounded" />
      <div className="w-3/4 h-4 bg-slate-200 rounded" />
    </div>
    <div className="flex gap-2">
      <div className="w-16 h-5 bg-brand-100 rounded" />
      <div className="w-20 h-5 bg-brand-100 rounded" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="w-6 h-6 bg-slate-200 rounded" /></td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-200 rounded-full" />
        <div className="w-32 h-4 bg-slate-200 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="w-20 h-4 bg-slate-200 rounded" /></td>
    <td className="px-6 py-4"><div className="w-16 h-4 bg-slate-200 rounded" /></td>
  </tr>
);
