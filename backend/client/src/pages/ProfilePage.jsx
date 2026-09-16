import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Award, Gift, Building2, Mail, Shield, Sparkles, Heart, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import KudosCard from '../components/kudos/KudosCard';
import StatCard from '../components/common/StatCard';
import { CardSkeleton } from '../components/common/Skeleton';
import api from '../services/api';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const isSelf = !id || id === currentUser?._id;
  const [profile, setProfile] = useState(isSelf ? currentUser : null);
  const [receivedKudos, setReceivedKudos] = useState([]);
  const [sentKudos, setSentKudos] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(!isSelf);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userId = id || currentUser?._id;
        if (!userId) return;

        const [userRes, receivedRes, sentRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get('/kudos/received'),
          api.get('/kudos/sent')
        ]);

        if (userRes.data.success) {
          setProfile(userRes.data.user);
          if (userRes.data.user.kudosReceived) setReceivedKudos(userRes.data.user.kudosReceived);
          if (userRes.data.user.kudosSent) setSentKudos(userRes.data.user.kudosSent);
        }

        if (isSelf) {
          if (receivedRes.data.success) setReceivedKudos(receivedRes.data.kudos);
          if (sentRes.data.success) setSentKudos(sentRes.data.kudos);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, currentUser, isSelf]);

  if (loading && !profile) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const targetUser = profile || currentUser;

  return (
    <div className="space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={targetUser?.avatar}
          alt={targetUser?.name}
          className="w-24 h-24 rounded-full bg-slate-100 object-cover ring-4 ring-brand-500/30 shadow-md"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{targetUser?.name}</h1>
            <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 font-bold text-xs rounded-md border border-brand-100">
              {targetUser?.department}
            </span>
            {targetUser?.role === 'admin' && (
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-md border border-rose-100 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {targetUser?.email}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {targetUser?.department} Department
            </span>
          </div>

          {/* Badges List */}
          <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
            {targetUser?.stats?.badges?.length > 0 ? (
              targetUser.stats.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-semibold"
                  title={badge.desc}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-medium">No badges unlocked yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Giving Allowance"
          value={`${targetUser?.givingAllowance || 0} pts`}
          subtitle="Monthly quota"
          icon={Gift}
          color="brand"
        />
        <StatCard
          title="Earned Points"
          value={`${targetUser?.earnedPoints || 0} pts`}
          subtitle="Total peer points"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Kudos Received"
          value={receivedKudos.length}
          subtitle="Received recognitions"
          icon={Heart}
          color="rose"
        />
        <StatCard
          title="Kudos Sent"
          value={sentKudos.length}
          subtitle="Sent recognitions"
          icon={Send}
          color="purple"
        />
      </div>

      {/* Recognition History Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'received'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kudos Received ({receivedKudos.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'sent'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kudos Sent ({sentKudos.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'received' ? (
          receivedKudos.length > 0 ? (
            <div className="space-y-4">
              {receivedKudos.map((kudos) => (
                <KudosCard key={kudos._id} kudos={kudos} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-sm border border-slate-200">
              No kudos received yet.
            </div>
          )
        ) : sentKudos.length > 0 ? (
          <div className="space-y-4">
            {sentKudos.map((kudos) => (
              <KudosCard key={kudos._id} kudos={kudos} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-sm border border-slate-200">
            No kudos sent yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
