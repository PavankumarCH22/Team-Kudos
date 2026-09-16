import React, { useState, useEffect } from 'react';
import { BarChart3, Building2, Sparkles, Heart } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { CardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

const DepartmentAnalyticsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeptStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/leaderboard/departments');
        if (res.data.success) {
          setStats(res.data.departmentStats);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    fetchDeptStats();
  }, []);

  const totalCompanyPoints = stats.reduce((acc, curr) => acc + curr.totalPoints, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Department Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500">Distribution of recognition points and kudos across company teams</p>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="space-y-8">
          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((dept) => {
              const percentage = totalCompanyPoints > 0 ? Math.round((dept.totalPoints / totalCompanyPoints) * 100) : 0;
              return (
                <div
                  key={dept.department}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-slate-900">{dept.department}</span>
                    <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-black text-slate-900">{dept.totalPoints} pts</div>
                    <p className="text-xs text-slate-500">{dept.totalKudos} total appreciations</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                      <span>Share of total</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Summary Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Department Performance Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Total Points</th>
                    <th className="px-4 py-3">Kudos Sent/Received</th>
                    <th className="px-4 py-3">Contribution Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.map((dept) => {
                    const percentage = totalCompanyPoints > 0 ? Math.round((dept.totalPoints / totalCompanyPoints) * 100) : 0;
                    return (
                      <tr key={dept.department} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{dept.department}</td>
                        <td className="px-4 py-3 font-semibold text-brand-600">{dept.totalPoints} pts</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{dept.totalKudos}</td>
                        <td className="px-4 py-3 font-medium text-slate-500">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentAnalyticsPage;
