import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ReactionPicker = ({ kudosId, initialCounts = {}, initialUserReactions = [] }) => {
  const { showError } = useToast();
  const [counts, setCounts] = useState({
    plusOne: initialCounts.plusOne || 0,
    clap: initialCounts.clap || 0,
    fire: initialCounts.fire || 0
  });

  const [userReactions, setUserReactions] = useState(initialUserReactions);
  const [loadingEmoji, setLoadingEmoji] = useState(null);

  const emojiOptions = [
    { emoji: '+1', key: 'plusOne', label: 'thumbs up' },
    { emoji: '👏', key: 'clap', label: 'clap' },
    { emoji: '🔥', key: 'fire', label: 'fire' }
  ];

  const handleToggle = async (emoji, key) => {
    if (loadingEmoji) return;

    const hasReacted = userReactions.includes(emoji);

    // Optimistic UI Update
    setLoadingEmoji(emoji);
    setUserReactions((prev) =>
      hasReacted ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
    setCounts((prev) => ({
      ...prev,
      [key]: hasReacted ? Math.max(0, prev[key] - 1) : prev[key] + 1
    }));

    try {
      const res = await api.post(`/kudos/${kudosId}/reactions`, { emoji });
      if (res.data.success) {
        setCounts(res.data.reactionsCount);
        setUserReactions(res.data.userReactions);
      }
    } catch (error) {
      // Rollback on error
      setUserReactions(initialUserReactions);
      setCounts(initialCounts);
      showError('Failed to update reaction');
    } finally {
      setLoadingEmoji(null);
    }
  };

  return (
    <div className="flex items-center gap-2 pt-2">
      {emojiOptions.map(({ emoji, key }) => {
        const isActive = userReactions.includes(emoji);
        const count = counts[key] || 0;

        return (
          <button
            key={emoji}
            onClick={() => handleToggle(emoji, key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 transform active:scale-95 ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-sm ring-2 ring-amber-400/20'
                : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80'
            }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionPicker;
