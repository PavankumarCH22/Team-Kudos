import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Gift, Award, Send, ArrowRight, Sparkles, Heart, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import KudosCard from '../components/kudos/KudosCard';
import { CardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const { openGiveKudos } = useOutletContext();

  const [recentKudos, setRecentKudos] = useState([]);
  const [topLeaderboard, setTopLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [feedRes, leaderRes] = await Promise.all([
        api.get('/kudos?limit=4'),
        api.get('/leaderboard?limit=3')
      ]);

      if (feedRes.data.success) {
        setRecentKudos(feedRes.data.kudos);
      }
      if (leaderRes.data.success) {
        setTopLeaderboard(leaderRes.data.leaderboard);
      }
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleCreated = () => fetchDashboardData();
    window.addEventListener('kudos:created', handleCreated);
    return () => window.removeEventListener('kudos:created', handleCreated);
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-brand-100">
              Department: {user?.department}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
              Recognize team members for great work, build team spirit, and share appreciation across departments.
            </p>
          </div>

          <button
            onClick={openGiveKudos}
            className="flex-shrink-0 flex items-center justify-center gap-2 py-3.5 px-6 bg-white hover:bg-brand-50 text-brand-700 font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm"
          >
            <Send className="w-4 h-4 text-brand-600" />
            <span>Give Kudos Now</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Giving Allowance"
          value={`${user?.givingAllowance || 0} pts`}
          subtitle="Refreshes monthly to 100 pts"
          icon={Gift}
          color="brand"
        />
        <StatCard
          title="Earned Recognition"
          value={`${user?.earnedPoints || 0} pts`}
          subtitle="Total points received from peers"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Kudos Received"
          value={user?.stats?.kudosReceivedCount || 0}
          subtitle="Times peers recognized you"
          icon={Heart}
          color="rose"
        />
        <StatCard
          title="Kudos Sent"
          value={user?.stats?.kudosSentCount || 0}
          subtitle="Appreciations shared by you"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Kudos Feed (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Company Wall Activity</h2>
              <p className="text-xs text-slate-500">Live feed of recent employee appreciations</p>
            </div>
            <Link
              to="/feed"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>View Full Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : recentKudos.length > 0 ? (
            <div className="space-y-4">
              {recentKudos.map((kudos) => (
                <KudosCard key={kudos._id} kudos={kudos} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-sm border border-slate-200">
              No recent kudos found. Be the first to appreciate a colleague!
            </div>
          )}
        </div>

        {/* Sidebar Widgets (1 Column) */}
        <div className="space-y-6">
          {/* Top Monthly Contributors Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Monthly Top Peers</h3>
              </div>
              <Link to="/leaderboard" className="text-xs text-brand-600 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {topLeaderboard.slice(0, 3).map((item, idx) => (
                <div key={item.userId} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xs text-slate-400 w-4">#{idx + 1}</span>
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover bg-slate-100" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.department}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    +{item.totalPoints} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Earned Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">My Recognition Badges</h3>
            <div className="flex flex-wrap gap-2">
              {user?.stats?.badges?.length > 0 ? (
                user.stats.badges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    title={b.desc}
                  >
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Earn recognition points from peers to unlock badges!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
