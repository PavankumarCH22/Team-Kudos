import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Filter, Sparkles } from 'lucide-react';
import LeaderboardPodium from '../components/leaderboard/LeaderboardPodium';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import { CardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

const LeaderboardPage = () => {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedDept, setSelectedDept] = useState('');

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        year: selectedYear,
        month: selectedMonth
      });

      if (selectedDept) params.append('department', selectedDept);

      const res = await api.get(`/leaderboard?${params.toString()}`);
      if (res.data.success) {
        setLeaderboard(res.data.leaderboard);
      }
    } catch (err) {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedYear, selectedMonth, selectedDept]);

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-amber-100">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Monthly Recognition Standings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Monthly Leaderboard</h1>
          <p className="text-xs sm:text-sm text-amber-100">
            Ranking employees based on total kudos points received from colleagues this month.
          </p>
        </div>

        {/* Filters Box */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="py-2 px-3 bg-white text-slate-800 font-bold rounded-xl text-xs focus:outline-none"
          >
            {[
              { num: 1, name: 'January' },
              { num: 2, name: 'February' },
              { num: 3, name: 'March' },
              { num: 4, name: 'April' },
              { num: 5, name: 'May' },
              { num: 6, name: 'June' },
              { num: 7, name: 'July' },
              { num: 8, name: 'August' },
              { num: 9, name: 'September' },
              { num: 10, name: 'October' },
              { num: 11, name: 'November' },
              { num: 12, name: 'December' }
            ].map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Department Selector */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="py-2 px-3 bg-white text-slate-800 font-bold rounded-xl text-xs focus:outline-none"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Top 3 Visual Highlights Podium */}
          {leaderboard.length >= 2 && <LeaderboardPodium topThree={topThree} />}

          {/* Leaderboard Table */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Full Monthly Rankings</h2>
            <LeaderboardTable rankings={leaderboard} />
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
