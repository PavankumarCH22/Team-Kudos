import React from 'react';
import { Gift, Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No kudos posts found', description = 'Be the first to appreciate a colleague!', actionText, onAction }) => (
  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
    <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mx-auto">
      <Inbox className="w-8 h-8" />
    </div>
    <div className="max-w-xs mx-auto space-y-1">
      <h3 className="font-bold text-slate-900 text-base">{title}</h3>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
      >
        <Gift className="w-4 h-4" />
        <span>{actionText}</span>
      </button>
    )}
  </div>
);

export default EmptyState;
