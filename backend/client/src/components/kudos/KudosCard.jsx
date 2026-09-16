import React from 'react';
import { ArrowRight, Sparkles, Clock, Building2 } from 'lucide-react';
import ReactionPicker from './ReactionPicker';

const KudosCard = ({ kudos }) => {
  const { _id, sender, recipient, points, message, tags, reactionsCount, userReactions, createdAt } = kudos;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-200 space-y-4">
      {/* Card Header: Sender -> Recipient */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* Sender Avatar */}
          <img
            src={sender?.avatar}
            alt={sender?.name}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 object-cover ring-2 ring-brand-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">{sender?.name}</span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {sender?.department}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>recognized</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{recipient?.name}</span>
              <span className="text-slate-400">({recipient?.department})</span>
            </div>
          </div>
        </div>

        {/* Points Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-sm rounded-full shadow-sm shadow-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>+{points} Points</span>
        </div>
      </div>

      {/* Appreciation Message */}
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
        "{message}"
      </p>

      {/* Value Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags?.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold text-xs rounded-md border border-brand-100 dark:border-brand-900/50"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: Date & Reactions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <ReactionPicker
          kudosId={_id}
          initialCounts={reactionsCount}
          initialUserReactions={userReactions || []}
        />
      </div>
    </div>
  );
};

export default KudosCard;
