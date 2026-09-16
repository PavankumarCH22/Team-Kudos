import React from 'react';
import { Crown, Sparkles, Trophy } from 'lucide-react';

const LeaderboardPodium = ({ topThree }) => {
  if (!topThree || topThree.length === 0) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 items-end">
      {/* 2nd Place (Silver) */}
      {second && (
        <div className="bg-gradient-to-b from-slate-100 to-white rounded-2xl p-5 border border-slate-200 text-center shadow-sm order-2 md:order-1 transform hover:-translate-y-1 transition-transform">
          <div className="relative inline-block mb-3">
            <img
              src={second.avatar}
              alt={second.name}
              className="w-16 h-16 rounded-full mx-auto ring-4 ring-slate-300 object-cover"
            />
            <div className="absolute -bottom-2 right-0 bg-slate-300 text-slate-800 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              2
            </div>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{second.name}</h4>
          <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-700 font-semibold text-[10px] rounded-md mt-1">
            {second.department}
          </span>
          <div className="mt-3 font-extrabold text-lg text-slate-700 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-slate-400" />
            <span>{second.totalPoints} pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{second.kudosCount} kudos received</p>
        </div>
      )}

      {/* 1st Place (Gold Champion) */}
      {first && (
        <div className="bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white rounded-2xl p-6 border-2 border-amber-400 text-center shadow-md order-1 md:order-2 transform hover:-translate-y-2 transition-transform">
          <div className="relative inline-block mb-3">
            <Crown className="w-7 h-7 text-amber-500 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
            <img
              src={first.avatar}
              alt={first.name}
              className="w-20 h-20 rounded-full mx-auto ring-4 ring-amber-400 object-cover shadow-md"
            />
            <div className="absolute -bottom-2 right-1 bg-amber-500 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              1
            </div>
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">{first.name}</h4>
          <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-md mt-1">
            {first.department}
          </span>
          <div className="mt-3 font-black text-2xl text-amber-600 flex items-center justify-center gap-1">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>{first.totalPoints} pts</span>
          </div>
          <p className="text-xs text-amber-700/80 font-medium mt-0.5">{first.kudosCount} kudos received</p>
        </div>
      )}

      {/* 3rd Place (Bronze) */}
      {third && (
        <div className="bg-gradient-to-b from-amber-900/5 to-white rounded-2xl p-5 border border-amber-900/20 text-center shadow-sm order-3 transform hover:-translate-y-1 transition-transform">
          <div className="relative inline-block mb-3">
            <img
              src={third.avatar}
              alt={third.name}
              className="w-16 h-16 rounded-full mx-auto ring-4 ring-amber-700/40 object-cover"
            />
            <div className="absolute -bottom-2 right-0 bg-amber-700 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              3
            </div>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{third.name}</h4>
          <span className="inline-block px-2 py-0.5 bg-amber-100/60 text-amber-900 font-semibold text-[10px] rounded-md mt-1">
            {third.department}
          </span>
          <div className="mt-3 font-extrabold text-lg text-amber-800 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>{third.totalPoints} pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{third.kudosCount} kudos received</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPodium;
