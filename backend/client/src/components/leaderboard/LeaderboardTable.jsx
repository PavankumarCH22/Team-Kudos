import React from 'react';
import { Award, Sparkles } from 'lucide-react';

const LeaderboardTable = ({ rankings = [] }) => {
  if (rankings.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-sm border border-slate-200 dark:border-slate-800">
        No kudos activity recorded for this period yet.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4 text-center">Kudos Count</th>
              <th className="px-6 py-4 text-right">Points Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rankings.map((item) => (
              <tr key={item.userId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                      item.rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : item.rank === 2
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : item.rank === 3
                        ? 'bg-amber-900/20 text-amber-900 dark:text-amber-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    #{item.rank}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{item.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-semibold">
                    {item.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                  {item.kudosCount}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-extrabold text-sm rounded-full border border-amber-200 dark:border-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {item.totalPoints} pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
